import { app } from './app.js';
import { config } from './config/index.js';
import { logger } from './lib/logger.js';
import { connectDb, closeDb } from './db/index.js';

async function bootstrap() {
  try {
    await connectDb();
    logger.info('database connected');
  } catch (err) {
    logger.fatal({ err }, 'database connection failed');
    process.exit(1);
  }

  const server = app.listen(config.port, () => {
    logger.info({ port: config.port, env: config.env }, 'server started');
  });

  async function shutdown(reason, err) {
    logger.fatal({ err, reason }, 'shutting down');
    server.close(async () => {
      try {
        await closeDb();
      } catch (e) {
        logger.error({ err: e }, 'error closing db');
      }
      process.exit(err ? 1 : 0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  }

  process.on('uncaughtException', (e) => shutdown('uncaughtException', e));
  process.on('unhandledRejection', (e) => shutdown('unhandledRejection', e));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap();