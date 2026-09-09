import { getDb, initDb } from "./index";
import { categories, posts, postTags, tags, users } from "./schema";
import { hashPassword } from "@/lib/auth";
import { uid } from "@/lib/utils";
import { eq } from "drizzle-orm";

const CATS = [
  {
    name: "Technology",
    slug: "technology",
    description: "Software, systems, and building things for the web.",
  },
  {
    name: "Design",
    slug: "design",
    description: "Typography, layout, and the quiet details of interfaces.",
  },
  {
    name: "Ideas",
    slug: "ideas",
    description: "Essays and observations worth thinking about.",
  },
  {
    name: "Notes",
    slug: "notes",
    description: "Short technical notes from the work behind the scenes.",
  },
];

const TAGS = ["Next.js", "SQLite", "Typography", "Systems", "Writing", "Craft"];

type SeedPost = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  daysAgo: number;
  content: string;
};

const POSTS: SeedPost[] = [
  {
    title: "Why boring technology wins",
    slug: "why-boring-technology-wins",
    excerpt:
      "SQLite, server-rendered HTML, and a single deployable. On choosing tools that disappear.",
    category: "technology",
    tags: ["Systems", "SQLite"],
    daysAgo: 1,
    content: `Most teams don't have a technology problem. They have a complexity problem.

Every dependency is a promise you have to keep. Every service is a thing that can fail at 2am. So lately I've been reaching for the boring option on purpose.

## What boring looks like

- One Next.js app, server-rendered by default
- One SQLite file for the MVP
- Markdown as the canonical content format
- No queue, no cache layer, no microservice — until the numbers demand it

> Simplicity is a feature. You just can't demo it on a landing page.

## A small example

\`\`\`ts
// posts.ts — read path, no API layer needed
export async function getPostBySlug(slug: string) {
  return db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
}
\`\`\`

The whole read path is a function call. No fetch, no cache invalidation story, no loading skeleton for something that takes 4ms.

## When to get fancy

Boring doesn't mean naive. Add a cache when p95 proves you need it. Add a queue when you lose a job that mattered. Add a service when one team keeps breaking another team's deploys.

Until then, boring wins because it leaves all your energy for the part users actually feel: the writing, the typography, the load time.`,
  },
  {
    title: "Editorial design for developer blogs",
    slug: "editorial-design-developer-blogs",
    excerpt:
      "Whitespaces, serif headlines, and thin borders. How to look bespoke without gimmicks.",
    category: "design",
    tags: ["Typography", "Craft"],
    daysAgo: 3,
    content: `Developer blogs all look the same because they use the same defaults: gradient hero, three glass cards, twelve accent colors.

An editorial approach does the opposite. It removes.

## The system

1. **One serif for headlines.** Instrument Serif or Newsreader at 48–64px does more work than any illustration.
2. **Warm neutrals.** #F7F5F0 background, #171717 ink, one terracotta accent used sparingly.
3. **Thin borders, minimal shadow.** Let whitespace separate sections, not cards.
4. **Two card types max.** One featured composition, one minimal list. That's it.

## Hierarchy beats decoration

Readers scan in this order: category → title → excerpt → meta. If your card shows those four things cleanly, it converts better than any glow effect.

Good design here is quiet. If the animation is noticeable before the content, it's probably too much.`,
  },
  {
    title: "Markdown as a content API",
    slug: "markdown-as-content-api",
    excerpt:
      "Why storing Markdown in SQLite beats JSON blobs and rich-text payloads.",
    category: "technology",
    tags: ["Next.js", "SQLite"],
    daysAgo: 5,
    content: `Store Markdown. Render HTML at the edge. Everything else is overhead.

## Why it works

Markdown is portable, diffable, and human-readable in a database viewer. A JSON rich-text dump is none of those.

\`\`\`sql
select title, slug, substr(content, 1, 80) from posts where status = 'published';
\`\`\`

You can debug content with SQL. That's a feature.

## Rendering safely

Render on the server with a strict pipeline: remark-gfm for tables and task lists, rehype-highlight for code, and a sanitized component map. No raw HTML passthrough from authors you don't trust.

The result is fast — Server Components ship almost zero JS for the article body — and future-proof. If you migrate off Next.js, your content comes with you unchanged.`,
  },
  {
    title: "The quiet craft of reading time",
    slug: "quiet-craft-reading-time",
    excerpt:
      "Small metadata — author, date, minutes — is UX. Treat it like product copy.",
    category: "ideas",
    tags: ["Writing", "Craft"],
    daysAgo: 7,
    content: `Nobody clicks because of "6 min read". But everybody uses it to decide.

Metadata is a promise about cost. "Elena · Sep 04 · 6 min" tells me who, how fresh, and how much attention this asks for. That's respect.

## Rules I follow

- Always show author, date, and reading time together
- Never show view counts next to new writing — it punishes good early work
- Use sentence-case excerpts, one or two sentences, no clickbait

Small things compound. A publication that respects attention earns return visits.`,
  },
  {
    title: "SQLite in production: what they don't tell you",
    slug: "sqlite-in-production",
    excerpt:
      "WAL mode, single-file backups, and when to actually leave SQLite.",
    category: "technology",
    tags: ["SQLite", "Systems"],
    daysAgo: 9,
    content: `SQLite handles far more than people expect — thousands of reads per second on a single file.

## The setup that works

Enable WAL, enable foreign keys, back up the file nightly. That's 90% of operations.

\`\`\`sql
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
\`\`\`

## When to move on

Leave when you need concurrent writers at high throughput, or multi-region writes. Not when someone on the internet says "SQLite isn't a real database."

For a blog, documentation site, or internal tool, you may never leave. That's fine. Boring wins.`,
  },
  {
    title: "Typography is the interface",
    slug: "typography-is-interface",
    excerpt:
      "Body at 18px, line-height 1.75, measure at 68 characters. The rest is detail.",
    category: "design",
    tags: ["Typography"],
    daysAgo: 12,
    content: `If you get typography right, you barely need anything else.

## My defaults

- Body: 17–19px, line-height 1.65–1.8, max-width 680–760px
- Headlines: serif, tight leading, balanced wrapping
- Meta: 13–14px uppercase, letter-spaced, muted

> Good type makes even plain text feel designed.

Test with a long article, a code block, and a blockquote. If those three look calm, the system holds.`,
  },
  {
    title: "Notes on shipping a personal publication",
    slug: "notes-shipping-publication",
    excerpt:
      "Eight posts, four categories, one voice. What I learned launching this blog.",
    category: "notes",
    tags: ["Writing"],
    daysAgo: 15,
    content: `I launched with eight real posts instead of lorem ipsum. That one decision made every design flaw visible — which is exactly what you want.

Placeholder text hides bad hierarchy. Real headlines expose it.

## Checklist that helped

- [x] Real titles, including one very long one
- [x] Code blocks with copy buttons
- [x] Empty search state with human copy
- [x] 390px and 320px passes

Ship the words first. The design will follow.`,
  },
  {
    title: "Server Components by default",
    slug: "server-components-by-default",
    excerpt:
      "Public pages should ship almost no JavaScript. Here's where client code earns its place.",
    category: "technology",
    tags: ["Next.js", "Systems"],
    daysAgo: 18,
    content: `The fastest JavaScript is the JavaScript you don't ship.

On this blog, the homepage, article page, category page, and search results are Server Components. Client components exist only for: theme toggle, search input, share buttons, and the admin editor.

## The rule

If it doesn't need useState, useEffect, or a browser API — keep it on the server.

Your Lighthouse score will thank you. So will readers on slow phones.`,
  },
  {
    title: "Against the SaaS hero",
    slug: "against-saas-hero",
    excerpt:
      "No 'Get Started' button on a blog. What an editorial hero does instead.",
    category: "ideas",
    tags: ["Craft", "Writing"],
    daysAgo: 22,
    content: `A blog is not a funnel. It doesn't need a gradient headline and two CTAs.

An editorial hero does three things:

1. States a point of view in one serif sentence
2. Surfaces one featured story worth your time
3. Gets out of the way

"Ideas, notes, and things worth thinking about." That's the whole pitch. If a reader wants more, the archive is one click away.`,
  },
  {
    title: "A field guide to good excerpts",
    slug: "field-guide-good-excerpts",
    excerpt:
      "One or two sentences. Say what the reader gets, not how you feel about it.",
    category: "notes",
    tags: ["Writing", "Typography"],
    daysAgo: 28,
    content: `Bad excerpt: "In this post I'll be talking about some thoughts on design."

Good excerpt: "Thin borders, warm neutrals, and one serif — a system for blogs that look bespoke."

## Formula

**Topic + tension + payoff.** Name the subject, hint at the conflict, promise something concrete.

Write the excerpt last. If you can't summarize the value in two sentences, the draft isn't done.`,
  },
];

