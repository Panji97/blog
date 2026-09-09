import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "@/lib/actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  return (
    <div className="mx-auto max-w-[1080px] px-4 py-6 sm:px-5 sm:py-10 md:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Admin
          </p>
          <h1 className="mt-1 font-serif text-[2rem] tracking-tight sm:text-3xl">
            Dasbor
          </h1>
          <p className="mt-1 max-w-[min(100%,28rem)] break-words text-sm text-muted">
            Masuk sebagai {user.name} ({user.email})
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="h-10 rounded-md border border-border px-3 text-sm hover:bg-surface sm:px-4"
          >
            Keluar
          </button>
        </form>
      </div>
      <nav
        className="mt-5 grid grid-cols-2 gap-2 text-sm sm:flex sm:flex-wrap"
        aria-label="Admin"
      >
        <Link
          href="/admin"
          className="inline-flex min-h-10 items-center justify-center rounded-md border border-border px-2 py-2 text-center hover:bg-surface sm:px-3 sm:py-1.5"
        >
          Ringkasan
        </Link>
        <Link
          href="/admin/posts"
          className="inline-flex min-h-10 items-center justify-center rounded-md border border-border px-2 py-2 text-center hover:bg-surface sm:px-3 sm:py-1.5"
        >
          Artikel
        </Link>
        <Link
          href="/admin/posts/new"
          className="inline-flex min-h-10 items-center justify-center rounded-md border border-border px-2 py-2 text-center hover:bg-surface sm:px-3 sm:py-1.5"
        >
          Artikel baru
        </Link>
        <Link
          href="/admin/categories"
          className="inline-flex min-h-10 items-center justify-center rounded-md border border-border px-2 py-2 text-center hover:bg-surface sm:px-3 sm:py-1.5"
        >
          Kategori
        </Link>
        <Link
          href="/"
          className="col-span-2 inline-flex min-h-10 items-center justify-center rounded-md border border-border px-2 py-2 text-center hover:bg-surface sm:col-span-1 sm:px-3 sm:py-1.5"
        >
          Lihat situs →
        </Link>
      </nav>
      <div className="mt-7 sm:mt-8">{children}</div>
    </div>
  );
}
