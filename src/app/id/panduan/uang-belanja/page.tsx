import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { SiteFooter, SiteHeader } from "../../../landing";
import { LANDING } from "../../../landing-copy";

/**
 * /id/panduan/uang-belanja: Indonesian guide for caregivers on recording the employer's household cash.
 * Written in Bahasa Indonesia only; it should get a native speaker's review.
 */
const SLUG = "/id/panduan/uang-belanja";
const TITLE = "Uang belanja dari majikan: cara mencatat supaya tidak ada salah paham";
const DESCRIPTION =
  "Panduan untuk perawat dan asisten rumah tangga di Taiwan: pisahkan uang belanja dari gaji, hitung uang di depan majikan, simpan setiap struk, dan cek bersama setiap minggu.";
const PUBLISHED = "2026-11-26";

export const metadata: Metadata = {
  title: `${TITLE}｜CareCash`,
  description: DESCRIPTION,
  alternates: { canonical: SLUG },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    locale: "id_ID",
    siteName: "CareCash 家用金",
    publishedTime: PUBLISHED,
    images: [{ url: "/icon-1024.png" }],
  },
};

const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} className="mt-12 scroll-mt-6 text-2xl font-extrabold">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => <p className="mt-4 text-lg leading-8">{children}</p>;

const FAQ = [
  {
    q: "Boleh tidak kekurangan uang belanja dipotong dari gaji saya?",
    a: "Gaji dan uang belanja adalah dua hal yang berbeda. Gaji dibayar sesuai kontrak kerja, dan uang belanja dicatat terpisah. Kalau ada selisih, bicarakan dan cek catatannya bersama majikan, jangan dicampur dengan gaji. Kalau gaji kamu dipotong dan kamu tidak setuju, kamu bisa bertanya ke agensi atau menelepon 1955.",
  },
  {
    q: "Struknya hilang. Bagaimana?",
    a: "Langsung beri tahu majikan, jangan menunggu ditanya. Tulis apa yang dibeli, di toko mana, tanggal, dan harganya. Kalau barangnya masih ada, kamu bisa memotretnya. Lain kali, foto struk langsung di kasir atau begitu sampai di rumah.",
  },
  {
    q: "Saya sudah membayar pakai uang sendiri. Kapan uang saya diganti?",
    a: "Catat hari itu juga dan beri tahu majikan. Sebaiknya uang pribadimu diganti saat cek mingguan, supaya tidak menumpuk. Lebih baik lagi, minta majikan menambah uang belanja sebelum habis, supaya kamu tidak perlu memakai uang sendiri.",
  },
  {
    q: "Majikan tidak memberi daftar belanja. Apa yang harus saya lakukan?",
    a: "Tanyakan dengan sopan, misalnya: “Bu/Pak, boleh saya tahu barang apa saja yang boleh saya beli dengan uang ini?” Kamu juga bisa menulis daftar sendiri, lalu minta majikan mengeceknya. Daftar yang jelas melindungi kamu dan majikan.",
  },
];

const SIGNUP = "/sign-in?mode=signup&lang=id&ref=id-guide";

