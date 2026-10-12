-- migrations/0001_init.sql
CREATE TABLE IF NOT EXISTS users (
  id           TEXT PRIMARY KEY,              -- ULID
  google_sub   TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  avatar_url   TEXT,
  role         TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  created_at   INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id           TEXT PRIMARY KEY,              -- SHA-256 dari token
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at   INTEGER NOT NULL,
  expires_at   INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

CREATE TABLE IF NOT EXISTS trips (
  id           TEXT PRIMARY KEY,              -- ULID
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 80),
  destination  TEXT NOT NULL,                 -- slug destinasi
  start_month  INTEGER CHECK (start_month BETWEEN 1 AND 12),
  days         INTEGER NOT NULL CHECK (days BETWEEN 1 AND 21),
  share_slug   TEXT UNIQUE,                   -- acak >= 64 bit; NULL = privat
  version      INTEGER NOT NULL DEFAULT 1,    -- kunci optimistik
  created_at   INTEGER NOT NULL,
  updated_at   INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_trips_user ON trips(user_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS trip_items (
  id           TEXT PRIMARY KEY,
  trip_id      TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  day_index    INTEGER NOT NULL CHECK (day_index >= 1),
  position     INTEGER NOT NULL CHECK (position >= 0),
  kind         TEXT NOT NULL CHECK (kind IN ('tempat','makan','transit','catatan')),
  title        TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 120),
  highlight_id TEXT,                          -- merujuk highlight di konten, bila ada
  time_of_day  TEXT CHECK (time_of_day IN ('pagi','siang','sore','malam')),
  notes        TEXT CHECK (length(notes) <= 400)
);
CREATE INDEX IF NOT EXISTS idx_items_trip ON trip_items(trip_id, day_index, position);

CREATE TABLE IF NOT EXISTS favorites (
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  destination  TEXT NOT NULL,
  created_at   INTEGER NOT NULL,
  PRIMARY KEY (user_id, destination)
);

CREATE TABLE IF NOT EXISTS tips (
  id           TEXT PRIMARY KEY,
  destination  TEXT NOT NULL,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body         TEXT NOT NULL CHECK (length(body) BETWEEN 20 AND 400),
  visited_month INTEGER CHECK (visited_month BETWEEN 1 AND 12),
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','published','hidden')),
  created_at   INTEGER NOT NULL,
  moderated_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_tips_dest ON tips(destination, status, created_at DESC);

CREATE TABLE IF NOT EXISTS tip_reports (
  id           TEXT PRIMARY KEY,
  tip_id       TEXT NOT NULL REFERENCES tips(id) ON DELETE CASCADE,
  reporter_id  TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason       TEXT NOT NULL,
  created_at   INTEGER NOT NULL,
  UNIQUE (tip_id, reporter_id)
);
