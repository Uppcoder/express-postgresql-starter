// A small Express app on PostgreSQL: a notes API.
//
// The database comes from DATABASE_URL (postgresql://user:password@host:5432/db),
// which Uppcoder sets when the app is connected to PostgreSQL and docker compose
// sets locally. The table is created on startup, so a fresh database just works.
//
// Uppcoder starts the app with `node index.js` and sets PORT (8000); HOST changes
// the address it listens on (docker compose sets HOST=0.0.0.0).
const express = require('express');
const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || '';
const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || '127.0.0.1';

const pool = DATABASE_URL ? new Pool({ connectionString: DATABASE_URL }) : null;
const app = express();
app.use(express.json());

// Every database route goes through this: a clear 503 instead of a crash when
// the app has no database yet.
function db(res) {
  if (!pool) {
    res.status(503).json({ error: 'DATABASE_URL is not set: connect the app to PostgreSQL' });
    return null;
  }
  return pool;
}

async function createTable() {
  if (!pool) return;
  await pool.query(
    'CREATE TABLE IF NOT EXISTS notes (' +
      ' id SERIAL PRIMARY KEY,' +
      ' text TEXT NOT NULL,' +
      ' created_at TIMESTAMPTZ NOT NULL DEFAULT now())'
  );
}

app.get('/', (req, res) => {
  res.json({
    app: 'Express + PostgreSQL starter',
    database: pool ? 'connected' : 'not connected (DATABASE_URL is not set)',
    try: ['GET /notes', 'POST /notes {"text": "..."}', 'GET /status'],
  });
});

app.get('/status', async (req, res, next) => {
  const p = db(res);
  if (!p) return;
  try {
    const { rows } = await p.query('SELECT version()');
    res.json({ ok: true, postgres: rows[0].version.split(',')[0] });
  } catch (e) {
    next(e);
  }
});

app.get('/notes', async (req, res, next) => {
  const p = db(res);
  if (!p) return;
  try {
    const { rows } = await p.query('SELECT id, text, created_at FROM notes ORDER BY id');
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

app.post('/notes', async (req, res, next) => {
  const text = String((req.body || {}).text || '').trim();
  if (!text) return res.status(400).json({ error: 'send {"text": "..."}' });
  const p = db(res);
  if (!p) return;
  try {
    const { rows } = await p.query('INSERT INTO notes (text) VALUES ($1) RETURNING id, text, created_at', [text]);
    res.status(201).json(rows[0]);
  } catch (e) {
    next(e);
  }
});

app.delete('/notes/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(404).json({ error: 'no such note' });
  const p = db(res);
  if (!p) return;
  try {
    const { rowCount } = await p.query('DELETE FROM notes WHERE id = $1', [id]);
    if (!rowCount) return res.status(404).json({ error: 'no such note' });
    res.json({ deleted: id });
  } catch (e) {
    next(e);
  }
});

app.use((req, res) => res.status(404).json({ error: 'not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

createTable()
  .catch((e) => console.error('Could not create the notes table:', e.message))
  .finally(() => {
    app.listen(PORT, HOST, () => console.log(`Express + PostgreSQL starter on http://${HOST}:${PORT}`));
  });
