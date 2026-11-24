export const metadata = { title: "Privacy · CareCash" };

/** Plain privacy policy, linked from the Google and LINE sign-in consent screens. */
export default function Privacy() {
  return (
    <main className="mx-auto max-w-2xl space-y-5 px-5 py-10 text-lg leading-relaxed">
      <h1 className="text-3xl font-extrabold">CareCash Privacy Policy 隱私權政策</h1>
      <p className="text-muted">Last updated 24 November 2026</p>

      <h2 className="text-xl font-bold">What we store</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>Your name, and the email or phone number you sign in with. From Google, Apple or LINE we only receive your name, email and profile picture.</li>
        <li>What you enter: families, members, cash given and received, expenses, receipt photos, and salary or healthcare records.</li>
        <li>A sign-in cookie, plus your language and color choices.</li>
      </ul>

      <h2 className="text-xl font-bold">Who can see it</h2>
      <p>
        Only members of your own family in CareCash. Caretakers see their own cash and expenses. Salary, healthcare and other
        records are visible to employers only, unless an employer shares a record with the caretaker. We do not sell or share
        your data, and we show no ads.
      </p>

      <h2 className="text-xl font-bold">Where it is kept</h2>
      <p>On a server run by Fly.io in Tokyo, Japan. Demo (guest) data is deleted automatically after 3 days.</p>

      <h2 className="text-xl font-bold">Deleting your data</h2>
      <p>Ask the family employer to remove you, or contact us to delete your account and everything in it.</p>

      <hr className="border-line" />
      <p>
        我們只儲存你登入用的名字、電子郵件或電話，以及你輸入的家庭、家用金、花費、收據照片和薪資醫療紀錄。資料只有同一個家庭的成員看得到；薪資與醫療紀錄預設只有雇主看得到。我們不販售、不分享資料，也沒有廣告。資料存放在 Fly.io 日本東京的伺服器。試用資料 3 天後自動刪除。如需刪除帳號，請聯絡我們。
      </p>
    </main>
  );
}
