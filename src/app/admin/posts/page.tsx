import Link from "next/link";
import { desc } from "drizzle-orm";
import { getDb, initDb } from "@/db";
import { categories, posts } from "@/db/schema";
import { formatDate } from "@/lib/utils";
import { DeletePost, PublishToggle } from "@/components/admin/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminPosts() {
  initDb();
  const db = getDb();
  const all = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.updatedAt))
    .limit(100);
  const cats = await db.select().from(categories);
  const catMap = new Map(cats.map((c) => [c.id, c.name]));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl tracking-tight">Artikel</h2>
        <Link
          href="/admin/posts/new"
          className="inline-flex h-9 items-center rounded-md bg-foreground px-4 text-sm font-medium text-background hover:opacity-85"
        >
          Artikel baru
        </Link>
      </div>
      <div className="mt-4 overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-[13px] uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Judul</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 font-medium">Diperbarui</th>
              <th className="px-4 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {all.map((p) => (
              <tr
                key={p.id}
                className="border-b border-border/60 last:border-0"
              >
                <td className="max-w-[280px] truncate px-4 py-3 font-medium">
                  {p.title}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full border px-2.5 py-0.5 text-xs ${p.status === "published" ? "border-accent/50 text-accent" : "border-border text-muted"}`}
                  >
                    {p.status === "published" ? "Diterbitkan" : "Draf"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">
                  {p.categoryId ? (catMap.get(p.categoryId) ?? "—") : "—"}
                </td>
                <td className="px-4 py-3 text-muted">
                  {formatDate(p.updatedAt)}
                </td>
                <td className="px-4 py-3">
                  <span className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/posts/${p.id}/edit`}
                      className="rounded-md border border-border px-3 py-1.5 text-[13px] hover:bg-surface"
                    >
                      Edit
                    </Link>
                    {p.status === "published" && (
                      <Link
                        href={`/blog/${p.slug}`}
                        target="_blank"
                        className="rounded-md border border-border px-3 py-1.5 text-[13px] hover:bg-surface"
                      >
                        Pratinjau
                      </Link>
                    )}
                    <PublishToggle id={p.id} status={p.status} />
                    <DeletePost id={p.id} title={p.title} />
                  </span>
                </td>
              </tr>
            ))}
            {all.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  Belum ada artikel.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
