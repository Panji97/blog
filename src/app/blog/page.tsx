import Link from "next/link";
import { getPublishedPosts } from "@/lib/data";
import { MinimalRow } from "@/components/blog/cards";

export const metadata = { title: "All articles" };
export const dynamic = "force-dynamic";

export default async function BlogArchive() {
  const posts = await getPublishedPosts(100);
  const years = new Map<string, typeof posts>();
  for (const p of posts) {
    const y = p.publishedAt ? new Date(p.publishedAt).getFullYear().toString() : "Undated";
    if (!years.has(y)) years.set(y, []);
    years.get(y)!.push(p);
  }
  return (
    <div className="mx-auto max-w-[880px] px-5 py-14 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Archive</p>
      <h1 className="mt-4 font-serif text-5xl tracking-tight md:text-6xl">All articles</h1>
      <p className="mt-4 text-[17px] text-muted">{posts.length} stories, newest first. No infinite scroll — just the work.</p>
      {posts.length === 0 && (
        <div className="mt-12 border-t border-border pt-8">
          <p className="font-serif text-2xl">No articles yet.</p>
          <p className="mt-2 text-muted">Published stories will appear here.</p>
        </div>
      )}
      {[...years.entries()].map(([year, list]) => (
        <section key={year} className="mt-12" aria-label={year}>
          <h2 className="font-serif text-2xl italic text-muted">{year}</h2>
          <div className="mt-2 border-b border-border">
            {list.map((p, i) => <MinimalRow key={p.id} post={p} index={i} />)}
          </div>
        </section>
      ))}
      <p className="mt-10 text-sm"><Link href="/" className="link-underline">← Back to homepage</Link></p>
    </div>
  );
}
