import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL;
export const hasDatabase = Boolean(connectionString);

export const pool = new Pool({
  connectionString,
  ssl: process.env.PGSSLMODE === "require" || process.env.VERCEL ? { rejectUnauthorized: false } : false
});

export async function query(text, params) {
  ensureDatabase();
  return pool.query(text, params);
}

export async function withTransaction(callback) {
  ensureDatabase();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

function ensureDatabase() {
  if (hasDatabase) {
    return;
  }
  const error = new Error("DATABASE_URL is not configured.");
  error.status = 503;
  error.publicMessage = "PostgreSQL не подключен. Добавьте DATABASE_URL или Postgres integration в Vercel.";
  throw error;
}
