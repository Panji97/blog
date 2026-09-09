import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoriesWithCounts, getPostsByCategory } from "@/lib/data";
import { MinimalRow } from "@/components/blog/cards";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPostsByCategory(slug);
  if (!data) return { title: "Topik tidak ditemukan" };
  return {
    title: `${data.category.name} — cerita`,
    description:
      data.category.description ?? `Cerita tentang ${data.category.name}.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPostsByCategory(slug);
  if (!data) notFound();
  const cats = await getCategoriesWithCounts();

  return (
    <div className="mx-auto max-w-[880px] px-5 py-14 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        Topik
      </p>
      <h1 className="mt-4 font-serif text-5xl tracking-tight md:text-6xl">
        {data.category.name}
      </h1>
      <p className="mt-4 text-[17px] text-muted">
        {data.posts.length} cerita
        {data.category.description
          ? ` tentang ${data.category.description.charAt(0).toLowerCase()}${data.category.description.slice(1)}`
          : "."}
      </p>

      {data.posts.length === 0 ? (
        <div className="mt-12 border-t border-border pt-8">
          <p className="font-serif text-2xl">Belum ada cerita di sini.</p>
          <p className="mt-2 text-muted">
            Cerita yang diterbitkan dalam topik ini akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="mt-10 border-b border-border">
          {data.posts.map((p, i) => (
            <MinimalRow key={p.id} post={p} index={i} />
          ))}
        </div>
      )}

      <section className="mt-14" aria-label="Other topics">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          Topik lain
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {cats
            .filter((c) => c.slug !== slug)
            .map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className="rounded-full border border-border px-4 py-1.5 text-sm hover:bg-surface"
              >
                {c.name} <span className="text-muted">({c.count})</span>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
