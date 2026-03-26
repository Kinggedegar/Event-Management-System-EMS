// src/middleware/idempotency.js
import db from '../config/db.js';

const idempotencyMiddleware = (req, res, next) => {
  const key = req.headers['x-idempotency-key'];
  if (!key) return next();

  const userId = req.user?.id;
  if (!userId) return next();

  // Check for existing valid response
  const existing = db
    .prepare(
      `SELECT response_status, response_body 
       FROM idempotency_log 
       WHERE idempotency_key = ? 
         AND user_id = ? 
         AND expires_at > datetime('now')`
    )
    .get(key, userId);

  if (existing) {
    return res.status(existing.response_status).json(JSON.parse(existing.response_body));
  }

  // Capture successful responses only (2xx)
  const originalJson = res.json.bind(res);
  res.json = function (body) {
    const statusCode = res.statusCode || 200;

    if (statusCode >= 200 && statusCode < 300) {
      try {
        db.prepare(
          `INSERT INTO idempotency_log 
           (idempotency_key, user_id, endpoint, response_status, response_body, expires_at)
           VALUES (?, ?, ?, ?, ?, datetime('now', '+1 day'))`
        ).run(key, userId, req.originalUrl || req.path, statusCode, JSON.stringify(body));
      } catch (e) {
        console.error('Idempotency log failed (non-blocking):', e.message);
      }
    }
    originalJson(body);
  };

  next();
};

export default idempotencyMiddleware;