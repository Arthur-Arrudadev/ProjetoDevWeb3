import { pool } from "../database/pg.js";

class PostgresQuestionRepository {

	async findUserAnswer(data) {

	const {
		user_id,
		question_id
	} = data;

	const result = await pool.query(
		`
		SELECT id
		FROM user_answers
		WHERE user_id = $1
		AND question_id = $2
		`,
		[
			user_id,
			question_id
		]
	);

	return result.rows[0];
}

async answerQuestion(data) {

	const {
		user_id,
		question_id,
		chosen_letter,
		is_correct
	} = data;

	await pool.query(
		`
		INSERT INTO user_answers (
			user_id,
			question_id,
			chosen_letter,
			is_correct
		)
		VALUES ($1,$2,$3,$4)
		`,
		[
			user_id,
			question_id,
			chosen_letter,
			is_correct
		]
	);
}

async updateResults(data) {

		const {
			user_id,
			discipline,
			is_correct
		} = data;

		await pool.query(
			`
			INSERT INTO results (
				user_id,
				discipline,
				total_questions,
				correct,
				wrong,
				to_review,
				evaluated_at
			)
			VALUES (
				$1,
				$2,
				1,
				$3,
				$4,
				0,
				CURRENT_DATE
			)
			ON CONFLICT (
				user_id,
				discipline,
				evaluated_at
			)
			DO UPDATE SET

				total_questions =
					results.total_questions + 1,

				correct =
					results.correct + EXCLUDED.correct,

				wrong =
					results.wrong + EXCLUDED.wrong
			`,
			[
				user_id,
				discipline,
				is_correct ? 1 : 0,
				is_correct ? 0 : 1
			]
		);
	}

	async findById(id) {

		const questionResult = await pool.query(
			`
			SELECT
				id,
				question_index,
				year,
				title,
				discipline,
				language,
				context,
				files,
				alternatives_introduction
			FROM questions
			WHERE id = $1
			`,
			[id]
		);

		if (!questionResult.rows.length) {
			return null;
		}

		const alternativesResult =
			await pool.query(
				`
				SELECT
					id,
					letter,
					text,
					file
				FROM alternatives
				WHERE question_id = $1
				ORDER BY letter ASC
				`,
				[id]
			);

		return {
			...questionResult.rows[0],
			alternatives:
				alternativesResult.rows
		};
	}

	async findAll(filters = {}) {

		const {
			discipline,
			year,
			limit = 10
		} = filters;

		let sql = `
			SELECT
				id,
				question_index,
				year,
				title,
				discipline,
				language,
				context,
				files,
				alternatives_introduction
			FROM questions
			WHERE 1=1
		`;

		const values = [];

		if (discipline) {

			values.push(discipline);

			sql += `
				AND discipline = $${values.length}
			`;
		}

		if (year) {

			values.push(year);

			sql += `
				AND year = $${values.length}
			`;
		}

		values.push(limit);

		sql += `
			ORDER BY question_index ASC
			LIMIT $${values.length}
		`;

		const result =
			await pool.query(sql, values);

		return result.rows;
	}

	async getCorrectAlternative(id) {

		const result = await pool.query(
			`
			SELECT correct_alternative
			FROM questions
			WHERE id = $1
			`,
			[id]
		);

		return result.rows[0];
	}
	async getFilters() {
		const disciplines = await pool.query(
			`SELECT DISTINCT discipline FROM questions ORDER BY discipline ASC`
		);
		const years = await pool.query(
			`SELECT DISTINCT year FROM questions ORDER BY year DESC`
		);
		return {
			disciplines: disciplines.rows.map(r => r.discipline),
			years: years.rows.map(r => r.year),
		};
	}
}

export default PostgresQuestionRepository;
