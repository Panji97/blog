"use client";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createPostAction, updatePostAction } from "@/lib/actions";
import { slugifyTitle } from "@/lib/utils";
import { Input, Label, Textarea } from "@/components/ui/fields";
import { Button } from "@/components/ui/button";

export type EditorInitial = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: string;
  tags: string;
  seoTitle: string;
  seoDescription: string;
  status: "draft" | "published";
};

export function EditorForm({
  initial,
  categories,
}: {
  initial: EditorInitial;
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(!!initial.slug);
  const [excerpt, setExcerpt] = useState(initial.excerpt);
  const [content, setContent] = useState(initial.content);
  const [categoryId, setCategoryId] = useState(initial.categoryId);
  const [tags, setTags] = useState(initial.tags);
  const [seoTitle, setSeoTitle] = useState(initial.seoTitle);
  const [seoDescription, setSeoDescription] = useState(initial.seoDescription);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [pending, start] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!slugTouched) setSlug(slugifyTitle(title));
  }, [title, slugTouched]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDirty(true);
  }, [
    title,
    slug,
    excerpt,
    content,
    categoryId,
    tags,
    seoTitle,
    seoDescription,
  ]);

  // Unsaved-changes warning
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // Autosave drafts on edit
  useEffect(() => {
    if (!initial.id || !dirty) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const fd = buildFormData("draft");
      const res = await updatePostAction(initial.id!, fd);
      if (!res || (res as { ok?: boolean }).ok) {
        setSavedAt(new Date().toLocaleTimeString());
        setDirty(false);
        router.refresh();
      }
    }, 2500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    title,
    slug,
    excerpt,
    content,
    categoryId,
    tags,
    seoTitle,
    seoDescription,
  ]);

  function buildFormData(status: "draft" | "published") {
    const fd = new FormData();
    fd.set("title", title);
    fd.set("slug", slug);
    fd.set("excerpt", excerpt);
    fd.set("content", content);
    fd.set("categoryId", categoryId);
    fd.set("tags", tags);
    fd.set("seoTitle", seoTitle);
    fd.set("seoDescription", seoDescription);
    fd.set("status", status);
    return fd;
  }

  function submit(status: "draft" | "published") {
    setError(null);
    start(async () => {
      const fd = buildFormData(status);
      if (!initial.id) {
        const res = await createPostAction(fd);
        if (res && "error" in res && res.error) setError(res.error);
      } else {
        const res = await updatePostAction(initial.id, fd);
        if (res && "error" in res && (res as { error?: string }).error) {
          setError((res as { error: string }).error);
        } else {
          setDirty(false);
          router.push("/admin/posts");
          router.refresh();
        }
      }
    });
  }

  const words = useMemo(
    () => content.trim().split(/\s+/).filter(Boolean).length,
    [content],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-sm text-muted">
          <span>
            {words} kata · ~{Math.max(1, Math.round(words / 200))} menit
          </span>
          {savedAt && <span aria-live="polite">Tersimpan {savedAt}</span>}
          {dirty && (
            <span className="text-accent">· Perubahan belum disimpan</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => submit("draft")}
          >
            {pending ? "Menyimpan..." : "Simpan draf"}
          </Button>
          {initial.id && initial.status === "published" && (
            <a
              href={`/blog/${slug}`}
              target="_blank"
              className="inline-flex h-9 items-center rounded-md border border-border px-4 text-sm hover:bg-surface"
            >
              Pratinjau
            </a>
          )}
          <Button
            variant="accent"
            disabled={pending}
            onClick={() => submit("published")}
          >
            {pending ? "Menerbitkan..." : "Terbitkan"}
          </Button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-sm"
        >
          {error}
        </p>
      )}

      <div className="mt-6 space-y-1.5">
        <Label htmlFor="title">Judul ({title.length}/160)</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul yang jelas dan spesifik"
          maxLength={160}
        />
      </div>

      <div className="mt-4 space-y-1.5">
        <Label htmlFor="excerpt">Ringkasan ({excerpt.length}/300)</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          maxLength={300}
          placeholder="Satu atau dua kalimat tentang nilai tulisan ini."
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <div
            className="flex gap-1 border-b border-border"
            role="tablist"
            aria-label="Editor"
          >
            {(["write", "preview"] as const).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm capitalize ${tab === t ? "border-b-2 border-accent font-medium" : "text-muted hover:text-foreground"}`}
              >
                {t === "write" ? "Tulis" : "Pratinjau"}
              </button>
            ))}
          </div>
          {tab === "write" ? (
            <Textarea
              aria-label="Konten artikel (Markdown)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              wrap="soft"
              rows={24}
              placeholder={
                "Tulis dalam Markdown...\n\n## Judul bagian\n\nBeberapa paragraf dengan **penekanan**.\n\n```ts\nconst x = 1;\n```\n\n> Kutipan."
              }
              className="mt-4 font-mono text-[13.5px] leading-relaxed"
            />
          ) : (
            <div className="prose-editorial mt-4 rounded-md border border-border p-6 text-[1rem]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || "*Belum ada pratinjau.*"}
              </ReactMarkdown>
            </div>
          )}
        </div>

        <aside
          className="h-fit space-y-5 rounded-md border border-border p-5 lg:sticky lg:top-6"
          aria-label="Pengaturan artikel"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
            Pengaturan artikel
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              placeholder="slug-bacaan-tersusun"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="category">Kategori</Label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm focus:border-accent focus:outline-none"
            >
              <option value="">Tanpa kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tags">Tag (dipisahkan koma)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Next.js, Keterampilan"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="seoTitle">Judul SEO ({seoTitle.length}/70)</Label>
            <Input
              id="seoTitle"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              maxLength={70}
              placeholder="Default ke judul"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="seoDescription">
              Deskripsi SEO ({seoDescription.length}/160)
            </Label>
            <Textarea
              id="seoDescription"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              rows={3}
              maxLength={160}
              placeholder="Default ke ringkasan"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
