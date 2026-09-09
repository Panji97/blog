import Link from "next/link";
import { getDb, initDb } from "@/db";
import { categories } from "@/db/schema";
import { EditorForm } from "@/components/admin/editor-form";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  initDb();
  const cats = await getDb().select().from(categories).orderBy(categories.name);
  return (
    <div>
      <Link href="/admin/posts" className="link-underline text-sm">
        ← Artikel
      </Link>
      <h2 className="mt-2 font-serif text-3xl tracking-tight">Artikel baru</h2>
      <p className="mt-1 text-sm text-muted">
        Tulis, simpan draf, pratinjau, lalu terbitkan.
      </p>
      <div className="mt-6">
        <EditorForm
          categories={cats}
          initial={{
            title: "",
            slug: "",
            excerpt: "",
            content: "",
            categoryId: "",
            tags: "",
            seoTitle: "",
            seoDescription: "",
            status: "draft",
          }}
        />
      </div>
    </div>
  );
}
