CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'presenter' CHECK (role IN ('admin', 'presenter')),
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
WITH RECURSIVE n(x) AS (SELECT 0 UNION ALL SELECT x+1 FROM n WHERE x < 68)
INSERT OR IGNORE INTO slides (id, deck_slug, position) SELECT 'slide-' || (x+1), 'lps-slide-aula06', x FROM n;

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS slides (
  id TEXT PRIMARY KEY,
  deck_slug TEXT NOT NULL,
  position INTEGER NOT NULL,
  cue TEXT NOT NULL DEFAULT '',
  tone TEXT NOT NULL DEFAULT '',
  next_cue TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(deck_slug, position)
);

CREATE TABLE IF NOT EXISTS slide_time (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  deck_slug TEXT NOT NULL,
  slide_position INTEGER NOT NULL,
  seconds INTEGER NOT NULL DEFAULT 0,
  viewed_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, deck_slug, slide_position)
);
