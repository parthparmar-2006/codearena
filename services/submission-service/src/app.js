import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { requestLogger } from './middleware/logger.js';
import { requireInternalToken } from './middleware/internal-auth.js';
import { notFound, errorHandler } from './middleware/errors.js';
import { submissionsRouter } from './routes/submissions.js';
import { internalRouter } from './routes/internal.js';

export function createApp({ db, redis, internalToken, log = true }) {
  const app = express();
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors());
  if (log) app.use(requestLogger);
  app.use(express.json({ limit: '256kb' }));

  app.get('/health', async (req, res) => {
    try {
      await Promise.all([db.query('SELECT 1'), redis.ping()]);
      res.json({ status: 'ok' });
    } catch {
      res.status(503).json({ error: 'Database or Redis unavailable' });
    }
  });

  app.use('/api/submissions', submissionsRouter({ db, redis }));
  app.use('/internal/submissions', requireInternalToken(internalToken), internalRouter(db));

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
