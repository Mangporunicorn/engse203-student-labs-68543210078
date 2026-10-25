import { Router } from 'express';
import { DatabaseSync } from 'node:sqlite';
import { config } from '../config.js';

const router = Router();

function db() {
  const d = new DatabaseSync(config.dbFile);
  d.exec('PRAGMA foreign_keys = ON');
  return d;
}

router.get('/', (req, res) => {
  const d = db();
  try {
    res.json(
      d.prepare('SELECT id, name, department FROM users ORDER BY id').all()
    );
  } finally {
    d.close();
  }
});

router.get('/:id/requests', (req, res) => {
  const d = db();
  try {
    const rows = d.prepare(
      `SELECT r.id, r.request_type AS requestType, r.status
       FROM requests r
       WHERE r.requester_id = ?
       ORDER BY r.id`
    ).all(Number(req.params.id));
    res.json(rows);
  } finally {
    d.close();
  }
});

export default router;
