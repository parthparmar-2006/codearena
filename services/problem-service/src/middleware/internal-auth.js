import { timingSafeEqual } from 'node:crypto';

export function requireInternalToken(token) {
  const expected = Buffer.from(token);
  return (req, res, next) => {
    const given = Buffer.from(req.get('x-internal-token') ?? '');
    if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  };
}
