import Link from "next/link";
import { getPublishedPosts } from "@/lib/data";
import { MinimalRow } from "@/components/blog/cards";

export const metadata = { title: "Semua artikel" };
export const dynamic = "force-dynamic";

export default async function BlogArchive() {
  const posts = await getPublishedPosts(100);
  const years = new Map<string, typeof posts>();
  for (const p of posts) {
    const y = p.publishedAt
      ? new Date(p.publishedAt).getFullYear().toString()
      : "Tanpa tanggal";
    if (!years.has(y)) years.set(y, []);
    years.get(y)!.push(p);
  }
  return (
    <div className="mx-auto max-w-[880px] px-5 py-14 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        Arsip
      </p>
      <h1 className="mt-4 font-serif text-5xl tracking-tight md:text-6xl">
        Semua artikel
      </h1>
      <p className="mt-4 text-[17px] text-muted">
        {posts.length} cerita, terbaru dulu. Tanpa gulir tak terbatas — hanya
        karya.
      </p>
      {posts.length === 0 && (
        <div className="mt-12 border-t border-border pt-8">
          <p className="font-serif text-2xl">Belum ada artikel.</p>
          <p className="mt-2 text-muted">
            Cerita yang diterbitkan akan muncul di sini.
          </p>
        </div>
      )}
      {[...years.entries()].map(([year, list]) => (
        <section key={year} className="mt-12" aria-label={year}>
          <h2 className="font-serif text-2xl italic text-muted">{year}</h2>
          <div className="mt-2 border-b border-border">
            {list.map((p, i) => (
              <MinimalRow key={p.id} post={p} index={i} />
            ))}
          </div>
        </section>
      ))}
      <p className="mt-10 text-sm">
        <Link href="/" className="link-underline">
          ← Kembali ke beranda
        </Link>
      </p>
    </div>
  );
}
