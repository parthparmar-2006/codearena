import { readFile } from 'node:fs/promises';
import { problems } from './seed/index.js';

const SETUP_LOCK_ID = 4001;

export async function setupDatabase(pool) {
  const schema = await readFile(new URL('./schema.sql', import.meta.url), 'utf8');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock($1)', [SETUP_LOCK_ID]);
    await client.query(schema);
    const { rows } = await client.query('SELECT count(*)::int AS count FROM problems');
    if (rows[0].count === 0) await seed(client);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function seed(client) {
  for (const p of problems) {
    const { rows } = await client.query(
      `INSERT INTO problems (slug, title, difficulty, statement_md, time_limit_ms, memory_limit_mb, starter_code)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [p.slug, p.title, p.difficulty, p.statement, p.timeLimitMs, p.memoryLimitMb, p.starterCode],
    );
    for (const t of p.tests) {
      await client.query(
        'INSERT INTO test_cases (problem_id, input, expected_output, is_sample) VALUES ($1, $2, $3, $4)',
        [rows[0].id, t.input, t.output, t.sample ?? false],
      );
    }
  }
  console.log(`Seeded ${problems.length} problems`);
}
