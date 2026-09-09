"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { getDb, initDb } from "@/db";
import { categories, postTags, posts, tags, users } from "@/db/schema";
import {
  createSession,
  destroySession,
  getSessionUser,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { slugifyTitle, uid } from "@/lib/utils";

const postSchema = z.object({
  title: z.string().min(3).max(160),
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(300).optional(),
  content: z.string().min(10),
  categoryId: z.string().optional(),
  tags: z.string().optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

function tagsFromInput(input?: string): string[] {
  if (!input) return [];
  return input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 8);
}

async function syncTags(postId: string, names: string[]) {
  const db = getDb();
  await db.delete(postTags).where(eq(postTags.postId, postId));
  for (const name of names) {
    const slug = slugifyTitle(name);
    if (!slug) continue;
    const tag = await db
      .select()
      .from(tags)
      .where(eq(tags.slug, slug))
      .limit(1);
    let tagId: string;
    if (!tag.length) {
      tagId = uid("t_");
      await db.insert(tags).values({ id: tagId, name, slug });
    } else tagId = tag[0].id;
    await db.insert(postTags).values({ postId, tagId }).onConflictDoNothing();
  }
}

async function ensureAuth() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/admin");
  return user;
}

export async function loginAction(formData: FormData) {
  initDb();
  const email = String(formData.get("email") ?? "")
    .toLowerCase()
    .trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  if (!email || !password) return { error: "Email and password are required." };
  const db = getDb();
  const found = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (!found.length) return { error: "Invalid email or password." };
  const ok = await verifyPassword(password, found[0].passwordHash);
  if (!ok) return { error: "Invalid email or password." };
  await createSession(found[0].id);
  redirect(next.startsWith("/") ? next : "/admin");
}

export async function registerAction(formData: FormData) {
  initDb();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .toLowerCase()
    .trim();
  const password = String(formData.get("password") ?? "");

  const parsed = z
    .object({
      fullName: z.string().min(2).max(60),
      email: z.string().email(),
      password: z.string().min(6).max(128),
    })
    .safeParse({ fullName, email, password });

  if (!parsed.success) {
    return {
      error:
        "Nama harus diisi minimal 2 karakter, email valid, dan password minimal 6 karakter.",
    };
  }

  const db = getDb();
  const exists = await db
    .select()
    .from(users)
    .where(eq(users.email, parsed.data.email))
    .limit(1);

  if (exists.length) {
    return {
      error: "Email sudah terdaftar. Silakan masuk atau gunakan email lain.",
    };
  }

  const id = uid("u_");
  const now = new Date().toISOString();

  await db.insert(users).values({
    id,
    name: parsed.data.fullName,
    email: parsed.data.email,
    passwordHash: await hashPassword(parsed.data.password),
    role: "admin",
    createdAt: now,
    updatedAt: now,
  });

  await createSession(id);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

export async function createPostAction(formData: FormData) {
  const user = await ensureAuth();
  const raw = {
    title: String(formData.get("title") ?? ""),
    slug:
      String(formData.get("slug") ?? "") ||
      slugifyTitle(String(formData.get("title") ?? "")),
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content") ?? ""),
    categoryId: String(formData.get("categoryId") ?? "") || undefined,
    tags: String(formData.get("tags") ?? ""),
    seoTitle: String(formData.get("seoTitle") ?? ""),
    seoDescription: String(formData.get("seoDescription") ?? ""),
    status: String(formData.get("status") ?? "draft") as "draft" | "published",
  };
  const parsed = postSchema.safeParse({
    ...raw,
    excerpt: raw.excerpt || undefined,
    categoryId: raw.categoryId || undefined,
    seoTitle: raw.seoTitle || undefined,
    seoDescription: raw.seoDescription || undefined,
  });
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  initDb();
  const db = getDb();
  const existing = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, parsed.data.slug))
    .limit(1);
  if (existing.length) return { error: "Slug is already in use." };
  const id = uid("p_");
  const now = new Date().toISOString();
  const publishedAt = parsed.data.status === "published" ? now : null;
  await db.insert(posts).values({
    id,
    title: parsed.data.title,
    slug: parsed.data.slug,
    excerpt: parsed.data.excerpt ?? null,
    content: parsed.data.content,
    coverImage: null,
    status: parsed.data.status,
    authorId: user.id,
    categoryId: parsed.data.categoryId ?? null,
    seoTitle: parsed.data.seoTitle ?? null,
    seoDescription: parsed.data.seoDescription ?? null,
    publishedAt,
    createdAt: now,
    updatedAt: now,
  });
  await syncTags(id, tagsFromInput(parsed.data.tags));
  revalidatePath("/");
  revalidatePath("/blog");
  redirect(`/admin/posts/${id}/edit`);
}