export async function seed() {
  initDb();
  const db = getDb();
  const now = new Date().toISOString();

  const admin = await db.select().from(users).limit(1);
  let adminId: string;
  if (!admin.length) {
    adminId = uid("u_");
    await db.insert(users).values({
      id: adminId,
      name: "Elena Marsh",
      email: "admin@example.com",
      passwordHash: await hashPassword("admin123"),
      role: "admin",
      createdAt: now,
      updatedAt: now,
    });
    console.log("Created admin: admin@example.com / admin123");
  } else {
    adminId = admin[0].id;
  }

  const catIds: Record<string, string> = {};
  for (const c of CATS) {
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, c.slug))
      .limit(1);
    if (!existing.length) {
      const id = uid("c_");
      await db.insert(categories).values({ id, ...c, createdAt: now });
      catIds[c.slug] = id;
    } else catIds[c.slug] = existing[0].id;
  }

  const tagIds: Record<string, string> = {};
  for (const t of TAGS) {
    const slug = t.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const existing = await db
      .select()
      .from(tags)
      .where(eq(tags.slug, slug))
      .limit(1);
    if (!existing.length) {
      const id = uid("t_");
      await db.insert(tags).values({ id, name: t, slug });
      tagIds[t] = id;
    } else tagIds[t] = existing[0].id;
  }

  for (const p of POSTS) {
    const existing = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, p.slug))
      .limit(1);
    if (existing.length) continue;
    const id = uid("p_");
    const publishedAt = new Date(
      Date.now() - p.daysAgo * 86400000,
    ).toISOString();
    await db.insert(posts).values({
      id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      coverImage: null,
      status: "published",
      authorId: adminId,
      categoryId: catIds[p.category],
      seoTitle: p.title,
      seoDescription: p.excerpt,
      publishedAt,
      createdAt: publishedAt,
      updatedAt: publishedAt,
    });
    for (const t of p.tags) {
      if (tagIds[t])
        await db
          .insert(postTags)
          .values({ postId: id, tagId: tagIds[t] })
          .onConflictDoNothing();
    }
  }
  console.log("Seed complete.");
}
