import { readFile } from 'node:fs/promises';
import pg from 'pg';

export function createPool(dbConfig) {
  const pool = new pg.Pool({ ...dbConfig, max: 10 });
  pool.on('error', (err) => console.error('Postgres pool error:', err.message));
  return pool;
}

export async function setupDatabase(pool) {
  const schema = await readFile(new URL('./schema.sql', import.meta.url), 'utf8');
  await pool.query(`SELECT pg_advisory_xact_lock(4002);\n${schema}`);
}
