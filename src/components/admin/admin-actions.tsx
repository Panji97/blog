"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePostAction, togglePublishAction } from "@/lib/actions";

export function PublishToggle({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      disabled={pending}
      onClick={() => start(async () => { await togglePublishAction(id); router.refresh(); })}
      className="rounded-md border border-border px-3 py-1.5 text-[13px] hover:bg-surface disabled:opacity-50"
    >
      {pending ? "..." : status === "published" ? "Unpublish" : "Publish"}
    </button>
  );
}

export function DeletePost({ id, title }: { id: string; title: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();
  if (!confirming) {
    return (
      <button onClick={() => setConfirming(true)} className="rounded-md border border-border px-3 py-1.5 text-[13px] text-accent hover:bg-surface">
        Delete
      </button>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 text-[13px]">
      <span className="text-muted">Delete “{title.slice(0, 30)}”?</span>
      <button
        disabled={pending}
        onClick={() => start(async () => { await deletePostAction(id); })}
        className="rounded-md bg-accent px-3 py-1.5 text-white disabled:opacity-50"
      >
        {pending ? "..." : "Confirm"}
      </button>
      <button onClick={() => setConfirming(false)} className="rounded-md border border-border px-3 py-1.5 hover:bg-surface">
        Cancel
      </button>
    </span>
  );
}
