import { pool } from "./pg.js";

export async function waitForDatabase(retries = 20, delay = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      await pool.query("SELECT 1");
      console.log("Banco conectado com sucesso.");
      return;
    } catch (err) {
      console.log(`Aguardando banco... tentativa ${i}/${retries}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Não foi possível conectar ao PostgreSQL.");
}