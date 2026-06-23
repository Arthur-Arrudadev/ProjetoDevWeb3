import "dotenv/config";

import { Pool, type PoolClient } from "pg";
import fs from "node:fs";
import axios from "axios";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

async function waitForDatabase(
	retries = 20,
	delay = 3000
): Promise<void> {

	for (let i = 1; i <= retries; i++) {

		try {

			await pool.query("SELECT 1");

			console.log("✅ Banco conectado com sucesso.");

			return;

		} catch {

			console.log(
				`⏳ Aguardando banco... tentativa ${i}/${retries}`
			);

			await new Promise(resolve =>
				setTimeout(resolve, delay)
			);
		}
	}

	throw new Error(
		"❌ Não foi possível conectar ao PostgreSQL."
	);
}

export type EnemResponse = {
	metadata: Metadata;
	questions: Question[];
};

export type Metadata = {
	limit: number;
	offset: number;
	total: number;
	hasMore: boolean;
};

export type Question = {
	title: string;
	index: number;
	discipline: string;
	language: string | null;
	year: number;
	context: string;
	files: string[];
	correctAlternative: string;
	alternativesIntroduction: string;
	alternatives: Alternative[];
};

export type Alternative = {
	letter: string;
	text: string;
	file: string | null;
	isCorrect: boolean;
};

class DataFetch {

	constructor(
		private readonly linkApi: string
	) { }

	async getData(): Promise<EnemResponse> {

		const response = await axios.get<EnemResponse>(
			this.linkApi
		);

		return response.data;
	}
}

class StorageData extends DataFetch {

	private readonly folderPath = "./file";

	constructor(linkApi: string) {
		super(linkApi);
	}

	private createFolder(folderPath: string): void {

		if (!fs.existsSync(folderPath)) {

			fs.mkdirSync(folderPath, {
				recursive: true
			});
		}
	}

	async createFile(): Promise<Question[]> {

		this.createFolder(this.folderPath);

		const data = await this.getData();

		fs.writeFileSync(
			`${this.folderPath}/questions.json`,
			JSON.stringify(data, null, 4),
			"utf-8"
		);

		console.log(
			`📁 JSON salvo em ${this.folderPath}/questions.json`
		);

		return data.questions;
	}
}

class ImportToDatabase extends StorageData {

	constructor(linkApi: string) {
		super(linkApi);
	}

	private async insertQuestion(
		client: PoolClient,
		q: Question
	): Promise<{
		id: number;
		inserted: boolean;
	}> {

		const { rows } = await client.query<{
			id: number
		}>(
			`
			INSERT INTO questions (
				question_index,
				year,
				title,
				discipline,
				language,
				context,
				files,
				correct_alternative,
				alternatives_introduction
			)
			VALUES (
				$1,$2,$3,$4,$5,$6,$7,$8,$9
			)
			ON CONFLICT (
				question_index,
				year
			)
			DO NOTHING
			RETURNING id
			`,
			[
				q.index,
				q.year,
				q.title,
				q.discipline,
				q.language ?? null,
				q.context ?? null,
				q.files ?? [],
				q.correctAlternative,
				q.alternativesIntroduction ?? null
			]
		);

		if (rows.length > 0) {

			return {
				id: rows[0].id,
				inserted: true
			};
		}

		const existing = await client.query<{
			id: number
		}>(
			`
			SELECT id
			FROM questions
			WHERE question_index = $1
			AND year = $2
			`,
			[
				q.index,
				q.year
			]
		);

		return {
			id: existing.rows[0].id,
			inserted: false
		};
	}

	private async insertAlternatives(
		client: PoolClient,
		questionId: number,
		alternatives: Alternative[]
	): Promise<void> {

		for (const alt of alternatives) {

			await client.query(
				`
				INSERT INTO alternatives (
					question_id,
					letter,
					text,
					file,
					is_correct
				)
				VALUES (
					$1,$2,$3,$4,$5
				)
				ON CONFLICT (
					question_id,
					letter
				)
				DO NOTHING
				`,
				[
					questionId,
					alt.letter,
					alt.text,
					alt.file ?? null,
					alt.isCorrect
				]
			);
		}
	}

	private async importQuestions(
		questions: Question[]
	): Promise<void> {

		const client = await pool.connect();

		let inserted = 0;
		let skipped = 0;

		try {

			await client.query("BEGIN");

			for (const question of questions) {

				const result =
					await this.insertQuestion(
						client,
						question
					);

				await this.insertAlternatives(
					client,
					result.id,
					question.alternatives
				);

				if (result.inserted) {

					inserted++;

				} else {

					skipped++;
				}
			}

			await client.query("COMMIT");

		} catch (err) {

			await client.query("ROLLBACK");

			console.error(
				"❌ Erro ao importar questões:",
				err
			);

			throw err;

		} finally {

			client.release();
		}

		console.log(
			`✅ Inseridas: ${inserted} | ⏭️ Ignoradas: ${skipped}`
		);
	}

	async run(): Promise<void> {

		try {

			await waitForDatabase();

			console.log(
				"📥 Buscando dados da API..."
			);

			const questions =
				await this.createFile();

			console.log(
				`📋 ${questions.length} questões encontradas.`
			);

			console.log(
				"💾 Importando para o banco..."
			);

			await this.importQuestions(
				questions
			);

			console.log("🎉 Concluído!");

		} finally {

			await pool.end();
		}
	}
}

new ImportToDatabase(
	"https://api.enem.dev/v1/exams/2019/questions?limit=10"
)
	.run()
	.catch(console.error);