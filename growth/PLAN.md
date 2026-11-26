# CareCash growth plan: Taiwan (v1, 2026-11-25)

Owner: founder. Growth/ops lead: Claude, working weekly from this folder.
Everything public-facing is in Traditional Chinese (zh-TW). Material for caregivers is in Bahasa Indonesia first (about 78% of caregivers), then Tiếng Việt.

## 1. Goal and a reality check

| | Today | Dec 31, 2026 (5 weeks) | Jun 30, 2027 |
|---|---|---|---|
| Signups (real accounts) | ~0 | **150** (stretch 300) | **1,000** |
| Weekly active users | ~0 | **30** (stretch 60) | **100+** |
| Activated households (caregiver joined + ≥1 expense) | ~0 | 40 | 350 |
| Broker partners sending families | 0 | 1 pilot | 5–10 |

- **Why not 1,000 by Dec 31:** we are starting at zero, with no custom domain, no social accounts and no LINE login. Five weeks, two of them Christmas and New Year, is not enough. A broker partnership takes 2–6 weeks just to get a yes.
- **What the original goal still is:** it becomes the 6-month target. I'd rather hit 150 and learn than miss 1,000 and learn nothing.
- **Counting:** one household is about 2.5 signups (employer, caregiver, often a sibling). So 1,000 signups ≈ 400 households, and 100 weekly active users ≈ 40–50 active households. **The unit that matters is the activated household.**
- **Where to see the numbers:** `/stats` (owner only) and `node scripts/metrics.mjs`.

## 2. Who we're for (the target audience)

**Primary buyer: the adult child (35–60) managing a parent's caregiver.**
- They often live apart from the parent, frequently share the cost with siblings, and are busy, LINE-native and on Facebook.
- Their pain:
  - "I hand over NT$3–6k a week and don't know where it goes."
  - "My siblings argue over who paid."
  - "Checking receipts feels like accusing her."

**Secondary user: the caregiver.** About 215k 家庭看護工 work in Taiwan, growing by roughly 1,000 a month, ~78% of them Indonesian.
- Their pain:
  - "I'm accused of overspending."
  - "I spent my own money and wasn't repaid."
- CareCash protects them too: every handover is confirmed by both sides. This is our moral and PR angle, and it's why NGOs and brokers can endorse us.

**Market:** about 200k employer households.
- The 免巴氏量表 rule for people aged 80+ (Aug 2025) is adding a wave of **first-time employers**. They are our best segment: no habits yet, and they actively search for 「外籍看護 家用金 怎麼給」.

**Brand (decided Nov 26):** CareCash 家用金 — named after the money, not the worker. **Tagline:** 看護、幫傭的家用金，每一筆都清楚. Keep 看護 in page titles and articles for search.

**Positioning (one line):** 看護、幫傭的家用金，每一筆都清楚 — 雙方確認、收據留存、母語操作、免費。

**No direct competitor found.**
- Care Logger and HaloCare 家護通 do care diaries and translation. Paper notebooks and Excel are the real substitutes.
- MaidExpense (Hong Kong) is the closest analogue.
- Watch: if HaloCare adds expenses, our moats are two-way confirmation plus the broker channel.

## 3. Channels, ranked by expected households per hour of founder time

1. **Brokers (仲介): the main bet.** One broker has hundreds of employer clients and meets each new family on placement day. See `outreach/broker-pitch.md`.
2. **Warm network: the first 20 households, starting now.**
   - Friends and family with caregivers. Ask each to invite one more family.
   - These 20 are also our user interviews.
3. **Facebook groups, PTT, Dcard, Threads: helpful posts, not ads.**
   - Places: PTT `elderly`, Dcard 長照 / 心情, Mobile01 (has allowed app posts), FB groups (find and list by hand; see §6), Threads.
   - Format: share a real story or template ("我們家怎麼給看護家用金") with the app as the tool. Drafts are in `content/`.
4. **SEO.** The landing page is live at `/`, with FAQ rich results.
   - Next: 3–5 articles answering searches like 「外籍看護 伙食費 一天多少」, 「看護 家用金 記帳」, 「看護 收據 對帳」, 「免巴氏量表 第一次請看護 準備什麼」.
5. **Caregiver-side virality.**
   - An Indonesian one-pager the broker hands over on day one.
   - Later: Indonesian TikTok/FB posts showing "this app protects you."
6. **Institutions (slower, but trusted):**
   - 家總 (家庭照顧者關懷總會), 愛長照 community and podcast, 長照 A 單位 case managers (now touching caregiver households under 長照3.0), and hospital 外籍看護 days.
   - Start in January.

Not now: paid ads (no conversion data yet), expos (the 2026 ones are past).

## 4. Five-week sprint (Nov 25 → Dec 31)

