import Link from "next/link";
import { getDb, initDb } from "@/db";
import { categories } from "@/db/schema";
import {
  CategoryForm,
  DeleteCategory,
} from "@/components/admin/category-forms";

export const dynamic = "force-dynamic";

export default async function AdminCategories() {
  initDb();
  const cats = await getDb().select().from(categories).orderBy(categories.name);
  return (
    <div>
      <h2 className="font-serif text-2xl tracking-tight">Kategori</h2>
      <p className="mt-1 text-sm text-muted">
        Topik yang ditampilkan di beranda dan halaman kategori.
      </p>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-medium">Tambah kategori</h3>
        <CategoryForm name="" slug="" description="" />
      </div>

      <ul className="mt-8 space-y-4">
        {cats.map((c) => (
          <li key={c.id} className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm">
                <Link
                  href={`/category/${c.slug}`}
                  className="font-medium link-underline"
                >
                  {c.name}
                </Link>
                <span className="text-muted"> · /{c.slug}</span>
              </p>
              <DeleteCategory id={c.id} name={c.name} />
            </div>
            <CategoryForm
              id={c.id}
              name={c.name}
              slug={c.slug}
              description={c.description ?? ""}
            />
          </li>
        ))}
        {cats.length === 0 && (
          <li className="text-sm text-muted">Belum ada kategori.</li>
        )}
      </ul>
    </div>
  );
}
