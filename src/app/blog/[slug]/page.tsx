import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPostBySlug,
  getPrevNext,
  getPublishedPosts,
  getRelated,
  siteUrl,
} from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { MarkdownContent } from "@/components/blog/markdown";
import { ShareButtons } from "@/components/blog/share";
import { StandardCard } from "@/components/blog/cards";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const posts = await getPublishedPosts(100);
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") return { title: "Tidak ditemukan" };
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || post.title;
  const url = `${siteUrl}/blog/${post.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: post.authorName ? [post.authorName] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") notFound();

  const related = await getRelated(post, 3);
  const { prev, next } = await getPrevNext(post.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Person", name: post.authorName ?? "Penulis" },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  };

  return (
    <article className="mx-auto max-w-[1280px] px-5 md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-[760px] pt-12 md:pt-16">
        <nav aria-label="Breadcrumb" className="text-[13px] text-muted">
          <Link href="/" className="link-underline">
            Beranda
          </Link>
          <span aria-hidden> / </span>
          <Link href="/blog" className="link-underline">
            Artikel
          </Link>
          {post.categorySlug && (
            <>
              <span aria-hidden> / </span>
              <Link
                href={`/category/${post.categorySlug}`}
                className="link-underline"
              >
                {post.categoryName}
              </Link>
            </>
          )}
        </nav>

        {post.categoryName && (
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {post.categoryName}
          </p>
        )}
        <h1 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-balance md:text-[56px]">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-5 font-serif text-xl italic leading-relaxed text-muted">
            {post.excerpt}
          </p>
        )}
        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-border py-4 text-sm text-muted">
          <span className="font-medium text-foreground">
            {post.authorName ?? "Penulis"}
          </span>
          <span aria-hidden>·</span>
          <time dateTime={post.publishedAt ?? undefined}>
            {formatDate(post.publishedAt)}
          </time>
          <span aria-hidden>·</span>
          <span>{post.readingTime} menit baca</span>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-[760px]">
        <MarkdownContent content={post.content} />

        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2" aria-label="Tag">
            {post.tags.map((t) => (
              <span
                key={t.slug}
                className="rounded-full border border-border bg-surface px-3 py-1 text-[13px]"
              >
                #{t.name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <ShareButtons title={post.title} slug={post.slug} />
          <Link href="/blog" className="link-underline text-sm">
            ← Semua artikel
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <section
          className="mx-auto mt-16 max-w-[1024px]"
          aria-label="Artikel terkait"
        >
          <h2 className="border-b border-border pb-4 font-serif text-3xl tracking-tight">
            Baca juga
          </h2>
          <div className="grid gap-x-10 md:grid-cols-2">
            {related.map((p) => (
              <StandardCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      <nav
        className="mx-auto mt-12 grid max-w-[1024px] gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2"
        aria-label="Artikel sebelumnya dan berikutnya"
      >
        <div className="bg-background p-6">
          {prev ? (
            <Link href={`/blog/${prev.slug}`} className="group block">
              <span className="text-xs uppercase tracking-[0.15em] text-muted">
                Lebih baru
              </span>
              <span className="mt-2 block font-serif text-xl leading-snug group-hover:underline group-hover:underline-offset-4">
                ← {prev.title}
              </span>
            </Link>
          ) : (
            <span className="text-sm text-muted">
              Ini adalah cerita terbaru.
            </span>
          )}
        </div>
        <div className="bg-background p-6 sm:text-right">
          {next ? (
            <Link href={`/blog/${next.slug}`} className="group block">
              <span className="text-xs uppercase tracking-[0.15em] text-muted">
                Lebih lama
              </span>
              <span className="mt-2 block font-serif text-xl leading-snug group-hover:underline group-hover:underline-offset-4">
                {next.title} →
              </span>
            </Link>
          ) : (
            <span className="text-sm text-muted">
              Ini adalah cerita tertua.
            </span>
          )}
        </div>
      </nav>
    </article>
  );
}
