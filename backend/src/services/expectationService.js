// src/services/expectationService.js
import db from '../config/db.js';

const expectationService = {
  submitExpectation(userId, eventId, text) {
    const result = db
      .prepare('INSERT INTO expectations (user_id, event_id, expectation_text) VALUES (?, ?, ?)')
      .run(userId, eventId, text);

    return { expectationId: result.lastInsertRowid };
  }
};

export default expectationService;