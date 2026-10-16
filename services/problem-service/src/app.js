import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { requestLogger } from './middleware/logger.js';
import { requireInternalToken } from './middleware/internal-auth.js';
import { notFound, errorHandler } from './middleware/errors.js';
import { problemsRouter } from './routes/problems.js';
import { internalRouter } from './routes/internal.js';

export function createApp({ db, internalToken, log = true }) {
  const app = express();
  app.use(helmet());
  app.use(cors());
  if (log) app.use(requestLogger);
  app.use(express.json());

  app.get('/health', async (req, res) => {
    try {
      await db.query('SELECT 1');
      res.json({ status: 'ok' });
    } catch {
      res.status(503).json({ error: 'Database unavailable' });
    }
  });

  app.use('/api/problems', problemsRouter(db));
  app.use('/internal', requireInternalToken(internalToken), internalRouter(db));

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
