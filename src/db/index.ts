import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

const dbUrl =
  process.env.TURSO_DATABASE_URL ??
  process.env.DATABASE_URL ??
  "file:./blog.db";
const authToken = process.env.TURSO_AUTH_TOKEN ?? undefined;

declare global {
  var __turso: Client | undefined;
  var __db: LibSQLDatabase<typeof schema> | undefined;
}

function getClient() {
  if (!globalThis.__turso) {
    globalThis.__turso = createClient({
      url: dbUrl,
      authToken,
    });
  }
  return globalThis.__turso;
}

export function getDb() {
  if (!globalThis.__db) {
    globalThis.__db = drizzle(getClient(), { schema });
  }
  return globalThis.__db;
}

export function initDb() {
  const client = getClient();
  const statements = [
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE
    )`,
    `CREATE TABLE IF NOT EXISTS posts (
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
    )`,
    `CREATE TABLE IF NOT EXISTS post_tags (
      post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (post_id, tag_id)
    )`,
    `CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug)`,
    `CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status)`,
    `CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published_at)`,
  ];

  for (const statement of statements) {
    client.execute(statement).catch(() => {});
  }

  return getDb();
}
