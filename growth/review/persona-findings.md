# Persona walkthroughs: findings and backlog

Date: 2026-11-27. Method: local production build (`next build` + `next start`), Playwright Chromium at 390×844 (iPhone-size), real sign-up, invite, join, give-cash, receive, add-expense-with-photo flows. Email + password was the only sign-in method enabled locally (no Google/LINE/WhatsApp keys), so sign-up friction below is the email path. Screenshots are in `growth/review/personas/` (`a*` employer, `b*` caregiver, `c*` sibling, `d*` broker, `e*` guide reader). Screens changed in this round have `-before.png` / `-after.png` pairs.

Severity: **High** = likely to lose the user or cause a dispute; **Med** = confusion or extra steps; **Low** = polish.

---

## (a) Employer daughter, 45, zh-TW, from a Threads link

**Journey:** `/?utm_source=threads` landing (a1, a2) → 免費開始使用 → email sign-up form (a3) → 建立家庭 (a4) → home (a5) → 邀請看護 in Settings (a6) → after the caregiver joins, 加家用金 $3,000 (a7, a8).

**What works:** The hero speaks her language ("看護、幫傭的家用金 每一筆都清楚"), the pain-point cards ("兄弟姊妹各說各話") land, and the CTA is above the fold. Sign-up to home takes under a minute. The invite panel gives WhatsApp, LINE and copy in one place.

**Issues**
| # | Issue | Sev |
|---|---|---|
| a-1 | After 加家用金, home showed **剩餘 $0** and 「目前沒有資料」. Nothing on home said the $3,000 was waiting for the caregiver; it only appeared in 紀錄. She would think it failed and tap again (double cash). The README promises "the employer sees waiting". **Fixed** (a8 before/after). | High |
| a-2 | A brand-new family's home led with 「家裡的家用金 $0 / 加家用金」 *above* 「還沒有看護 / 邀請看護」. The first job is to invite the caregiver, but the big green button was "add money to my own pot". **Fixed**: invite card first (a5 before/after). | Med |
| a-3 | The invite message (`inviteMessage`) is written in the **employer's** language. A zh-TW employer sends Chinese text to an Indonesian caregiver on WhatsApp, and the caregiver cannot tell what it is or that it is safe. | High |
| a-4 | Sign-up is email + password. For a 45-year-old on her phone from Threads, LINE login is the expected path in Taiwan; a password is a drop-off point. (Prod may have LINE on; worth checking the funnel.) | Med |
| a-5 | The language picker in the landing header is truncated on a 390px phone (「繁體中ː」). | Low |
| a-6 | Nothing explains what "家裡的家用金" (the family pot) is versus the caregiver's balance. | Low |
| a-7 | No guidance on *how much* to give the first time; the guide articles answer exactly that but the app never links them. | Low |

**What she would want:** "Did she get the money?" visible on the home screen; a ready-made bilingual message to send the caregiver; a suggested weekly amount; LINE sign-in.

---

## (b) Indonesian caregiver (id-ID) from an invite link, first expense with a receipt photo

**Journey:** invite link → sign-in page with 「林家 mengundang kamu ke CareCash」 and the email sign-up form (b1) → 「Gabung 林家 / Kamu gabung sebagai: Pekerja」 (b2) → home (b3) → pending card 「林美玲 memberi kamu … $3,000 / Sudah saya terima」 (b4) → receive (b5) → Catat belanja form (b6), amount, receipt photo, save (b7) → home with sisa $2,550 (b8) → Riwayat (b9).

**What works:** Everything is in Bahasa Indonesia automatically from the browser locale. The invite banner makes it clear who invited her. The expense form is short: amount first with the number pad, big category icons, photo preview with "Foto lagi". Balance math after receive + expense is right.

**Issues**
| # | Issue | Sev |
|---|---|---|
| b-1 | First home was a bare `$0` and 「Belum ada data」. Nothing told her what to do, that she should keep receipts, or that she must tap "Sudah saya terima" when given money. **Fixed**: a 3-step welcome card in her language with a "Catat belanja pertama" button, shown until her first expense (b3 before/after). | High |
| b-2 | She must create an **email + password** account. Many caregivers use WhatsApp and rarely use email; a forgotten password means a locked-out caregiver and a call to the employer. WhatsApp OTP exists but is off until Meta keys are set. | High |
| b-3 | Two very similar buttons: the pending card's **"Sudah saya terima"** (confirm money the employer recorded) and the side button **"Terima uang"** (record money handed to me). Easy to tap the wrong one and double-count. | Med |
| b-4 | The pending card title truncates the date: 「林美玲 memberi kamu · har…」. | Low |
| b-5 | After saving an expense there is no confirmation ("Tersimpan ✓"); she lands back on home and has to spot the new row. | Low |
| b-6 | Category is pre-selected (Makanan). Fast, but she may save groceries for the household under "food" without choosing; fine, but worth a look at category accuracy in data. | Low |
| b-7 | Role label "Pekerja" (worker) is neutral but cold; nothing tells her the employer sees each receipt (transparency that protects *her*). | Low |

