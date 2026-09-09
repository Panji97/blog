import type { Metadata } from "next";
import { Suspense } from "react";
import { searchPosts } from "@/lib/data";
import { SearchBox, SearchPageClient } from "@/components/blog/search-box";
import { StandardCard } from "@/components/blog/cards";

export const metadata: Metadata = { title: "Search" };
export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? await searchPosts(query) : [];

  return (
    <div className="mx-auto max-w-[880px] px-5 py-14 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Search</p>
      <h1 className="mt-4 font-serif text-5xl tracking-tight">Find a story</h1>
      <div className="mt-8">
        <Suspense><SearchPageClient /></Suspense>
      </div>

      {!query && (
        <div className="mt-10 border-t border-border pt-8">
          <p className="text-[15px] text-muted">Try “SQLite”, “typography”, or “boring technology”.</p>
        </div>
      )}

      {query && (
        <section className="mt-10" aria-live="polite" aria-label="Search results">
          <p className="text-sm text-muted">
            {results.length === 0
              ? `No stories found for “${query}”.`
              : `${results.length} ${results.length === 1 ? "story" : "stories"} for “${query}”.`}
          </p>
          {results.length > 0 && (
            <div className="mt-4">
              {results.map((p) => <StandardCard key={p.id} post={p} />)}
            </div>
          )}
          {results.length === 0 && (
            <div className="mt-6">
              <p className="text-[15px] text-muted">Try a different term, or browse the full archive.</p>
              <a href="/blog" className="link-underline mt-2 inline-block text-sm">View all articles →</a>
            </div>
          )}
        </section>
      )}

      {/* No-JS fallback: server-rendered form posts q via GET */}
      <noscript>
        <form action="/search" method="get" className="mt-6 flex gap-2">
          <input name="q" placeholder="Search articles..." className="h-11 flex-1 rounded-md border border-border px-3" />
          <button className="h-11 rounded-md bg-foreground px-5 text-sm text-background">Search</button>
        </form>
      </noscript>
    </div>
  );
}

// Keep an SSR-friendly input for crawlers (unused, SearchBox is the real one)
export function SearchFallback() {
  return <SearchBox initial="" />;
}
