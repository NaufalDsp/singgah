import { sqliteTable, text, integer, index, primaryKey } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  google_sub: text('google_sub').notNull().unique(),
  name: text('name').notNull(),
  avatar_url: text('avatar_url'),
  role: text('role', { enum: ['user', 'admin'] })
    .notNull()
    .default('user'),
  created_at: integer('created_at').notNull(),
});

export const sessions = sqliteTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    user_id: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    created_at: integer('created_at').notNull(),
    expires_at: integer('expires_at').notNull(),
  },
  (table) => [index('idx_sessions_user').on(table.user_id)],
);

export const trips = sqliteTable(
  'trips',
  {
    id: text('id').primaryKey(),
    user_id: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    destination: text('destination').notNull(),
    start_month: integer('start_month'),
    days: integer('days').notNull(),
    share_slug: text('share_slug').unique(),
    version: integer('version').notNull().default(1),
    created_at: integer('created_at').notNull(),
    updated_at: integer('updated_at').notNull(),
  },
  (table) => [index('idx_trips_user').on(table.user_id, table.updated_at)],
);

export const trip_items = sqliteTable(
  'trip_items',
  {
    id: text('id').primaryKey(),
    trip_id: text('trip_id')
      .notNull()
      .references(() => trips.id, { onDelete: 'cascade' }),
    day_index: integer('day_index').notNull(),
    position: integer('position').notNull(),
    kind: text('kind', { enum: ['tempat', 'makan', 'transit', 'catatan'] }).notNull(),
    title: text('title').notNull(),
    highlight_id: text('highlight_id'),
    time_of_day: text('time_of_day', { enum: ['pagi', 'siang', 'sore', 'malam'] }),
    notes: text('notes'),
  },
  (table) => [index('idx_items_trip').on(table.trip_id, table.day_index, table.position)],
);

export const favorites = sqliteTable(
  'favorites',
  {
    user_id: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    destination: text('destination').notNull(),
    created_at: integer('created_at').notNull(),
  },
  (table) => [primaryKey({ columns: [table.user_id, table.destination] })],
);

export const tips = sqliteTable(
  'tips',
  {
    id: text('id').primaryKey(),
    destination: text('destination').notNull(),
    user_id: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    body: text('body').notNull(),
    visited_month: integer('visited_month'),
    status: text('status', { enum: ['pending', 'published', 'hidden'] })
      .notNull()
      .default('pending'),
    created_at: integer('created_at').notNull(),
    moderated_at: integer('moderated_at'),
  },
  (table) => [index('idx_tips_dest').on(table.destination, table.status, table.created_at)],
);

export const tip_reports = sqliteTable(
  'tip_reports',
  {
    id: text('id').primaryKey(),
    tip_id: text('tip_id')
      .notNull()
      .references(() => tips.id, { onDelete: 'cascade' }),
    reporter_id: text('reporter_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    reason: text('reason').notNull(),
    created_at: integer('created_at').notNull(),
  },
  (table) => [primaryKey({ columns: [table.tip_id, table.reporter_id] })],
);