**Week 1 (Nov 25–Dec 1): foundations**
- [x] Public landing page `/` (zh-TW, SEO, FAQ), broker page `/partners`, `?ref=` attribution, `/stats` + `/api/metrics`. **Branch `claude/busy-lamport-a2yiza`; needs merge + deploy (founder).**
- [ ] Founder: deploy; set Fly secrets (§7).
- [ ] Founder: turn on **LINE Login**. Taiwanese employers expect it, and it's likely our biggest single conversion fix.
- [ ] Founder: create the CareCash **LINE Official Account** + FB Page + Threads/IG handle `carecash.tw` (or similar).
- [ ] Founder: message 10 people in your network who have a caregiver (script in `content/week1-posts.md`).
- [ ] Founder: share the broker contact with Claude; Claude prepares a tailored brief.

**Week 2 (Dec 2–8): first users + first broker meeting**
- 10 households onboarded by hand (sit with them, watch the caregiver add the first expense).
- First meeting with your broker contact; propose a 30-day pilot with 10 of their employer families.
- Post 2 helpful posts (PTT elderly + one FB group). Claude drafts, founder posts.

**Week 3 (Dec 9–15): learn + fix**
- Five 15-minute calls with active households. What made them stop or stay?
- Claude fixes onboarding friction found in `/stats` and in feedback.
- First SEO article live.

**Week 4–5 (Dec 16–31): broker pilot running + holiday content**
- Pilot broker hands out the link and flyer (`?ref=<broker>`).
- Timely content: 年終／春節 (Lunar New Year 2027 is Feb 6). 「過年看護放假、紅包、家用金怎麼算」 is a natural post.
- Dec 31 review: actual numbers against §1, and the plan for Q1.

## 5. Monetisation (later, once ~100 weekly users)

Families keep the core free. That's the whole wedge. Candidates:
- **Broker plan (B2B, most promising):** branded app/link, dashboard of their families' activity (aggregates only), dispute log export for 評鑑 files. About NT$1–3k per month per agency.
- **Family premium (NT$60–120/month):**
  - monthly PDF statement to share with siblings
  - multi-caregiver
  - long receipt history
  - salary slip in Chinese + the worker's language (law requires bilingual slips kept 5 years, so this is a real need)

Validate by asking the pilot broker "would you pay for X?" before building.

## 6. Risks and watch-outs

- **Scope-of-work rule:** making a caregiver run errands for *other* family members or outside the permitted scope can be fined (就服法 §57/§68).
  - Copy frames spending as household/care-recipient spending; never encourage "run errands for the whole family".
  - Worth a 10-minute check with the broker.
- **Trust:** caregivers may read the app as surveillance. Always pitch it as fairness for both sides, and get Indonesian copy right; have a native speaker review it.
- **Single Fly machine in Tokyo that sleeps:** the first visit is slow, which hurts landing-page conversion. Consider `min_machines_running = 1` once traffic starts (small cost).
- **Domain:** `carecash.me` looks unofficial to brokers. A `.tw` or `.app` domain is about NT$500–1,500 a year.

## 7. What I need from the founder (blockers)

1. **Merge + deploy** the branch (`flyctl deploy --remote-only --ha=false -a carecash`).
2. **Fly secrets:**
   - `METRICS_TOKEN` (32+ random chars)
   - `CONTACT_EMAIL` and/or `CONTACT_LINE_URL` (shown on `/partners`)
   - confirm `OWNER_EMAILS` includes you
3. **LINE Login keys** (`LINE_CLIENT_ID`, `LINE_CLIENT_SECRET`).
4. **Decide:** buy a domain? (Recommend yes: carecash.tw or carecash.app.)
5. **Social accounts** (must be created by you): LINE OA, FB Page, Threads/IG.
6. **Broker contact:** name, company, relationship, what they already know about CareCash.
7. **For weekly reviews:** give Claude read access to `/api/metrics` (store `METRICS_TOKEN` as a credential for carecash.me in the cloud environment, when asked).

## 8. Weekly rhythm (what Claude does each week)

**Standing rule from the founder:** the plan doc "CareCash Growth Plan & Weekly Log" (https://claude.ai/artifact/3ekZHXvrrgPPgo8U13WwTy) must always be up to date. Whenever any session finishes a piece of work (shipped, merged, drafted, unblocked), it updates that doc in the same turn — founder asks, sprint checklist, weekly log, "where things live" — and gives the founder the link. Finished items are ticked and live only in the "Done" list at the bottom; open items are never ticked. Any info, decision, instruction or update the founder gives — in chat or in a doc comment — is applied to the doc immediately, everywhere it applies (asks, Claude's to-do, Done, sprint checklist, weekly log, broker table). When the founder says something is done, move every item it covers.


1. Pull metrics, update `WEEKLY.md` (scoreboard + what changed).
2. Triage feedback (`scripts/feedback.mjs`); fix the top friction in code on a branch.
3. Draft next week's posts/articles in `content/` (zh-TW; id for caregiver material).
4. Advance broker outreach: research the next targets, draft messages, prep meeting briefs.
5. List founder asks at the top of `WEEKLY.md`, smallest first.