**What she would want:** sign in with WhatsApp; a clear "how this works" on day one; reassurance that receipts protect her; a visible success after saving; one obvious button for "money received".

---

## (c) Sibling invited as second employer, wants to see spending and chip in

**Journey:** admin invite link → sign-up (c1) → join as 雇主 (c2) → home (c3) → 紀錄 (c4) → 加家用金 $2,000 (c5) → home (c6) → 薪資醫療 tab (c7).

**What works:** He sees the caregiver's balance and recent expenses immediately, and can add money in two taps.

**Issues**
| # | Issue | Sev |
|---|---|---|
| c-1 | 紀錄 showed cash as 「家用金 · Siti · 今天」: **who gave it was not shown**. For siblings splitting costs, "who put in how much" is the whole point ("我上次明明有給"). **Fixed**: cash rows now read 「林美玲 → Siti · 今天」 (c4 before/after). | High |
| c-2 | After he gave $2,000, home showed no sign of it (same as a-1). **Fixed** with the waiting line (c6 before/after). | High |
| c-3 | No one-tap way to tell the family group chat "this month we gave X, spent Y, Z left". **Fixed (small)**: a 本月 card on employer home (已給 / 已花 / 目前剩餘) with 「分享本月摘要給家人」 using the phone's share sheet, else copy (c6 after). | Med |
| c-4 | No per-sibling totals ("姊姊 $6,000, 我 $2,000 this month") and no settle-up. This is what siblings argue about. | Med |
| c-5 | He joins with role 雇主 even though he was invited as 「家人」. The words differ between invite and role badge. | Low |
| c-6 | Expense notifications are off by default; a sibling who wants to "see spending" never hears about it unless he finds Settings. | Med |
| c-7 | The 薪資醫療 (pay & health) tab is visible to every employer, including siblings who may not need salary details. (Not changed: another engineer owns this tab.) | Low |

**What he would want:** see his own contributions, a monthly total he can forward, a weekly digest push, and a fair-split view.

---

## (d) Broker visiting /partners

**Journey:** `/partners` (d1 fold, d2 full page).

**What works:** Clear zh-TW pitch, the right pains (dispute calls), six benefit cards, a 4-step "how we work together".

**Issues**
| # | Issue | Sev |
|---|---|---|
| d-1 | The only CTAs were at the very bottom, after ten cards (about five phone screens). A busy broker on mobile never reaches them. **Fixed**: hero CTAs 「預約 15 分鐘介紹」 (jumps to contact) and 「1 分鐘看雇主＋看護畫面」 (demo), plus a one-line reassurance (d1 before/after). | High |
| d-2 | The email button opened a blank email. **Fixed**: prefilled body asking for company, contact/LINE, number of employer clients, preferred time. | Med |
| d-3 | LINE contact only appears when `CONTACT_LINE_URL` is set. Taiwanese brokers live on LINE; without it, the page relies on a googlegroups email. | High |
| d-4 | No product screenshots on the page; the broker has to imagine what clients and caregivers see. | Med |
| d-5 | The "說明單張" (flyers in zh/id/vi) are promised but not downloadable; a self-serve PDF would let a broker start without a meeting. | Med |
| d-6 | No social proof (number of families, a quote), which brokers weigh heavily. | Low |

**What they would want:** a LINE button, a sample flyer, screenshots, their own ref link/QR without waiting for a call.

---

## (e) Casual visitor reading a /guide article

**Journey:** `/guide/caregiver-food-and-household-cash-per-month` (e1, e2) → `/guide` (e3).

**What works:** Strong, useful article: clear title, reading time, three-kinds-of-money cards, a worked example, FAQ, a soft CTA at the end.

