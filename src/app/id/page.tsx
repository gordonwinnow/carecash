import type { Metadata } from "next";
import Link from "next/link";
import { Camera, EyeOff, Handshake, Languages, PiggyBank, Smartphone } from "lucide-react";
import { SiteFooter, SiteHeader } from "../landing";
import { LANDING } from "../landing-copy";

/**
 * /id: for the Indonesian caregiver (perawat / asisten rumah tangga) whose employer invited her to CareCash.
 * Written in Bahasa Indonesia only; it should get a native speaker's review.
 */
export const metadata: Metadata = {
  title: "CareCash untuk perawat: catatan uang belanja yang melindungi kamu",
  description:
    "Untuk perawat dan asisten rumah tangga di Taiwan: setiap uang yang kamu terima dikonfirmasi kedua pihak, foto struk jadi bukti belanja, dan uang pribadimu yang terpakai tercatat. Gratis, dalam Bahasa Indonesia, tanpa unduh.",
  alternates: { canonical: "/id" },
  openGraph: {
    title: "CareCash untuk perawat: uang belanja jelas, kamu terlindungi",
    description: "Serah terima uang dikonfirmasi kedua pihak, foto struk jadi bukti, uang pribadimu yang terpakai tercatat. Gratis, Bahasa Indonesia.",
    type: "website",
    locale: "id_ID",
    siteName: "CareCash 家用金",
    images: [{ url: "/icon-1024.png", width: 1024, height: 1024 }],
  },
};

const PROTECT = [
  {
    icon: Handshake,
    t: "Setiap uang dikonfirmasi kedua pihak",
    d: "Saat majikan memberi uang, kamu tekan “Sudah saya terima”. Tidak ada lagi “saya sudah kasih uang” padahal kamu belum menerimanya.",
  },
  {
    icon: Camera,
    t: "Foto struk jadi bukti",
    d: "Setiap belanja ada foto struknya. Kalau ada yang bertanya uangnya dipakai untuk apa, jawabannya sudah ada di sana.",
  },
  {
    icon: PiggyBank,
    t: "Uang pribadimu tercatat",
    d: "Kalau uang belanja habis dan kamu membayar pakai uangmu sendiri, catat saja belanjanya seperti biasa. Saldo jadi minus, artinya majikan perlu mengganti uangmu.",
  },
  {
    icon: Languages,
    t: "Dalam Bahasa Indonesia",
    d: "Kamu membaca dalam Bahasa Indonesia, majikan membaca dalam bahasa Mandarin. Catatannya sama, jadi tidak ada salah paham karena bahasa.",
  },
  {
    icon: Smartphone,
    t: "Gratis, tanpa unduh",
    d: "Buka di browser HP. Bisa ditambahkan ke layar utama supaya terbuka seperti aplikasi. Tidak perlu memori HP.",
  },
  {
    icon: EyeOff,
    t: "Isi HP kamu tetap pribadi",
    d: "Majikan tidak bisa melihat chat, foto, lokasi, atau isi HP kamu yang lain. Majikan hanya melihat apa yang dicatat di CareCash.",
  },
];

const START = [
  { t: "Tunggu link undangan", d: "Majikan akan mengirim link undangan lewat LINE atau WhatsApp." },
  { t: "Buka link-nya", d: "Ketuk link itu di HP kamu. CareCash terbuka di browser." },
  { t: "Buat akun", d: "Daftar dengan email, Google atau LINE. Hanya sekitar 30 detik." },
  { t: "Ketuk “Gabung”", d: "Kamu langsung masuk ke keluarga majikan dan bisa mulai mencatat." },
];

const TIPS = [
  "Foto setiap struk, sekecil apa pun belanjanya.",
  "Tekan “Sudah saya terima” hanya kalau uangnya benar-benar sudah ada di tanganmu.",
  "Kalau membayar pakai uangmu sendiri, langsung catat hari itu juga, jangan ditunda.",
  "Minta majikan mengecek dan melunasi catatan setiap minggu, supaya tidak menumpuk.",
];

