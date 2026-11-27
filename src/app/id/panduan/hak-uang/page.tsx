import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { SiteFooter, SiteHeader } from "../../../landing";
import { LANDING } from "../../../landing-copy";

/**
 * /id/panduan/hak-uang: Indonesian guide for caregivers on their rights around money
 * (salary versus household cash, no deductions for shortfalls, receipts, money paid out of pocket, 1955).
 * TODO(native review): written in Bahasa Indonesia only; have a native speaker review tone and wording before promoting it.
 */
const SLUG = "/id/panduan/hak-uang";
const TITLE = "Hak kamu soal uang: gaji, uang belanja, dan uang talangan";
const DESCRIPTION =
  "Untuk perawat dan asisten rumah tangga di Taiwan: gaji terpisah dari uang belanja, selisih uang belanja tidak boleh dipotong dari gaji, struk melindungi kamu, uang talangan minta diganti hari itu juga, dan 1955 gratis dalam Bahasa Indonesia.";
const PUBLISHED = "2026-11-27";

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

const THREE = [
  ["Gaji", "Upah kerjamu. Milikmu sendiri, dibayar sesuai kontrak kerja. Kamu bebas memakainya atau mengirimnya ke keluarga."],
  ["Uang belanja", "Uang milik keluarga majikan yang kamu pegang untuk keperluan rumah: sayur, lauk, popok, sabun, dan kebutuhan kakek atau nenek."],
  ["Uang talangan", "Uang pribadimu yang terpakai untuk keperluan rumah, misalnya karena uang belanja habis. Ini uangmu, dan harus diganti."],
];

const FAQ = [
  {
    q: "Majikan bilang uang belanja kurang dan mau memotong gaji saya. Boleh?",
    a: "Gaji dibayar sesuai kontrak kerja dan aturan Kementerian Tenaga Kerja Taiwan. Selisih uang belanja bukan alasan untuk memotong gaji. Ajak majikan mengecek catatan dan struk bersama dengan tenang. Kalau gaji tetap dipotong dan kamu tidak setuju, tanyakan ke agensi atau telepon 1955.",
  },
  {
    q: "Saya sudah memakai uang sendiri untuk belanja. Bagaimana memintanya kembali dengan sopan?",
    a: "Sampaikan hari itu juga, dengan foto struk: “Bu/Pak, tadi uang belanja habis, saya pakai uang saya 250 untuk beli popok. Ini struknya.” Ini bukan tidak sopan. Majikan yang baik juga ingin tahu supaya bisa mengganti.",
  },
  {
    q: "Saya takut bertanya soal uang, nanti dianggap tidak percaya.",
    a: "Bertanya dengan sopan itu wajar. Catatan yang jelas justru membuat majikan lebih percaya kepadamu. Kalau sulit menjelaskan dalam bahasa Mandarin, tunjukkan catatan dan fotonya saja.",
  },
  {
    q: "Apakah 1955 benar-benar gratis? Apakah majikan akan tahu saya menelepon?",
    a: "1955 adalah layanan konsultasi dan pengaduan dari Kementerian Tenaga Kerja Taiwan. Teleponnya gratis, buka 24 jam, dan ada petugas yang berbicara Bahasa Indonesia. Kalau kamu khawatir soal kerahasiaan, tanyakan langsung kepada petugasnya saat menelepon.",
  },
  {
    q: "Saya akan pulang ke Indonesia atau pindah majikan. Apa yang perlu saya cek?",
    a: "Cek bersama majikan sebelum hari terakhir: sisa uang belanja dihitung dan dikembalikan, semua uang talanganmu sudah diganti, dan gaji terakhir dibayar sesuai kontrak. Paspor dan ARC adalah milikmu dan seharusnya ada di tanganmu sendiri.",
  },
];

const SIGNUP = "/sign-in?mode=signup&lang=id&ref=id-hak";

