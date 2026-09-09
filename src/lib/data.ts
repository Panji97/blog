import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { getDb, initDb } from "@/db";
import { categories, postTags, posts, tags, users } from "@/db/schema";
import { readingMinutes } from "./utils";

export type PostWithMeta = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  status: string;
  authorName: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  readingTime: number;
  tags: { name: string; slug: string }[];
  seoTitle: string | null;
  seoDescription: string | null;
  categoryId: string | null;
};

function toMeta(
  row: typeof posts.$inferSelect & {
    authorName: string | null;
    categoryName: string | null;
    categorySlug: string | null;
  },
  tagList: { name: string; slug: string }[] = []
): PostWithMeta {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.coverImage,
    status: row.status,
    authorName: row.authorName,
    categoryName: row.categoryName,
    categorySlug: row.categorySlug,
    publishedAt: row.publishedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    readingTime: readingMinutes(row.content || ""),
    tags: tagList,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    categoryId: row.categoryId,
  };
}

async function tagsFor(postId: string) {
  const db = getDb();
  const rows = await db
    .select({ name: tags.name, slug: tags.slug })
    .from(postTags)
    .innerJoin(tags, eq(tags.id, postTags.tagId))
    .where(eq(postTags.postId, postId));
  return rows;
}

export async function getPublishedPosts(limit = 50) {
  initDb();
  const db = getDb();
  const rows = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      content: posts.content,
      coverImage: posts.coverImage,
      status: posts.status,
      authorId: posts.authorId,
      categoryId: posts.categoryId,
      seoTitle: posts.seoTitle,
      seoDescription: posts.seoDescription,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      authorName: users.name,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(posts)
    .leftJoin(users, eq(users.id, posts.authorId))
    .leftJoin(categories, eq(categories.id, posts.categoryId))
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  const out: PostWithMeta[] = [];
  for (const r of rows) out.push(toMeta(r as never, await tagsFor(r.id)));
  return out;
}

export async function getPostBySlug(slug: string) {
  initDb();
  const db = getDb();
  const rows = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      content: posts.content,
      coverImage: posts.coverImage,
      status: posts.status,
      authorId: posts.authorId,
      categoryId: posts.categoryId,
      seoTitle: posts.seoTitle,
      seoDescription: posts.seoDescription,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      authorName: users.name,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(posts)
    .leftJoin(users, eq(users.id, posts.authorId))
    .leftJoin(categories, eq(categories.id, posts.categoryId))
    .where(eq(posts.slug, slug))
    .limit(1);
  if (!rows.length) return null;
  return toMeta(rows[0] as never, await tagsFor(rows[0].id));
}

export async function getPostById(id: string) {
  initDb();
  const db = getDb();
  const rows = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  if (!rows.length) return null;
  const tagList = await tagsFor(id);
  return { ...rows[0], tags: tagList };
}

export async function getRelated(post: PostWithMeta, limit = 3) {
  initDb();
  const all = await getPublishedPosts(50);
  return all
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      const aScore = (a.categorySlug === post.categorySlug ? 2 : 0) +
        a.tags.filter((t) => post.tags.some((x) => x.slug === t.slug)).length;
      const bScore = (b.categorySlug === post.categorySlug ? 2 : 0) +
        b.tags.filter((t) => post.tags.some((x) => x.slug === t.slug)).length;
      return bScore - aScore;
    })
    .slice(0, limit);
}

export async function getPrevNext(slug: string) {
  const all = await getPublishedPosts(100);
  const idx = all.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: all[idx - 1] ?? null,
    next: all[idx + 1] ?? null,
  };
}

export async function searchPosts(q: string, limit = 20) {
  initDb();
  if (!q.trim()) return [];
  const db = getDb();
  const likeQ = `%${q.trim()}%`;
  const rows = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      content: posts.content,
      coverImage: posts.coverImage,
      status: posts.status,
      authorId: posts.authorId,
      categoryId: posts.categoryId,
      seoTitle: posts.seoTitle,
      seoDescription: posts.seoDescription,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      authorName: users.name,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(posts)
    .leftJoin(users, eq(users.id, posts.authorId))
    .leftJoin(categories, eq(categories.id, posts.categoryId))
    .where(
      and(
        eq(posts.status, "published"),
        or(
          like(posts.title, likeQ),
          like(posts.excerpt, likeQ),
          like(posts.content, likeQ)
        )
      )
    )
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  const out: PostWithMeta[] = [];
  for (const r of rows) out.push(toMeta(r as never, await tagsFor(r.id)));
  return out;
}

export async function getCategoriesWithCounts() {
  initDb();
  const db = getDb();
  const cats = await db.select().from(categories).orderBy(categories.name);
  const counts = await db
    .select({ categoryId: posts.categoryId, count: sql<number>`count(*)` })
    .from(posts)
    .where(eq(posts.status, "published"))
    .groupBy(posts.categoryId);
  const map = new Map(counts.map((c) => [c.categoryId, c.count]));
  return cats.map((c) => ({ ...c, count: map.get(c.id) ?? 0 }));
}

export async function getPostsByCategory(categorySlug: string) {
  initDb();
  const db = getDb();
  const cat = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, categorySlug))
    .limit(1);
  if (!cat.length) return null;
  const rows = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      content: posts.content,
      coverImage: posts.coverImage,
      status: posts.status,
      authorId: posts.authorId,
      categoryId: posts.categoryId,
      seoTitle: posts.seoTitle,
      seoDescription: posts.seoDescription,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      authorName: users.name,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(posts)
    .leftJoin(users, eq(users.id, posts.authorId))
    .leftJoin(categories, eq(categories.id, posts.categoryId))
    .where(and(eq(posts.status, "published"), eq(posts.categoryId, cat[0].id)))
    .orderBy(desc(posts.publishedAt));
  const out: PostWithMeta[] = [];
  for (const r of rows) out.push(toMeta(r as never, await tagsFor(r.id)));
  return { category: cat[0], posts: out };
}

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
