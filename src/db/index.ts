import Database from "better-sqlite3";
import {
  drizzle,
  type BetterSQLite3Database,
} from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";

const dbPath =
  process.env.DATABASE_URL?.replace("file:", "") ??
  path.join(process.cwd(), "blog.db");

declare global {
  var __sqlite: Database.Database | undefined;
  var __db: BetterSQLite3Database<typeof schema> | undefined;
}

function getClient() {
  if (!globalThis.__sqlite) {
    const client = new Database(dbPath);
    client.pragma("journal_mode = WAL");
    client.pragma("foreign_keys = ON");
    globalThis.__sqlite = client;
  }
  return globalThis.__sqlite;
}

export function getDb() {
  if (!globalThis.__db) {
    globalThis.__db = drizzle(getClient(), { schema });
  }
  return globalThis.__db;
}

export function initDb() {
  const sqlite = getClient();
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT,
      content TEXT NOT NULL DEFAULT '',
      cover_image TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      author_id TEXT REFERENCES users(id),
      category_id TEXT REFERENCES categories(id),
      seo_title TEXT,
      seo_description TEXT,
      published_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS post_tags (
      post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (post_id, tag_id)
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
    CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
    CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published_at);
  `);
  return getDb();
}
