# Weekly growth log

Newest week on top. Numbers from `/stats` / `node scripts/metrics.mjs`.

## Founder asks (open), smallest first
Live checklist: the plan doc (https://claude.ai/artifact/3ekZHXvrrgPPgo8U13WwTy). Give the founder that link whenever it changes.
1. Leona: ask your dad the 3 questions, get his LINE intro, then send the message in `outreach/leona.md`.
2. One time: `flyctl tokens create deploy -a carecash` → GitHub repo secret `FLY_API_TOKEN` (then every merge to main deploys).
3. carecash.me: `flyctl certs add carecash.me -a carecash`, add the printed records in Vercel DNS, then `flyctl secrets set SITE_URL=https://carecash.me -a carecash`.
4. Fly secrets: `METRICS_TOKEN` (32+ chars), `CONTACT_EMAIL` and/or `CONTACT_LINE_URL`; then store METRICS_TOKEN as a credential for the weekly review.
5. Send the network message (`content/week1-posts.md` §1) to 10 people.
6. LINE Login keys (both callback URLs); LINE OA + FB Page + Threads (`content/accounts-kit.md`).
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
