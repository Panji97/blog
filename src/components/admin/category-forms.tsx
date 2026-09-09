"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteCategoryAction, upsertCategoryAction } from "@/lib/actions";
import { Input, Label } from "@/components/ui/fields";
import { Button } from "@/components/ui/button";

export function CategoryForm({ id, name: n, slug: s, description: d }: { id?: string; name: string; slug: string; description: string }) {
  const router = useRouter();
  const [name, setName] = useState(n);
  const [slug, setSlug] = useState(s);
  const [description, setDescription] = useState(d);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        start(async () => {
          const fd = new FormData();
          fd.set("name", name);
          fd.set("slug", slug);
          fd.set("description", description);
          const res = await upsertCategoryAction(id ?? null, fd);
          if (res && "error" in res && res.error) setError(res.error);
          else { setName(""); setSlug(""); setDescription(""); router.refresh(); }
        });
      }}
      className="flex flex-wrap items-end gap-3 rounded-md border border-border p-4"
    >
      <div className="min-w-[160px] flex-1 space-y-1">
        <Label htmlFor={id ? `name-${id}` : "new-name"}>Name</Label>
        <Input id={id ? `name-${id}` : "new-name"} value={name} onChange={(e) => setName(e.target.value)} required placeholder="Technology" />
      </div>
      <div className="min-w-[160px] flex-1 space-y-1">
        <Label htmlFor={id ? `slug-${id}` : "new-slug"}>Slug</Label>
        <Input id={id ? `slug-${id}` : "new-slug"} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="technology" />
      </div>
      <div className="min-w-[200px] flex-[2] space-y-1">
        <Label htmlFor={id ? `desc-${id}` : "new-desc"}>Description</Label>
        <Input id={id ? `desc-${id}` : "new-desc"} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What this topic covers" />
      </div>
      <Button type="submit" disabled={pending}>{pending ? "Saving..." : id ? "Save" : "Add"}</Button>
      {error && <p role="alert" className="w-full text-sm text-accent">{error}</p>}
    </form>
  );
}

export function DeleteCategory({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();
  if (!confirming) return <button onClick={() => setConfirming(true)} className="text-[13px] text-accent hover:underline">Delete</button>;
  return (
    <span className="inline-flex items-center gap-2 text-[13px]">
      <span className="text-muted">Delete “{name}”?</span>
      <button disabled={pending} onClick={() => start(async () => { await deleteCategoryAction(id); router.refresh(); })} className="rounded bg-accent px-2 py-1 text-white">Yes</button>
      <button onClick={() => setConfirming(false)} className="rounded border border-border px-2 py-1">No</button>
    </span>
  );
}
