import { Router } from 'express';

export function internalRouter(db) {
  const router = Router();

  router.get('/problems/:id/testcases', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid problem id' });

    const problem = await db.query(
      'SELECT id AS problem_id, time_limit_ms, memory_limit_mb FROM problems WHERE id = $1',
      [id],
    );
    if (problem.rows.length === 0) return res.status(404).json({ error: 'Problem not found' });

    const { rows } = await db.query(
      'SELECT id, input, expected_output, is_sample FROM test_cases WHERE problem_id = $1 ORDER BY id',
      [id],
    );
    res.json({ ...problem.rows[0], testcases: rows });
  });

  return router;
}
