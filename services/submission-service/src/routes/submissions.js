import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { QUEUE_KEY, PUBLIC_COLUMNS } from '../constants.js';
import { validateNewSubmission, isUuid, isPositiveInt } from '../validation.js';

export function submissionsRouter({ db, redis }) {
  const router = Router();

  const submitLimiter = rateLimit({
    windowMs: 60_000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many submissions, try again in a minute' },
  });

  router.post('/', submitLimiter, async (req, res) => {
    const error = validateNewSubmission(req.body);
    if (error) return res.status(400).json({ error });

    const { problemId, language, code } = req.body;
    const { rows } = await db.query(
      'INSERT INTO submissions (problem_id, language, code) VALUES ($1, $2, $3) RETURNING id',
      [problemId, language, code],
    );
    const { id } = rows[0];

    try {
      await redis.lpush(QUEUE_KEY, id);
    } catch (err) {
      await db.query('DELETE FROM submissions WHERE id = $1', [id]);
      throw err;
    }
    res.status(201).json({ id });
  });

  router.get('/', async (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return res.status(400).json({ error: 'limit must be an integer from 1 to 100' });
    }
    const problemId = req.query.problemId ? Number(req.query.problemId) : null;
    if (problemId !== null && !isPositiveInt(problemId)) {
      return res.status(400).json({ error: 'problemId must be a positive integer' });
    }

    const { rows } = await db.query(
      `SELECT ${PUBLIC_COLUMNS} FROM submissions
       WHERE ($1::int IS NULL OR problem_id = $1)
       ORDER BY created_at DESC LIMIT $2`,
      [problemId, limit],
    );
    res.json(rows);
  });

  router.get('/:id', async (req, res) => {
    if (!isUuid(req.params.id)) return res.status(400).json({ error: 'Invalid submission id' });
    const { rows } = await db.query(`SELECT ${PUBLIC_COLUMNS} FROM submissions WHERE id = $1`, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Submission not found' });
    res.json(rows[0]);
  });

  return router;
}
