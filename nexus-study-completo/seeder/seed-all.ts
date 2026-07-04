import "dotenv/config";
import { Pool, type PoolClient } from "pg";
import axios from "axios";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

type Alternative = {
  letter: string;
  text: string;
  file: string | null;
  isCorrect: boolean;
};

type Question = {
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

type EnemResponse = {
  metadata: { limit: number; offset: number; total: number; hasMore: boolean };
  questions: Question[];
};

const YEARS = [2022, 2023, 2024];
const LIMIT_PER_DISCIPLINE = 25;

// Mapeamento de disciplina + language → nome individual
function translateDiscipline(discipline: string, language?: string | null): string {
  const d = discipline.toLowerCase().trim();
  const l = (language ?? "").toLowerCase().trim();

  if (d === "linguagens") {
    if (l === "espanhol") return "Espanhol";
    if (l === "ingles" || l === "inglês") return "Inglês";
    return "Português e Literaturas";
  }
  if (d === "matematica") return "Matemática";
  if (d === "ciencias-humanas") {
    // A API não separa, mas podemos alternar para enriquecer
    return "Ciências Humanas";
  }
  if (d === "ciencias-natureza") return "Ciências da Natureza";
  if (d === "ingles") return "Inglês";
  if (d === "espanhol") return "Espanhol";
  return discipline;
}

async function fetchQuestions(year: number, offset: number): Promise<EnemResponse> {
  const url = `https://api.enem.dev/v1/exams/${year}/questions?limit=10&offset=${offset}`;
  const response = await axios.get<EnemResponse>(url);
  return response.data;
}

async function insertQuestion(client: PoolClient, q: Question): Promise<{ id: number; inserted: boolean }> {
  const discipline = translateDiscipline(q.discipline, q.language);
  const { rows } = await client.query<{ id: number }>(
    `INSERT INTO questions (question_index, year, title, discipline, language, context, files, correct_alternative, alternatives_introduction)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (question_index, year) DO NOTHING RETURNING id`,
    [q.index, q.year, q.title, discipline, q.language ?? null, q.context ?? null, q.files ?? [], q.correctAlternative, q.alternativesIntroduction ?? null]
  );
  if (rows.length > 0) return { id: rows[0].id, inserted: true };
  const existing = await client.query<{ id: number }>(
    `SELECT id FROM questions WHERE question_index = $1 AND year = $2`,
    [q.index, q.year]
  );
  return { id: existing.rows[0].id, inserted: false };
}

async function insertAlternatives(client: PoolClient, questionId: number, alternatives: Alternative[]): Promise<void> {
  for (const alt of alternatives) {
    // Pula alternativas sem texto e sem arquivo (inválidas)
    const text = alt.text?.trim() || null;
    if (!text && !alt.file) continue;

    await client.query(
      `INSERT INTO alternatives (question_id, letter, text, file, is_correct)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (question_id, letter) DO NOTHING`,
      [questionId, alt.letter, text ?? "(sem texto)", alt.file ?? null, alt.isCorrect]
    );
  }
}

async function seedYear(year: number): Promise<void> {
  // Conta quantas questões já tem por disciplina neste ano
  const countResult = await pool.query(
    `SELECT discipline, COUNT(*) as total FROM questions WHERE year = $1 GROUP BY discipline`,
    [year]
  );
  const counts: Record<string, number> = {};
  for (const row of countResult.rows) {
    counts[row.discipline] = parseInt(row.total);
  }

  let offset = 0;
  let totalInserted = 0;
  let totalSkipped = 0;
  let hasMore = true;

  console.log(`\n📅 Buscando questões de ${year}...`);

  while (hasMore) {
    try {
      const data = await fetchQuestions(year, offset);
      hasMore = data.metadata.hasMore;

      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        for (const q of data.questions) {
          const discipline = translateDiscipline(q.discipline, q.language);

          // Pula se já tem 30 questões dessa disciplina neste ano
          if ((counts[discipline] ?? 0) >= LIMIT_PER_DISCIPLINE) {
            totalSkipped++;
            continue;
          }

          const result = await insertQuestion(client, q);
          await insertAlternatives(client, result.id, q.alternatives);

          if (result.inserted) {
            counts[discipline] = (counts[discipline] ?? 0) + 1;
            totalInserted++;
          } else {
            totalSkipped++;
          }
        }
        await client.query("COMMIT");
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      } finally {
        client.release();
      }

      console.log(`  offset ${offset}: ✅ processadas`);
      offset += 10;

      // Verifica se todas as disciplinas já atingiram o limite
      const EXPECTED_DISCIPLINES = [
        "Português e Literaturas",
        "Matemática",
        "Ciências Humanas",
        "Ciências da Natureza",
        "Espanhol",
      ];
      const allFull = EXPECTED_DISCIPLINES.every(
        d => (counts[d] ?? 0) >= LIMIT_PER_DISCIPLINE
      );
      if (allFull) {
        console.log(`  ✅ Limite de ${LIMIT_PER_DISCIPLINE} questões por disciplina atingido para ${year}.`);
        break;
      }

      await new Promise((r) => setTimeout(r, 8000));
    } catch (err: any) {
      if (err?.response?.status === 400 || err?.response?.status === 404) {
        console.log(`  Fim das questões de ${year}.`);
        break;
      }
      if (err?.response?.status === 429) {
        const retryAfter = parseInt(err?.response?.headers?.['retry-after'] ?? '60');
        const waitSec = Math.min(retryAfter, 120);
        console.log(`  ⏳ Limite da API atingido. Aguardando ${waitSec}s...`);
        await new Promise((r) => setTimeout(r, waitSec * 1000));
        continue;
      }
      throw err;
    }
  }

  console.log(`  📊 ${year}: Inseridas ${totalInserted} | Ignoradas ${totalSkipped}`);
}

async function main() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Banco conectado com sucesso.");
  } catch {
    console.error("❌ Não foi possível conectar ao banco.");
    process.exit(1);
  }

  // Atualiza nomes antigos no banco
  console.log("\n🔄 Atualizando nomes de disciplinas existentes...");
  const renames = [
    ["linguagens", "Português e Literaturas"],
    ["matematica", "Matemática"],
    ["ciencias-humanas", "Ciências Humanas"],
    ["ciencias-natureza", "Ciências da Natureza"],
    ["história e geografia", "Ciências Humanas"],
    ["português e linguagens", "Português e Literaturas"],
  ];
  for (const [raw, translated] of renames) {
    await pool.query(
      `UPDATE questions SET discipline = $1 WHERE LOWER(discipline) = $2`,
      [translated, raw]
    );
  }
  console.log("✅ Disciplinas atualizadas.");

  for (const year of YEARS) {
    await seedYear(year);
  }

  const { rows } = await pool.query(
    `SELECT discipline, year, COUNT(*) as total FROM questions GROUP BY discipline, year ORDER BY year, discipline`
  );
  console.log("\n📋 Resumo do banco:");
  console.table(rows);

  await pool.end();
  console.log("\n🎉 Concluído!");
}

main().catch(console.error);
