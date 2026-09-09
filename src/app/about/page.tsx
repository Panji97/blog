import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang",
  description:
    "Tentang Marginalia — publikasi satu orang tentang perangkat lunak, desain, dan perhatian.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[760px] px-5 py-14 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        Tentang
      </p>
      <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl">
        Publikasi bagi mereka yang peduli bagaimana ide disajikan.
      </h1>
      <div className="prose-editorial mt-8">
        <p>
          Marginalia adalah publikasi satu orang tentang perangkat lunak,
          desain, dan perhatian. Esai ketika ada sesuatu yang layak dikatakan,
          catatan teknis dari pekerjaan nyata, serta observasi singkat yang
          tidak cocok di tempat lain.
        </p>
        <h2>Apa yang akan Anda temukan di sini</h2>
        <p>
          Esai panjang tentang membangun perangkat lunak, catatan tentang
          tipografi dan antarmuka, serta laporan lapangan dari mengirimkan
          hal-hal kecil dengan teknologi yang sederhana. Segalanya diedit, dan
          tidak ada yang dioptimalkan untuk algoritma.
        </p>
        <h2>Bagaimana cara pembuatannya</h2>
        <p>
          Situs ini adalah satu aplikasi Next.js dengan SQLite di belakangnya,
          dibangun dengan nuansa hangat dan satu serif. Artikel ditulis dalam
          Markdown, dirender di server, dan dikirim dengan hampir tanpa
          JavaScript. Tanpa pelacak, tanpa pop-up, tanpa tembok buletin.
        </p>
        <h2>Kontak</h2>
        <p>
          Cara terbaik untuk menanggapi sebuah esai adalah menulis versi Anda
          sendiri dan mengirimkan tautannya. Untuk hal lain, hubungi penulis
          melalui akun admin di instance ini.
        </p>
      </div>
    </div>
  );
}
