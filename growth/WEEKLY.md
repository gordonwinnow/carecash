# Weekly growth log

Newest week on top. Numbers from `/stats` / `node scripts/metrics.mjs`.

## Overnight Nov 27 (cloud session)
Shipped (all live; visual report https://claude.ai/artifact/KSZtyV1Gnnj4vuSbpX759q):
- Bug fix: signed-in visitors see carecash.me and the guide again (開啟 App button); only the iPhone app redirects into the app.
- Persona review + 7 fixes (`growth/review/persona-findings.md`, 20-item backlog).
- Labs (off by default, Settings → Labs): employer checklist and bilingual payslip; research in `growth/research/employer-obligations.md`.
- 8 articles (guide now 13) + `/id/panduan/hak-uang`; post sets 6–12; posting queue (29 items).
Next for the scheduled sessions: persona backlog items (per-sibling totals, received-button clarity, saved toast); check /stats for ?ref=threads / ?ref=ig traffic.

## Laptop agent notes (Nov 27)
**Done (tasks 1–3, Claude in Chrome):**
- @carecash.me: name `CareCash 家用金` and profile photo set; switched to a **Business** account (category "Software": the web has no "App page"; hidden on profile; no contact info).
- Threads scheduled (dates shifted because the plan's "Thu 27" is really a Friday, and Fri 12:30 had passed): Day 1 **Fri 27 21:30**, Day 2 **Sat 28 12:30**, Day 3 **Sun 29 21:00**.
- Founder feedback → `content/social/2026-11-threads-voice/PLAN.md`: personal founder voice, pinned explainer, open-question posts, and reply drafts for 4 live threads.

**Couldn't do, and why:**
- **IG bio** didn't save ("There was a problem saving your profile", twice); **IG link** can only be edited in the phone app. Founder: add both on the phone.
- ~~IG carousel not scheduled~~ → founder said post it sooner: **shared on Instagram Fri 27 about 21:20** (web can't schedule). Its caption points to the bio link, which still needs adding on the phone.

**Later on Nov 27:**
- Threads: personal intro posted, app explainer posted and **pinned**; profile done (photo, name, bio, link to the guide with `?ref=threads-bio`).
- 4 replies posted (generic wording, no invented details): @clairechou0708 (meal budget), @deer_545858 (does her own food come from 菜錢), @withclairelin (asked how they handle grocery money), @paopaocherry (put 家用金 in the house rules).
- IG bio failed a third time on the web: phone only.
- Personal intro post and replies need the founder's real details ([ ] in PLAN.md) before posting.

## Founder asks (open), smallest first
Live checklist: the plan doc (https://claude.ai/artifact/3ekZHXvrrgPPgo8U13WwTy). Give the founder that link whenever it changes.
1. Leona: ask your dad the 3 questions, get his LINE intro, then send the message in `outreach/leona.md`.
2. One time: `flyctl tokens create deploy -a carecash` → GitHub repo secret `FLY_API_TOKEN` (then every merge to main deploys).
3. carecash.me: `flyctl certs add carecash.me -a carecash`, add the printed records in Vercel DNS, then `flyctl secrets set SITE_URL=https://carecash.me -a carecash`.
4. Fly secrets: `METRICS_TOKEN` (32+ chars), `CONTACT_EMAIL` and/or `CONTACT_LINE_URL`; then store METRICS_TOKEN as a credential for the weekly review.
5. Send the network message (`content/week1-posts.md` §1) to 10 people.
6. Instagram + Threads (`content/accounts-kit.md` §4). On hold by founder's choice: LINE Login, LINE OA, Facebook Page.
Done: merged to main (Nov 26, gordonwinnow/carecash#1); domain chosen: carecash.me.

## Week of 2026-11-25 (week 1)
**Scoreboard:** signups — / 1000 · weekly active — / 100 (baseline unknown until metrics are deployed)

**Done:**
- Public zh-TW landing page at `/` (logged-out visitors used to be sent straight to sign-in), with SEO title/description, OG tags, FAQ rich results, robots + sitemap.
- `/partners` page for 仲介 (contact buttons appear once `CONTACT_EMAIL` / `CONTACT_LINE_URL` are set).
- First-touch attribution: `?ref=` / `utm_source` → cookie → `family.source`.
- Growth metrics at `/stats` (owners), `/api/metrics` and `scripts/metrics.mjs`.
- Plan (`PLAN.md`), broker playbook (`outreach/broker-pitch.md`), week-1 content (`content/`), research (`RESEARCH.md`).

**Next week (Claude):**
- Prep a one-page brief on the founder's broker contact once shared.
- Draft the first SEO article: 「第一次請外籍看護：家用金怎麼給、怎麼記帳」.
- Draft the zh-TW + Indonesian flyer as a printable page with QR.
