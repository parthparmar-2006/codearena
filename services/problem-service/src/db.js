import pg from 'pg';

export function createPool(dbConfig) {
  const pool = new pg.Pool({ ...dbConfig, max: 10 });
  pool.on('error', (err) => console.error('Postgres pool error:', err.message));
  return pool;
}
