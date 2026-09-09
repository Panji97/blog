"use client";
import { useState } from "react";
import { Check, Link2 } from "lucide-react";

export function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/blog/${slug}` : `/blog/${slug}`;
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }
  return (
    <div className="flex items-center gap-2">
      <a
        href={`https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm hover:bg-surface"
      >
        Share on X
      </a>
      <button
        onClick={copy}
        className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm hover:bg-surface"
        aria-live="polite"
      >
        {copied ? <Check size={15} /> : <Link2 size={15} />}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
