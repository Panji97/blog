import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb, initDb } from "@/db";
import { categories, postTags, tags } from "@/db/schema";
import { getPostById } from "@/lib/data";
import { EditorForm } from "@/components/admin/editor-form";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  initDb();
  const db = getDb();
  const post = await getPostById(id);
  if (!post) notFound();
  const cats = await db.select().from(categories).orderBy(categories.name);
  const tagRows = await db
    .select({ name: tags.name })
    .from(postTags)
    .innerJoin(tags, eq(tags.id, postTags.tagId))
    .where(eq(postTags.postId, id));

  return (
    <div>
      <Link href="/admin/posts" className="link-underline text-sm">
        ← Artikel
      </Link>
      <h2 className="mt-2 font-serif text-3xl tracking-tight">Edit artikel</h2>
      <p className="mt-1 text-sm text-muted">
        Draf tersimpan otomatis saat Anda mengetik.
      </p>
      <div className="mt-6">
        <EditorForm
          categories={cats}
          initial={{
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt ?? "",
            content: post.content,
            categoryId: post.categoryId ?? "",
            tags: tagRows.map((t) => t.name).join(", "),
            seoTitle: post.seoTitle ?? "",
            seoDescription: post.seoDescription ?? "",
            status: (post.status as "draft" | "published") ?? "draft",
          }}
        />
      </div>
    </div>
  );
}
