import { Router } from 'express';

export function problemsRouter(db) {
  const router = Router();

  router.get('/', async (req, res) => {
    const { rows } = await db.query('SELECT id, slug, title, difficulty FROM problems ORDER BY id');
    res.json(rows);
  });

  router.get('/:slug', async (req, res) => {
    const { rows } = await db.query(
      `SELECT id, slug, title, difficulty, statement_md, time_limit_ms, memory_limit_mb, starter_code
       FROM problems WHERE slug = $1`,
      [req.params.slug],
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Problem not found' });

    const samples = await db.query(
      'SELECT input, expected_output FROM test_cases WHERE problem_id = $1 AND is_sample ORDER BY id',
      [rows[0].id],
    );
    res.json({ ...rows[0], samples: samples.rows });
  });

  return router;
}
