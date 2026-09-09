import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "@/lib/actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <div className="mx-auto max-w-[1080px] px-5 py-10 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Admin</p>
          <h1 className="mt-1 font-serif text-3xl tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Signed in as {user.name} ({user.email})</p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="h-9 rounded-md border border-border px-4 text-sm hover:bg-surface">
            Log out
          </button>
        </form>
      </div>
      <nav className="mt-5 flex gap-2 text-sm" aria-label="Admin">
        <Link href="/admin" className="rounded-md border border-border px-3 py-1.5 hover:bg-surface">Overview</Link>
        <Link href="/admin/posts" className="rounded-md border border-border px-3 py-1.5 hover:bg-surface">Posts</Link>
        <Link href="/admin/posts/new" className="rounded-md border border-border px-3 py-1.5 hover:bg-surface">New post</Link>
        <Link href="/admin/categories" className="rounded-md border border-border px-3 py-1.5 hover:bg-surface">Categories</Link>
        <Link href="/" className="rounded-md border border-border px-3 py-1.5 hover:bg-surface">View site →</Link>
      </nav>
      <div className="mt-8">{children}</div>
    </div>
  );
}
