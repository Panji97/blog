import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { getDb, initDb } from "@/db";
import { categories, posts } from "@/db/schema";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  initDb();
  const db = getDb();
  const published = await db
    .select({ c: sql<number>`count(*)` })
    .from(posts)
    .where(eq(posts.status, "published"));
  const drafts = await db
    .select({ c: sql<number>`count(*)` })
    .from(posts)
    .where(eq(posts.status, "draft"));
  const catCount = await db
    .select({ c: sql<number>`count(*)` })
    .from(categories);
  const recent = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.updatedAt))
    .limit(6);

  const stats = [
    { label: "Diterbitkan", value: published[0]?.c ?? 0, href: "/admin/posts" },
    { label: "Draf", value: drafts[0]?.c ?? 0, href: "/admin/posts" },
    {
      label: "Kategori",
      value: catCount[0]?.c ?? 0,
      href: "/admin/categories",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-md border border-border p-4 hover:bg-surface/50 sm:p-5"
          >
            <p className="font-serif text-3xl sm:text-4xl">{s.value}</p>
            <p className="mt-1 text-sm text-muted">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 sm:mt-10">
        <h2 className="font-serif text-xl tracking-tight sm:text-2xl">
          Artikel terbaru
        </h2>
        <Link
          href="/admin/posts/new"
          className="inline-flex h-10 items-center rounded-md bg-foreground px-3 text-sm font-medium text-background hover:opacity-85 sm:px-4"
        >
          Artikel baru
        </Link>
      </div>
      <div className="mt-4 hidden overflow-x-auto rounded-md border border-border md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-[13px] uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Judul</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Diperbarui</th>
              <th className="px-4 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((p) => (
              <tr
                key={p.id}
                className="border-b border-border/60 last:border-0"
              >
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full border px-2.5 py-0.5 text-xs ${p.status === "published" ? "border-accent/50 text-accent" : "border-border text-muted"}`}
                  >
                    {p.status === "published" ? "Diterbitkan" : "Draf"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">
                  {formatDate(p.updatedAt)}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/posts/${p.id}/edit`}
                    className="link-underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  Belum ada artikel. Buat draf pertama Anda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 space-y-3 md:hidden">
        {recent.map((p) => (
          <article key={p.id} className="rounded-md border border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="min-w-0 break-words font-medium">{p.title}</h3>
              <span
                className={`shrink-0 rounded-full border px-2 py-0.5 text-xs ${p.status === "published" ? "border-accent/50 text-accent" : "border-border text-muted"}`}
              >
                {p.status === "published" ? "Diterbitkan" : "Draf"}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-[13px] text-muted">
              <span>Diperbarui {formatDate(p.updatedAt)}</span>
              <Link
                href={`/admin/posts/${p.id}/edit`}
                className="shrink-0 font-medium text-foreground underline underline-offset-4"
              >
                Edit
              </Link>
            </div>
          </article>
        ))}
        {recent.length === 0 && (
          <p className="rounded-md border border-border px-4 py-8 text-center text-muted">
            Belum ada artikel. Buat draf pertama Anda.
          </p>
        )}
      </div>
    </div>
  );
}
