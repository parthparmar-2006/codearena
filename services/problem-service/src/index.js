import { config } from './config.js';
import { createPool } from './db.js';
import { setupDatabase } from './setup.js';
import { createApp } from './app.js';

const db = createPool(config.db);
await setupDatabase(db);

const app = createApp({ db, internalToken: config.internalToken });
const server = app.listen(config.port, () => {
  console.log(`problem-service listening on port ${config.port}`);
});

function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  server.close(async () => {
    await db.end();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