export default function UangBelanjaGuide() {
  const c = LANDING.id;
  const url = `${SITE_URL}${SLUG}`;
  return (
    <div className="min-h-dvh bg-bg">
      <SiteHeader copy={c} />
      <main lang="id" className="mx-auto max-w-2xl px-4 pb-12 pt-4">
        <nav className="text-sm text-muted">
          <Link href="/id" className="underline-offset-4 hover:underline">CareCash untuk perawat</Link>
        </nav>
        <article>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">{TITLE}</h1>
          <p className="mt-3 text-sm text-muted">Diterbitkan {PUBLISHED}・sekitar 6 menit membaca</p>

          <P>
            Banyak majikan di Taiwan memberi <strong>uang belanja</strong> kepada perawat atau asisten rumah tangga: untuk membeli sayur, lauk, popok dan kebutuhan kakek atau nenek, sabun, dan barang rumah tangga lainnya. Uangnya mungkin tidak besar, tapi kalau tidak dicatat dengan rapi, bisa muncul pertanyaan yang tidak enak: “Uangnya ke mana?” atau “Kok cepat habis?”
          </P>
          <P>
            Kabar baiknya, salah paham seperti ini hampir selalu bisa dicegah. Kuncinya sederhana: <strong>setiap uang yang masuk dan setiap uang yang keluar ada buktinya.</strong> Catatan yang rapi bukan tanda kamu dicurigai. Justru catatan itulah yang melindungi kamu.
          </P>

          <H2 id="gaji">1. Uang belanja bukan gaji</H2>
          <P>
            Ini yang paling penting. <strong>Gaji</strong> adalah upah kerjamu, dibayar sesuai kontrak. <strong>Uang belanja</strong> adalah uang milik keluarga majikan yang kamu pegang untuk keperluan rumah. Dua-duanya jangan pernah dicampur.
          </P>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-lg leading-8">
            <li>Simpan uang belanja di dompet atau amplop sendiri, terpisah dari uang pribadimu.</li>
            <li>Jangan memakai uang belanja untuk keperluan pribadi, meskipun “nanti diganti”.</li>
            <li>Kalau ada selisih di uang belanja, itu dibicarakan dan dicek bersama, <strong>bukan dipotong dari gaji</strong>. Kalau majikan ingin memotong gaji karena selisih uang belanja dan kamu tidak setuju, tanyakan ke agensi atau ke 1955.</li>
          </ul>

          <H2 id="daftar">2. Minta daftar barang yang boleh dibeli</H2>
          <P>
            Sebelum mulai, tanyakan dengan jelas: barang apa saja yang boleh dibeli dengan uang belanja? Misalnya sayur, buah, daging, beras, popok, tisu basah, sabun, atau obat yang dijual bebas. Tanyakan juga apakah makananmu sendiri termasuk, atau majikan memberi uang makan terpisah.
          </P>
          <P>
            Kalau perlu, tulis daftarnya dan minta majikan membacanya. Untuk barang yang mahal atau di luar daftar, <strong>tanya dulu sebelum membeli</strong>, misalnya lewat LINE. Pesan itu juga menjadi bukti bahwa majikan sudah setuju.
          </P>

          <H2 id="terima">3. Hitung uang di depan majikan</H2>
          <P>
            Saat majikan memberi uang, <strong>hitung uangnya di depan majikan</strong>, lalu sebutkan jumlahnya: “Bu, saya terima 3.000 ya.” Ini bukan tidak sopan; ini cara yang baik supaya kedua pihak tahu jumlah yang sama.
          </P>
          <P>
            Konfirmasi bahwa kamu sudah menerima uang <strong>hanya kalau uangnya benar-benar sudah ada di tanganmu</strong>. Jangan mengonfirmasi uang yang “nanti akan diberi” atau yang ditaruh di laci tapi belum kamu hitung.
          </P>

          <H2 id="struk">4. Simpan dan foto setiap struk</H2>
          <P>
            Setiap kali belanja, minta struk, sekecil apa pun belanjanya. Foto struknya di hari yang sama, karena struk kertas mudah luntur atau hilang. Kalau belanja di pasar tradisional yang tidak memberi struk, catat langsung: nama barang, harga, dan tanggal.
          </P>
          <P>
            Beberapa keluarga memberi <strong>barcode faktur elektronik</strong> (載具) milik keluarga untuk ditunjukkan di kasir. Kalau majikan memberikannya, pakailah setiap kali belanja. Dengan barcode itu, majikan bisa melihat belanjanya sendiri di aplikasi faktur. Tetap minta struk atau rincian belanja kalau bisa, lalu foto juga.
          </P>

          <H2 id="habis">5. Kalau uang belanja mau habis</H2>
          <P>
            Jangan menunggu sampai uangnya benar-benar nol. <strong>Beri tahu majikan lebih dulu</strong>, misalnya: “Bu, uang belanja tinggal 300. Besok perlu beli popok.” Sebaiknya kamu tidak perlu memakai uang sendiri.
          </P>
          <P>
            Kalau terpaksa membayar dengan uangmu sendiri, misalnya untuk kebutuhan kakek atau nenek yang mendesak, <strong>catat hari itu juga</strong>: apa yang dibeli, berapa, dan foto struknya. Lalu beri tahu majikan bahwa kamu memakai uang pribadi dan berapa jumlahnya. Catatan yang ditunda beberapa hari mudah terlupa, dan uangmu bisa tidak kembali.
          </P>

          <H2 id="mingguan">6. Cek bersama setiap minggu</H2>
          <P>
            Pilih satu hari tetap, misalnya setiap Minggu malam, untuk mengecek uang belanja bersama majikan. Rumusnya:
          </P>
          <div className="card mt-6">
            <p className="text-lg font-bold">Sisa minggu lalu + uang diterima − belanja = sisa sekarang</p>
            <p className="mt-3 text-[17px] leading-7 text-muted">
              Contoh (hanya ilustrasi): sisa minggu lalu 400, minggu ini menerima 2.000, belanja 2.150. Jadi 400 + 2.000 − 2.150 = 250. Uang di dompet belanja seharusnya 250. Kalau hasilnya minus, berarti ada uang pribadimu yang terpakai dan perlu diganti.
            </p>
          </div>
          <P>
            Hitung uang yang tersisa bersama-sama, lalu cocokkan dengan catatan. Kalau ada selisih kecil, cari bersama: mungkin ada struk yang belum dicatat. Cek mingguan membuat masalah kecil cepat ketahuan, sebelum menjadi besar.
          </P>

          <H2 id="masalah">7. Kalau terjadi salah paham</H2>
          <P>
            Kadang tetap ada perbedaan pendapat. Kalau itu terjadi:
          </P>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-lg leading-8">
            <li><strong>Tetap tenang.</strong> Bicara pelan dan sopan, meskipun kamu merasa disalahkan.</li>
            <li><strong>Tunjukkan catatanmu:</strong> foto struk, daftar belanja, dan pesan LINE dari majikan.</li>
            <li>Cek lagi bersama, satu per satu. Sering kali ternyata hanya ada struk yang terlewat.</li>
            <li>Kalau masalahnya lebih besar dari uang belanja, misalnya soal gaji, jam kerja, atau perlakuan yang tidak baik, kamu bisa menghubungi agensi atau menelepon <strong>1955</strong>. 1955 adalah layanan pengaduan gratis dari Kementerian Tenaga Kerja Taiwan, buka 24 jam, dan tersedia dalam Bahasa Indonesia.</li>
          </ul>

          <H2 id="carecash">Mencatat lebih mudah dengan HP</H2>
          <P>
            Semua langkah di atas bisa dilakukan dengan buku catatan dan kamera HP. Kalau ingin lebih mudah, kamu bisa memakai <strong>CareCash</strong>, alat gratis dalam Bahasa Indonesia. Saat majikan memberi uang, kamu tekan “Sudah saya terima”. Setiap belanja dicatat dengan foto struknya, dan sisanya dihitung otomatis. Majikan membaca catatan yang sama dalam bahasa Mandarin, jadi tidak ada salah paham karena bahasa.
          </P>

          <H2 id="faq">Pertanyaan yang sering muncul</H2>
          <div className="mt-4 space-y-3">
            {FAQ.map((f) => (
              <div key={f.q} className="card">
                <p className="text-lg font-bold">{f.q}</p>
                <p className="mt-2 text-[17px] leading-7 text-muted">{f.a}</p>
              </div>
            ))}
          </div>

          <div className="card mt-12 p-6 text-center">
            <p className="text-2xl font-extrabold">Uang jelas, hati tenang</p>
            <p className="mt-3 text-lg text-muted">
              Gratis, dalam Bahasa Indonesia, langsung di browser HP. Biasanya majikan mengirim link undangan; buka link itu supaya langsung masuk ke keluarga.
            </p>
            <div className="mx-auto mt-5 max-w-xs">
              <Link href={SIGNUP} className="btn-primary">Buka CareCash</Link>
            </div>
          </div>

          <p className="mt-10 text-sm text-muted">
            Artikel ini berisi saran umum sehari-hari dan bukan nasihat hukum. Untuk gaji dan hak kerja, ikuti kontrak kerja kamu, aturan Kementerian Tenaga Kerja Taiwan, dan penjelasan dari agensi, atau tanyakan ke 1955.
          </p>
        </article>
      </main>
      <SiteFooter copy={c} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Article",
              headline: TITLE,
              description: DESCRIPTION,
              datePublished: PUBLISHED,
              dateModified: PUBLISHED,
              inLanguage: "id",
              mainEntityOfPage: url,
              publisher: { "@type": "Organization", name: "CareCash 家用金", logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` } },
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              inLanguage: "id",
              mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            },
          ]),
        }}
      />
    </div>
  );
}
