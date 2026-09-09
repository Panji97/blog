import type { Metadata } from "next";

export const metadata: Metadata = { title: "About", description: "About Marginalia — a one-person publication on software, design, and attention." };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[760px] px-5 py-14 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">About</p>
      <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl">
        A publication for people who care about how ideas are presented.
      </h1>
      <div className="prose-editorial mt-8">
        <p>
          Marginalia is a one-person publication about software, design, and attention. Essays when there&apos;s something
          worth saying, technical notes from real work, and short observations that don&apos;t fit anywhere else.
        </p>
        <h2>What you&apos;ll find here</h2>
        <p>
          Long-form essays on building software, notes on typography and interfaces, and field reports from shipping
          small things with boring technology. Everything is edited, nothing is optimized for an algorithm.
        </p>
        <h2>How it&apos;s made</h2>
        <p>
          This site is a single Next.js app backed by SQLite, styled with warm neutrals and one serif. Articles are
          written in Markdown, rendered on the server, and shipped with almost no JavaScript. No trackers, no popups,
          no newsletter walls.
        </p>
        <h2>Contact</h2>
        <p>
          The best way to respond to an essay is to write your own and send the link. For anything else, reach the
          author through the admin account on this instance.
        </p>
      </div>
    </div>
  );
}
