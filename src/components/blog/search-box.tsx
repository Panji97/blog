"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";

export function SearchBox({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(value.trim())}`);
      }}
      className="flex gap-2"
    >
      <label htmlFor="q" className="sr-only">Search articles</label>
      <div className="relative flex-1">
        <SearchIcon size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          id="q"
          name="q"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search articles..."
          autoComplete="off"
          className="h-11 w-full rounded-md border border-border bg-background pl-9 pr-3 text-[15px] placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>
      <button type="submit" className="h-11 rounded-md bg-foreground px-5 text-sm font-medium text-background hover:opacity-85">
        Search
      </button>
    </form>
  );
}

export function SearchPageClient() {
  const params = useSearchParams();
  return <SearchBox initial={params.get("q") ?? ""} />;
}