export async function updatePostAction(id: string, formData: FormData) {
  const user = await ensureAuth();
  const raw = {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content") ?? ""),
    categoryId: String(formData.get("categoryId") ?? "") || undefined,
    tags: String(formData.get("tags") ?? ""),
    seoTitle: String(formData.get("seoTitle") ?? ""),
    seoDescription: String(formData.get("seoDescription") ?? ""),
    status: String(formData.get("status") ?? "draft") as "draft" | "published",
  };
  const parsed = postSchema.safeParse({
    ...raw,
    excerpt: raw.excerpt || undefined,
    categoryId: raw.categoryId || undefined,
    seoTitle: raw.seoTitle || undefined,
    seoDescription: raw.seoDescription || undefined,
  });
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  initDb();
  const db = getDb();
  const current = await db
    .select()
    .from(posts)
    .where(and(eq(posts.id, id), eq(posts.authorId, user.id)))
    .limit(1);
  if (!current.length) return { error: "Post not found." };
  const clash = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, parsed.data.slug))
    .limit(1);
  if (clash.length && clash[0].id !== id)
    return { error: "Slug is already in use." };
  const now = new Date().toISOString();
  let publishedAt = current[0].publishedAt;
  if (parsed.data.status === "published" && !publishedAt) publishedAt = now;
  await db
    .update(posts)
    .set({
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt ?? null,
      content: parsed.data.content,
      status: parsed.data.status,
      categoryId: parsed.data.categoryId ?? null,
      seoTitle: parsed.data.seoTitle ?? null,
      seoDescription: parsed.data.seoDescription ?? null,
      publishedAt,
      updatedAt: now,
    })
    .where(eq(posts.id, id));
  await syncTags(id, tagsFromInput(parsed.data.tags));
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${parsed.data.slug}`);
  return { ok: true };
}

export async function togglePublishAction(id: string) {
  const user = await ensureAuth();
  initDb();
  const db = getDb();
  const cur = await db
    .select()
    .from(posts)
    .where(and(eq(posts.id, id), eq(posts.authorId, user.id)))
    .limit(1);
  if (!cur.length) return { error: "Not found" };
  const next = cur[0].status === "published" ? "draft" : "published";
  const now = new Date().toISOString();
  await db
    .update(posts)
    .set({
      status: next,
      publishedAt:
        next === "published" ? (cur[0].publishedAt ?? now) : cur[0].publishedAt,
      updatedAt: now,
    })
    .where(eq(posts.id, id));
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${cur[0].slug}`);
}

export async function deletePostAction(id: string) {
  const user = await ensureAuth();
  initDb();
  const db = getDb();
  const cur = await db
    .select()
    .from(posts)
    .where(and(eq(posts.id, id), eq(posts.authorId, user.id)))
    .limit(1);
  await db
    .delete(posts)
    .where(and(eq(posts.id, id), eq(posts.authorId, user.id)));
  revalidatePath("/");
  revalidatePath("/blog");
  if (cur[0]) revalidatePath(`/blog/${cur[0].slug}`);
  redirect("/admin/posts");
}

const catSchema = z.object({
  name: z.string().min(2).max(60),
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  description: z.string().max(200).optional(),
});

export async function upsertCategoryAction(
  id: string | null,
  formData: FormData,
) {
  await ensureAuth();
  const raw = {
    name: String(formData.get("name") ?? ""),
    slug:
      String(formData.get("slug") ?? "") ||
      slugifyTitle(String(formData.get("name") ?? "")),
    description: String(formData.get("description") ?? "") || undefined,
  };
  const parsed = catSchema.safeParse(raw);
  if (!parsed.success) return { error: "Invalid category." };
  const slug = parsed.data.slug ?? slugifyTitle(parsed.data.name);
  initDb();
  const db = getDb();
  if (id) {
    await db
      .update(categories)
      .set({
        name: parsed.data.name,
        slug,
        description: parsed.data.description ?? null,
      })
      .where(eq(categories.id, id));
  } else {
    await db
      .insert(categories)
      .values({
        id: uid("c_"),
        name: parsed.data.name,
        slug,
        description: parsed.data.description ?? null,
        createdAt: new Date().toISOString(),
      })
      .onConflictDoNothing();
  }
  revalidatePath("/");
  revalidatePath("/blog");
  return { ok: true };
}

export async function deleteCategoryAction(id: string) {
  await ensureAuth();
  initDb();
  await getDb().delete(categories).where(eq(categories.id, id));
  revalidatePath("/");
}
