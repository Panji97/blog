import Link from "next/link";
import { Search } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { getSessionUser } from "@/lib/auth";

export async function SiteHeader() {
  const user = await getSessionUser();
  return (
    <header className="border-b border-border">
      <a href="#content" className="skip-link">
        Lewati ke konten
      </a>
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-2 px-4 py-2 md:flex-nowrap md:px-8 md:py-0">
        <div className="flex items-center gap-3 sm:gap-8">
          <Link
            href="/"
            className="flex items-baseline gap-2"
            aria-label="Beranda"
          >
            <span className="font-serif text-[20px] leading-none tracking-tight sm:text-[22px]">
              Marginalia
            </span>
            <span className="hidden text-[11px] uppercase tracking-[0.18em] text-muted sm:inline">
              Publikasi
            </span>
          </Link>
          <nav
            className="hidden items-center gap-6 text-sm md:flex"
            aria-label="Primary"
          >
            <Link href="/blog" className="link-underline text-foreground/90">
              Artikel
            </Link>
            <Link href="/#topics" className="link-underline text-foreground/90">
              Topik
            </Link>
            <Link href="/about" className="link-underline text-foreground/90">
              Tentang
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Cari"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-surface transition-colors"
          >
            <Search size={16} />
          </Link>
          <ThemeToggle />
          {user ? (
            <Link
              href="/admin"
              className="ml-1 hidden h-9 items-center rounded-md bg-foreground px-4 text-sm font-medium text-background hover:opacity-85 sm:inline-flex"
            >
              Dasbor
            </Link>
          ) : (
            <Link
              href="/login"
              className="ml-1 hidden h-9 items-center rounded-md bg-foreground px-4 text-sm font-medium text-background hover:opacity-85 sm:inline-flex"
            >
              Masuk
            </Link>
          )}
          <details className="relative md:hidden">
            <summary className="inline-flex h-9 cursor-pointer list-none items-center rounded-md border border-border px-3 text-sm [&::-webkit-details-marker]:hidden">
              Menu
            </summary>
            <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-border bg-background p-2 shadow-sm">
              <Link
                href="/blog"
                className="block rounded px-3 py-2 text-sm hover:bg-surface"
              >
                Artikel
              </Link>
              <Link
                href="/#topics"
                className="block rounded px-3 py-2 text-sm hover:bg-surface"
              >
                Topik
              </Link>
              <Link
                href="/about"
                className="block rounded px-3 py-2 text-sm hover:bg-surface"
              >
                Tentang
              </Link>
              <Link
                href={user ? "/admin" : "/login"}
                className="block rounded px-3 py-2 text-sm hover:bg-surface"
              >
                {user ? "Dasbor" : "Masuk"}
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <p className="font-serif text-2xl tracking-tight">Marginalia</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            Ide, catatan, dan hal yang layak dipikirkan. Esai, catatan teknis,
            dan observasi dari pekerjaan di balik layar.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
            Publikasi
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/blog" className="link-underline">
                Semua artikel
              </Link>
            </li>
            <li>
              <Link href="/search" className="link-underline">
                Cari
              </Link>
            </li>
            <li>
              <Link href="/about" className="link-underline">
                Tentang
              </Link>
            </li>
            <li>
              <Link href="/sitemap.xml" className="link-underline">
                Sitemap
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
            Kolofon
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Menggunakan Instrument Serif &amp; Geist. Dibuat dengan Next.js dan
            SQLite. Tanpa pelacak, tanpa pop-up.
          </p>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-2 px-5 py-5 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between md:px-8">
          <span>
            © {new Date().getFullYear()} Marginalia. Semua esai adalah milik
            penulis.
          </span>
          <span>UI lebih sedikit. Karakter editorial lebih banyak.</span>
        </div>
      </div>
    </footer>
  );
}
