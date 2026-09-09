import Link from "next/link";
import { getCategoriesWithCounts, getPublishedPosts } from "@/lib/data";
import {
  FeaturedCard,
  MinimalRow,
  StandardCard,
} from "@/components/blog/cards";

export const dynamic = "force-dynamic";

export default async function Home() {
  const posts = await getPublishedPosts(12);
  const cats = await getCategoriesWithCounts();
  if (!posts.length) {
    return (
      <div className="mx-auto max-w-[1280px] px-5 py-24 md:px-8">
        <h1 className="font-serif text-5xl tracking-tight">
          Belum ada artikel.
        </h1>
        <p className="mt-4 text-muted">
          Cerita yang diterbitkan akan muncul di sini.
        </p>
      </div>
    );
  }
  const [featured, ...rest] = posts;
  const latest = rest.slice(0, 3);
  const selected = rest.slice(3, 9);

  return (
    <div className="mx-auto max-w-[1280px] px-5 md:px-8">
      {/* Editorial hero */}
      <section className="grid gap-8 pb-4 pt-10 sm:pt-14 md:grid-cols-[1.3fr_1fr] md:gap-10 md:pt-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Publikasi tentang membangun &amp; berpikir
          </p>
          <h1 className="mt-5 font-serif text-[2.1rem] leading-[1.02] tracking-tight text-balance sm:text-[2.8rem] md:text-[76px]">
            Ide, catatan, dan hal yang layak dipikirkan.
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted sm:text-[17px]">
            Kumpulan esai, catatan teknis, dan observasi dari pekerjaan di balik
            layar. Diterbitkan sesekali dan diedit dengan hati-hati.
          </p>
          <div className="mt-8 flex flex-col gap-3 text-sm sm:flex-row sm:items-center">
            <Link
              href="/blog"
              className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-5 font-medium text-background hover:opacity-85"
            >
              Lihat semua artikel
            </Link>
            <Link
              href="/about"
              className="inline-flex h-11 items-center justify-center rounded-md border border-border px-5 font-medium hover:bg-surface"
            >
              Tentang
            </Link>
          </div>
        </div>
        <aside
          className="border-t border-border pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0"
          aria-label="Index"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Indeks
          </p>
          <div className="mt-4">
            {posts.slice(0, 5).map((p, i) => (
              <MinimalRow key={p.id} post={p} index={i} />
            ))}
          </div>
          <p className="mt-4 text-[13px] text-muted">
            {posts.length} cerita diterbitkan
          </p>
        </aside>
      </section>

      {/* Featured */}
      <section aria-label="Featured story" className="mt-10">
        <FeaturedCard post={featured} />
      </section>

      {/* Latest */}
      <section
        className="mt-16 grid gap-10 md:grid-cols-[1fr_320px]"
        aria-label="Latest articles"
      >
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-3xl tracking-tight">Terbaru</h2>
            <Link href="/blog" className="link-underline text-sm">
              Lihat arsip →
            </Link>
          </div>
          <div className="mt-2">
            {latest.map((p) => (
              <StandardCard key={p.id} post={p} />
            ))}
          </div>
        </div>
        <div
          id="topics"
          className="h-fit border border-border bg-surface/40 p-4 sm:p-6 md:sticky md:top-6 md:bg-transparent md:p-0 md:border-0"
        >
          <h2 className="font-serif text-2xl tracking-tight md:border-b md:border-border md:pb-3">
            Topik
          </h2>
          <ul className="mt-4 space-y-1">
            {cats.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/category/${c.slug}`}
                  className="group flex items-baseline justify-between border-b border-border/60 py-3"
                >
                  <span className="text-[15px] font-medium group-hover:underline group-hover:underline-offset-4">
                    {c.name}
                  </span>
                  <span className="text-[13px] tabular-nums text-muted">
                    {c.count} cerita
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] leading-relaxed text-muted">
            Diurutkan menurut topik, terbaru dulu. Tanpa umpan yang
            dimanipulasi, tanpa gulir tak terbatas.
          </p>
        </div>
      </section>

      {/* Selected */}
      {selected.length > 0 && (
        <section className="mt-20" aria-label="Selected stories">
          <div className="flex items-baseline justify-between border-b border-border pb-4">
            <h2 className="font-serif text-3xl tracking-tight">Pilihan</h2>
            <Link href="/blog" className="link-underline text-sm">
              Semua artikel →
            </Link>
          </div>
          <div className="grid gap-x-6 gap-y-2 md:grid-cols-2 md:gap-x-10">
            {selected.map((p) => (
              <StandardCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      {/* About CTA */}
      <section className="mt-20 border-y border-border py-14 text-center">
        <p className="font-serif text-3xl italic tracking-tight md:text-4xl">
          “Kurang UI. Lebih banyak karakter editorial. Membaca jadi lebih baik.”
        </p>
        <p className="mx-auto mt-4 max-w-md text-[15px] text-muted">
          Marginalia adalah publikasi satu orang tentang perangkat lunak,
          desain, dan perhatian.
        </p>
        <Link
          href="/about"
          className="mt-6 inline-flex h-10 items-center rounded-md border border-border px-5 text-sm font-medium hover:bg-surface"
        >
          Baca kolofon
        </Link>
      </section>
    </div>
  );
}