**Issues**
| # | Issue | Sev |
|---|---|---|
| e-1 | At the end of an article there was nowhere to go except "sign up". Readers who are not ready to sign up left. **Fixed**: 「延伸閱讀」 cards for the other articles plus 「看全部家用金指南 →」 on both articles (e2 before/after). | Med |
| e-2 | The end CTA only offered sign-up. **Fixed**: a secondary 「先不註冊，試用範例家庭」 link to the guest demo. | Med |
| e-3 | The header's 指南 link is hidden on phones (`hidden sm:inline`), so mobile readers can't find more articles from the top. | Low |
| e-4 | No share button (LINE / Threads / copy). This content is made to be forwarded to siblings. | Med |
| e-5 | Only two articles; the index is thin. Content cadence is the real lever. | Med |
| e-6 | No mid-article CTA at the "三週記錄" section, the natural point to say "the app does this for you". | Low |

---

## Ranked backlog (impact × effort)

Impact 1–5, effort S/M/L. Score ≈ impact ÷ effort (S=1, M=2, L=3). ✅ = done in this round.

| Rank | Item | Persona | Impact | Effort | Status |
|---|---|---|---|---|---|
| 1 | Show "waiting for {caretaker} to confirm $X" on employer home after giving cash | a, c | 5 | S | ✅ |
| 2 | Caregiver first-run "how it works" card + first-expense button (zh/en/id/vi/tl) | b | 5 | S | ✅ |
| 3 | Show who gave each cash entry in 紀錄 (「林美玲 → Siti」) | c | 4 | S | ✅ |
| 4 | /partners hero CTAs + prefilled broker email | d | 4 | S | ✅ |
| 5 | New family: invite-caregiver card before the family-pot card | a | 3 | S | ✅ |
| 6 | Monthly family summary card + "share summary with family" button | c | 4 | S | ✅ |
| 7 | Guide "延伸閱讀" footer + demo link in article CTA | e | 3 | S | ✅ |
| 8 | Bilingual caregiver invite message: zh + the caregiver's language picked when inviting (id/vi/tl/th), so WhatsApp text is readable and trusted | a, b | 5 | S–M | next |
| 9 | Turn on WhatsApp OTP (Meta keys + template) and/or LINE login; caregivers without email/password | b, a | 5 | M (ops) | next |
| 10 | Set `CONTACT_LINE_URL`; add LINE button for brokers | d | 4 | S (ops) | next |
| 11 | Per-person contributions this month ("who gave how much") on History/summary, then a settle-up view for siblings | c | 4 | M | |
| 12 | Disambiguate caregiver buttons: rename side button to e.g. 「我拿到錢了（記一筆）」 / hide it while a pending card is shown | b | 3 | S | |
| 13 | Save confirmation toast after expense / cash ("已儲存 ✓") | b | 2 | S | |
| 14 | Weekly digest push for employers (spent, left, receipts count); default on for second employers | c | 4 | M | |
| 15 | Downloadable broker flyer PDF (zh employer / id + vi caregiver) + screenshots on /partners | d | 3 | M | |
| 16 | Share buttons (LINE/Threads/copy) on guide articles; show 指南 link in mobile header | e | 3 | S | |
| 17 | Suggest a first weekly amount when giving cash the first time, linking the 伙食費 article | a | 2 | S | |
| 18 | Fix truncated pending-card date and landing language picker on 390px | a, b | 1 | S | |
| 19 | Align invite wording 「家人」 vs badge 「雇主」 (e.g. badge 「家人（雇主）」) | c | 1 | S | |
| 20 | More guide articles (cadence) | e | 4 | L | |

## Changes made in this round

- `src/app/(app)/home/page.tsx`: caregiver `FirstSteps` card when she has no expenses; employer "waiting for {name} to confirm {amount}" line under each caregiver's balance (uses the existing `pending` from `balanceOf`); invite card first for a family with no caregiver; 本月 summary card (shown once money moved this month) with share.
- `src/app/(app)/home/share.tsx` (new): share-sheet / copy button for the summary text + link to 紀錄.
- `src/app/(app)/history/page.tsx`: cash rows show the giver (`member` join on `cash.given_by`).
- `src/app/partners/page.tsx`: hero CTAs, `#contact` anchor, prefilled email body.
- `src/app/guide/related.tsx` (new) + both articles: 延伸閱讀 footer and a demo link under the end CTA.
- `src/lib/i18n.ts`: new keys after `nothingYet` (en, zh-TW; caregiver keys also id, vi, tl). Other languages fall back to English.

No schema, auth, settings page or pay & health tab changes.