const FAQ = [
  {
    q: "Apakah ini untuk mengawasi saya?",
    a: "Tidak. CareCash hanya mencatat uang belanja: uang yang kamu terima dan belanja yang kamu catat. Majikan tidak bisa melihat lokasi, chat, foto, atau apa pun di HP kamu di luar CareCash. Catatan yang jelas justru melindungi kamu, karena setiap uang dan setiap belanja ada buktinya.",
  },
  {
    q: "Apakah gratis?",
    a: "Ya, saat ini sepenuhnya gratis untuk kamu dan majikan. Tidak perlu mengunduh aplikasi, cukup buka di browser HP.",
  },
  {
    q: "Bagaimana kalau uang belanja tidak cukup?",
    a: "Catat saja semua belanja seperti biasa, termasuk yang kamu bayar pakai uangmu sendiri. Saldo akan menjadi minus, dan majikan bisa melihat berapa yang perlu diganti. Sebaiknya kamu juga memberi tahu majikan secara langsung.",
  },
  {
    q: "Siapa yang bisa melihat catatan saya?",
    a: "Hanya anggota keluarga di rumah tangga ini, yaitu orang-orang yang diundang ke keluarga di CareCash. Orang di luar keluarga ini tidak bisa melihatnya.",
  },
  {
    q: "Bagaimana kalau ada masalah lain dengan pekerjaan saya?",
    a: "CareCash hanya untuk mencatat uang belanja. Untuk masalah pekerjaan, kamu bisa menelepon 1955, layanan pengaduan gratis dari Kementerian Tenaga Kerja Taiwan, 24 jam, dan tersedia dalam Bahasa Indonesia.",
  },
];

const SIGNUP = "/sign-in?mode=signup&lang=id&ref=id-page";

export default function IndonesianCaregivers() {
  const c = LANDING.id;
  return (
    <div className="min-h-dvh bg-bg">
      <SiteHeader copy={c} />
      <main lang="id">
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-4 pb-10 pt-6 text-center sm:pt-12">
          <p className="mx-auto mb-4 inline-block rounded-full bg-accent-soft px-4 py-1.5 text-sm font-bold text-accent-ink">Untuk perawat dan asisten rumah tangga</p>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Catatan uang belanja
            <br />
            yang melindungi kamu
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted sm:text-xl">
            Majikan mengundang kamu ke CareCash? Ini bukan untuk mengawasi kamu. CareCash membuat setiap uang yang kamu terima dan setiap belanja jelas buktinya, jadi tidak ada salah paham soal uang.
          </p>
          <div className="mx-auto mt-8 max-w-xs">
            <Link href={SIGNUP} className="btn-primary">Buka CareCash</Link>
          </div>
          <p className="mx-auto mt-5 max-w-md text-sm text-muted">Biasanya majikan akan mengirim link undangan. Buka link itu supaya langsung masuk ke keluarga.</p>
        </section>

        {/* How CareCash protects you */}
        <section className="mx-auto max-w-5xl px-4 py-10">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">Bagaimana CareCash melindungi kamu</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROTECT.map(({ icon: Icon, t, d }) => (
              <div key={t} className="card">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent-ink"><Icon size={22} /></span>
                <h3 className="mt-3 text-lg font-bold">{t}</h3>
                <p className="mt-1 text-[15px] text-muted">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to start */}
        <section className="mx-auto max-w-5xl px-4 py-10">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">Cara mulai</h2>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {START.map((s, i) => (
              <li key={s.t} className="card">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-lg font-extrabold text-white">{i + 1}</span>
                <h3 className="mt-3 text-xl font-bold">{s.t}</h3>
                <p className="mt-1 text-muted">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Tips */}
        <section className="mx-auto max-w-3xl px-4 py-10">
          <div className="card p-6 sm:p-8">
            <h2 className="text-2xl font-extrabold">Tips</h2>
            <ul className="mt-4 space-y-3">
              {TIPS.map((t) => (
                <li key={t} className="flex gap-3 text-lg">
                  <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-4 py-10">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">Pertanyaan</h2>
          <div className="mt-6 space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="card group">
                <summary className="cursor-pointer list-none text-lg font-bold">{f.q}</summary>
                <p className="mt-2 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Read also */}
        <section className="mx-auto max-w-3xl px-4 py-4">
          <Link href="/id/panduan/uang-belanja" className="card block hover:border-accent">
            <p className="text-sm font-bold text-accent-ink">Baca juga</p>
            <p className="mt-1 text-lg font-bold">Uang belanja dari majikan: cara mencatat supaya tidak ada salah paham</p>
            <p className="mt-1 text-[15px] text-muted">Pisahkan dari gaji, hitung uang di depan majikan, simpan struk, dan cek bersama setiap minggu.</p>
          </Link>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-5xl px-4 py-12 text-center">
          <h2 className="text-3xl font-extrabold">Uang jelas, hati tenang</h2>
          <p className="mt-3 text-lg text-muted">Gratis, dalam Bahasa Indonesia, langsung di browser HP.</p>
          <div className="mx-auto mt-6 max-w-sm">
            <Link href={SIGNUP} className="btn-primary">Buka CareCash</Link>
          </div>
        </section>
      </main>
      <SiteFooter copy={c} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            inLanguage: "id",
            mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }),
        }}
      />
    </div>
  );
}
