import { Router } from 'express';
import { PUBLIC_COLUMNS } from '../constants.js';
import { validateResultUpdate, isUuid } from '../validation.js';

export function internalRouter(db) {
  const router = Router();

  router.param('id', (req, res, next, id) => {
    if (!isUuid(id)) return res.status(400).json({ error: 'Invalid submission id' });
    next();
  });

  router.get('/:id', async (req, res) => {
    const { rows } = await db.query(`SELECT ${PUBLIC_COLUMNS}, code FROM submissions WHERE id = $1`, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Submission not found' });
    res.json(rows[0]);
  });

  router.patch('/:id', async (req, res) => {
    const error = validateResultUpdate(req.body);
    if (error) return res.status(400).json({ error });

    // Column names are safe to interpolate: validateResultUpdate only allows known fields.
    const fields = Object.keys(req.body);
    const assignments = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');
    const { rows } = await db.query(
      `UPDATE submissions SET ${assignments}, updated_at = now() WHERE id = $1 RETURNING ${PUBLIC_COLUMNS}`,
      [req.params.id, ...fields.map((field) => req.body[field])],
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Submission not found' });
    res.json(rows[0]);
  });

  return router;
}
