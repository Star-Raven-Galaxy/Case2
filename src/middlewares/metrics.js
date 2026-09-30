import {
  httpRequestsTotal,
  httpRequestDuration,
  httpErrorsTotal,
} from '../lib/metrics.js';

export function metricsMiddleware(req, res, next) {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const route = req.route?.path || req.path || 'unknown';
    const labels = {
      method: req.method,
      route,
      status: res.statusCode,
    };

    httpRequestsTotal.inc(labels);

    const seconds = Number(process.hrtime.bigint() - start) / 1e9;
    httpRequestDuration.observe(labels, seconds);

    if (res.statusCode >= 400) {
      httpErrorsTotal.inc(labels);
    }
  });

  next();
}
