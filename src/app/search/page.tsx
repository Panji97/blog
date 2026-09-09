import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { searchPosts } from "@/lib/data";
import { SearchBox, SearchPageClient } from "@/components/blog/search-box";
import { StandardCard } from "@/components/blog/cards";

export const metadata: Metadata = { title: "Cari" };
export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? await searchPosts(query) : [];

  return (
    <div className="mx-auto max-w-[880px] px-5 py-14 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        Cari
      </p>
      <h1 className="mt-4 font-serif text-5xl tracking-tight">
        Temukan sebuah cerita
      </h1>
      <div className="mt-8">
        <Suspense>
          <SearchPageClient />
        </Suspense>
      </div>

      {!query && (
        <div className="mt-10 border-t border-border pt-8">
          <p className="text-[15px] text-muted">
            Coba “SQLite”, “tipografi”, atau “teknologi yang sederhana”.
          </p>
        </div>
      )}

      {query && (
        <section
          className="mt-10"
          aria-live="polite"
          aria-label="Hasil pencarian"
        >
          <p className="text-sm text-muted">
            {results.length === 0
              ? `Tidak ada cerita yang ditemukan untuk “${query}”.`
              : `${results.length} cerita untuk “${query}”.`}
          </p>
          {results.length > 0 && (
            <div className="mt-4">
              {results.map((p) => (
                <StandardCard key={p.id} post={p} />
              ))}
            </div>
          )}
          {results.length === 0 && (
            <div className="mt-6">
              <p className="text-[15px] text-muted">
                Coba istilah lain, atau jelajahi arsip lengkapnya.
              </p>
              <Link
                href="/blog"
                className="link-underline mt-2 inline-block text-sm"
              >
                Lihat semua artikel →
              </Link>
            </div>
          )}
        </section>
      )}

      {/* No-JS fallback: server-rendered form posts q via GET */}
      <noscript>
        <form action="/search" method="get" className="mt-6 flex gap-2">
          <input
            name="q"
            placeholder="Cari artikel..."
            className="h-11 flex-1 rounded-md border border-border px-3"
          />
          <button className="h-11 rounded-md bg-foreground px-5 text-sm text-background">
            Cari
          </button>
        </form>
      </noscript>
    </div>
  );
}

// Keep an SSR-friendly input for crawlers (unused, SearchBox is the real one)
export function SearchFallback() {
  return <SearchBox initial="" />;
}