export default function HakUangGuide() {
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
            Kamu datang ke Taiwan untuk bekerja dan membantu keluarga di rumah. Setiap bulan ada gaji, setiap minggu ada uang belanja, dan kadang kamu terpaksa memakai uang sendiri dulu. Kalau tiga jenis uang ini bercampur, mudah sekali muncul salah paham, dan sering kali kamulah yang rugi.
          </P>
          <P>
            Artikel ini menjelaskan dengan sederhana <strong>apa hak kamu soal uang</strong>, dan bagaimana catatan yang rapi bisa melindungi kamu. Kamu tidak perlu takut atau malu membicarakan uang. Bicara dengan jelas dan sopan adalah hal yang baik untuk kamu dan untuk majikan.
          </P>

          <H2 id="tiga">1. Tiga jenis uang, jangan dicampur</H2>
          <div className="mt-4 space-y-3">
            {THREE.map(([t, d]) => (
              <div key={t} className="card">
                <p className="text-lg font-bold">{t}</p>
                <p className="mt-2 text-[17px] leading-7 text-muted">{d}</p>
              </div>
            ))}
          </div>
          <P>
            Simpan uang belanja di dompet atau amplop sendiri, terpisah dari uang pribadimu. Dengan begitu, kamu selalu tahu mana uang keluarga dan mana uangmu. Cara mencatat uang belanja sehari-hari ada di{" "}
            <Link href="/id/panduan/uang-belanja" className="font-bold text-accent-ink underline underline-offset-4">Uang belanja dari majikan: cara mencatat supaya tidak ada salah paham</Link>.
          </P>

          <H2 id="gaji">2. Gaji kamu dibayar sesuai kontrak</H2>
          <P>
            Jumlah gaji, tanggal gajian, dan potongan apa saja yang boleh, semuanya <strong>tertulis di kontrak kerja</strong> dan diatur oleh Kementerian Tenaga Kerja Taiwan. Simpan salinan kontrakmu, dan kalau ada yang tidak kamu mengerti, tanyakan ke agensi.
          </P>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-lg leading-8">
            <li>Setiap kali menerima gaji, catat tanggal, jumlah, dan potongannya. Foto slip gaji kalau ada.</li>
            <li>Kalau jumlahnya berbeda dari biasanya, tanyakan dengan sopan saat itu juga, jangan menunggu berbulan-bulan.</li>
            <li>Hari libur sesuai kontrak adalah hakmu untuk istirahat. Kalau kamu bekerja di hari libur, cara menghitung upahnya mengikuti kontrak dan aturan; tanyakan ke agensi atau 1955 kalau ragu.</li>
          </ul>

          <H2 id="potong">3. Selisih uang belanja bukan alasan memotong gaji</H2>
          <P>
            Kadang uang belanja tidak cocok dengan catatan, misalnya kurang 100 atau 200. Ini bisa terjadi pada siapa saja: struk terselip, ada belanja yang lupa dicatat, atau keluarga mengambil uang tanpa memberi tahu. Yang penting: <strong>selisih uang belanja dicek bersama, bukan dipotong dari gaji.</strong>
          </P>
          <P>
            Kalau majikan ingin memotong gaji karena selisih uang belanja, jangan bertengkar. Katakan dengan tenang bahwa kamu ingin mengecek catatannya bersama. Kalau tetap tidak ada jalan keluar, kamu boleh bertanya ke agensi atau menelepon 1955.
          </P>

          <H2 id="struk">4. Struk adalah pelindungmu</H2>
          <P>
            Struk bukan tanda kamu dicurigai. Struk adalah <strong>bukti bahwa kamu jujur</strong>. Setiap kali belanja, minta struk dan foto di hari yang sama. Kalau belanja di pasar yang tidak memberi struk, catat langsung: nama barang, harga, tanggal.
          </P>
          <P>
            Saat menerima uang belanja, hitung uangnya di depan majikan dan sebutkan jumlahnya. Simpan juga pesan LINE dari majikan, misalnya saat majikan setuju kamu membeli barang yang mahal. Kalau suatu hari ada pertanyaan, kamu tinggal menunjukkan catatanmu.
          </P>

          <H2 id="talangan">5. Uang talangan: minta diganti hari itu juga</H2>
          <P>
            Sebaiknya kamu <strong>tidak perlu memakai uang sendiri</strong> untuk keperluan rumah. Gajimu untuk kamu dan keluargamu. Kalau uang belanja mau habis, beri tahu majikan lebih dulu: “Bu, uang belanja tinggal 300.”
          </P>
          <P>Kalau terpaksa memakai uang sendiri, misalnya untuk obat atau popok yang mendesak:</P>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-lg leading-8">
            <li>Foto struknya dan catat hari itu juga.</li>
            <li>Beri tahu majikan <strong>hari itu juga</strong> berapa uangmu yang terpakai, dan minta diganti.</li>
            <li>Jangan biarkan uang talangan menumpuk sampai minggu depan atau bulan depan. Semakin lama, semakin mudah terlupa.</li>
            <li>Uang talangan tidak boleh “dihapus” untuk menutup selisih uang belanja. Itu dua hal yang berbeda.</li>
          </ul>

          <H2 id="bantuan">6. Kalau butuh bantuan: agensi dan 1955</H2>
          <P>
            Kalau ada masalah soal gaji, potongan, hari libur, atau perlakuan yang tidak baik, kamu tidak sendirian. Kamu bisa bertanya ke agensi, atau menelepon <strong>1955</strong>. 1955 adalah layanan konsultasi dan pengaduan dari Kementerian Tenaga Kerja Taiwan: <strong>gratis, buka 24 jam, dan tersedia dalam Bahasa Indonesia</strong>.
          </P>
          <P>
            Sebelum menelepon, siapkan catatanmu: tanggal gajian, jumlah yang diterima, foto struk, dan pesan dari majikan. Catatan yang rapi membuat masalahmu lebih mudah dipahami dan dibantu.
          </P>

          <H2 id="carecash">Mencatat lebih mudah dengan HP</H2>
          <P>
            Kamu bisa mencatat dengan buku dan kamera HP. Kalau ingin lebih mudah, ada <strong>CareCash</strong>, alat gratis dalam Bahasa Indonesia. Setiap uang yang kamu terima dikonfirmasi kedua pihak, setiap belanja dicatat dengan foto struk, dan sisanya dihitung otomatis. Kalau kamu memakai uang sendiri, sisa uang belanja akan terlihat minus, jadi majikan langsung tahu berapa yang perlu diganti. Majikan membaca catatan yang sama dalam bahasa Mandarin.
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
            <p className="text-2xl font-extrabold">Catatan yang jelas melindungi kamu</p>
            <p className="mt-3 text-lg text-muted">
              Gratis, dalam Bahasa Indonesia, langsung di browser HP. Biasanya majikan mengirim link undangan; buka link itu supaya langsung masuk ke keluarga.
            </p>
            <div className="mx-auto mt-5 max-w-xs">
              <Link href={SIGNUP} className="btn-primary">Buka CareCash</Link>
            </div>
          </div>

          <p className="mt-10 text-sm text-muted">
            Artikel ini berisi saran umum sehari-hari dan bukan nasihat hukum. Untuk gaji, potongan, hari libur, dan hak kerja, ikuti kontrak kerja kamu, aturan Kementerian Tenaga Kerja Taiwan, dan penjelasan dari agensi, atau tanyakan ke 1955.
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
