import { Redis } from 'ioredis';
import { config } from './config.js';
import { createApi } from './api.js';
import { createHealthServer } from './health.js';
import { runWorker } from './worker.js';

const redis = new Redis(config.redisUrl, { maxRetriesPerRequest: 3 });
// BRPOP blocks its connection, so the queue gets a connection of its own.
const queue = redis.duplicate();
for (const client of [redis, queue]) {
  client.on('error', (err) => console.error('Redis error:', err.message));
}

let stopping = false;
const api = createApi(config);
const health = createHealthServer(redis).listen(config.healthPort, () => {
  console.log(`judge-service health on port ${config.healthPort}`);
});
const worker = runWorker({ queue, api, jobsDir: config.jobsDir, isStopping: () => stopping });

async function shutdown(signal) {
  if (stopping) return;
  stopping = true;
  console.log(`${signal} received, finishing current job`);
  setTimeout(() => process.exit(1), 25_000).unref();
  await worker;
  health.close();
  await Promise.allSettled([redis.quit(), queue.quit()]);
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
