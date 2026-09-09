import Link from "next/link";
import type { PostWithMeta } from "@/lib/data";
import { formatDate } from "@/lib/utils";

function Meta({
  post,
  light = false,
}: {
  post: PostWithMeta;
  light?: boolean;
}) {
  return (
    <p
      className={`break-words text-[13px] tracking-wide ${light ? "text-foreground/70" : "text-muted"}`}
    >
      {post.authorName ?? "Penulis"} · {formatDate(post.publishedAt)} ·{" "}
      {post.readingTime} menit baca
    </p>
  );
}

export function FeaturedCard({ post }: { post: PostWithMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid gap-6 border-y border-border py-8 sm:gap-8 md:grid-cols-[1.2fr_1fr] md:gap-8 md:py-14"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {post.categoryName ?? "Esai"}
        </p>
        <h2 className="mt-4 font-serif text-[2rem] leading-[1.05] tracking-tight text-balance group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 sm:text-[2.75rem] md:text-6xl">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted sm:text-[17px]">
            {post.excerpt}
          </p>
        )}
        <div className="mt-6">
          <Meta post={post} />
        </div>
      </div>
      <div className="flex flex-col justify-end border-t border-border pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
        <p className="font-serif text-base italic leading-snug text-muted sm:text-lg">
          “{post.excerpt?.split(".")[0] ?? post.title}.”
        </p>
        <span className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-medium">
          Baca ceritanya{" "}
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

export function StandardCard({ post }: { post: PostWithMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block border-t border-border py-6 sm:py-7"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        {post.categoryName ?? "Esai"}
      </p>
      <h3 className="mt-2.5 font-serif text-[1.55rem] leading-tight tracking-tight group-hover:underline group-hover:underline-offset-4 group-hover:decoration-1 sm:text-[26px]">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="mt-2 text-[14px] leading-relaxed text-muted sm:text-[15px]">
          {post.excerpt}
        </p>
      )}
      <div className="mt-3">
        <Meta post={post} />
      </div>
    </Link>
  );
}

export function MinimalRow({
  post,
  index,
}: {
  post: PostWithMeta;
  index?: number;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid grid-cols-[86px_1fr] gap-4 border-t border-border py-4 sm:grid-cols-[110px_1fr_auto] sm:items-baseline"
    >
      <span className="text-[13px] tabular-nums text-muted">
        {formatDate(post.publishedAt)}
      </span>
      <span>
        <span className="block text-[16px] font-medium leading-snug group-hover:underline group-hover:underline-offset-4">
          {post.title}
        </span>
        <span className="mt-1 block text-[13px] text-muted">
          {post.categoryName} · {post.readingTime} menit baca
        </span>
      </span>
      {typeof index === "number" && (
        <span className="hidden font-serif text-sm italic text-muted sm:block">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
    </Link>
  );
}
