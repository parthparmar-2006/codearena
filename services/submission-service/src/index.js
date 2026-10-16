import { Redis } from 'ioredis';
import { config } from './config.js';
import { createPool, setupDatabase } from './db.js';
import { createApp } from './app.js';

const db = createPool(config.db);
await setupDatabase(db);

const redis = new Redis(config.redisUrl, { maxRetriesPerRequest: 3 });
redis.on('error', (err) => console.error('Redis error:', err.message));

const app = createApp({ db, redis, internalToken: config.internalToken });
const server = app.listen(config.port, () => {
  console.log(`submission-service listening on port ${config.port}`);
});

function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  server.close(async () => {
    await Promise.allSettled([db.end(), redis.quit()]);
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
