// src/services/auditService.js
import db from '../config/db.js';

const auditService = {
  log({ actorUserId = null, action, targetType = null, targetId = null, ipAddress = null, details = null }) {
    try {
      const detailsJson = details ? JSON.stringify(details) : null;
      db.prepare(
        `INSERT INTO audit_log (actor_user_id, action, target_type, target_id, ip_address, details)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).run(actorUserId, action, targetType, targetId, ipAddress, detailsJson);
    } catch (err) {
      // Non-blocking: audit failures should not break core flows
      console.error('[AUDIT] Failed to log action:', err.message);
    }
  }
};

export default auditService;
