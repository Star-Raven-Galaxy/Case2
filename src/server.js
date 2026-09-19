import { app } from './app.js';
import { config } from './config/index.js';
import { logger } from './lib/logger.js';

const server = app.listen(config.port, () => {
  logger.info(
    { port: config.port, env: config.env },
    'server started'
  );
});

function shutdown(reason, err) {
  logger.fatal({ err, reason }, 'shutting down');
  server.close(() => process.exit(1));
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('uncaughtException', (err) => shutdown('uncaughtException', err));
process.on('unhandledRejection', (err) => shutdown('unhandledRejection', err));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));