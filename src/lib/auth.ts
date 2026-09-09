import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { eq, lt } from "drizzle-orm";
import { getDb, initDb } from "@/db";
import { sessions, users } from "@/db/schema";

const COOKIE = "session";
const TTL_DAYS = 30;

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}

export async function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

export async function createSession(userId: string) {
  initDb();
  const db = getDb();
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(
    Date.now() + TTL_DAYS * 24 * 3600 * 1000,
  ).toISOString();
  await db.insert(sessions).values({
    token,
    userId,
    expiresAt,
    createdAt: new Date().toISOString(),
  });
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt),
  });
  return token;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    initDb();
    try {
      await getDb().delete(sessions).where(eq(sessions.token, token));
    } catch {}
  }
  jar.set(COOKIE, "", { path: "/", maxAge: 0 });
}

export async function getSessionUser() {
  initDb();
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const db = getDb();
  // cleanup expired opportunistically
  await db
    .delete(sessions)
    .where(lt(sessions.expiresAt, new Date().toISOString()))
    .catch(() => {});
  const rows = await db
    .select({ user: users, expiresAt: sessions.expiresAt })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(eq(sessions.token, token))
    .limit(1);
  if (!rows.length) return null;
  if (new Date(rows[0].expiresAt) < new Date()) return null;
  const safe = { ...rows[0].user };
  delete safe.passwordHash;
  return safe;
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/admin");
  return user;
}
