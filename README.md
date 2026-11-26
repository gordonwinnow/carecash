# CareCash 家用金

A very simple app for a Taiwanese family (雇主) and their household caretaker (家庭移工) to track grocery cash.

**Live:** https://carecash.me

## What it does

**Phase 1: grocery cash**
1. Money goes both ways, and the other side always confirms:
   - An employer (雇主) taps **Add money**. The caretaker sees a big card and taps **I received it**. Until then the employer sees "waiting".
   - A caretaker who was handed cash taps **I got money**. It counts at once, and the employer sees a card to tap **Yes, I gave it**.
2. The caretaker taps **Add expense**, takes a photo of the receipt, enters the amount and picks a category.
3. Both see **money left**, shown monthly: last month's leftover + received this month − spent this month. Money left itself is cumulative, because it is real cash in hand. The full history is grouped by month, with receipt photos.

**Edit and history:** tap any entry to change or delete it. Every add, edit, delete, receive and confirm is kept in a change history: shown on the entry itself, and for the whole family under History → the clock button. Caretakers see the history of their own cash and expenses; salary and health history is employers only. Changing an amount asks the other side to confirm again.

**Notifications** (Settings, per person per family):
- When money left drops below a number: on by default, $1,000.
- Every expense, and every deposit: two separate switches, off by default.

They go to every device the person turned them on for: browsers and the iPhone home-screen app use Web Push (`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, set on Fly); the App Store app uses Apple Push and needs `APNS_KEY_P8` (the .p8 contents), `APNS_KEY_ID`, `APNS_TEAM_ID` as Fly secrets.

**Family:** an employer creates a family and invites more employers or caretakers by a one-time link (sent by WhatsApp, LINE or copy). Each caretaker has their own balance.

**Phase 2: Pay & health tab** (🔒)
Employers record salary, healthcare and other costs, with an optional photo. Each record is **employers only** by default; the **Caretaker can see this** switch shares it. Caretakers only get the tab once something is shared with them. This is checked on the server, including the photo URLs.

**E-invoice barcode (發票載具):** an employer pastes the family's mobile barcode number (`/` + 7 characters) in Settings → 發票載具, and the app draws the Code 39 barcode from it; a screenshot of the barcode is the fallback. Everyone in the family gets a **載具** button at the top of home that opens it full width, black on white, with a **Copy** button for the number.

**Feedback:** Settings → 意見回饋. Anyone can send a feature request or a problem, with an optional screenshot, and follow its status (Received, Planned, In progress, Done, Not planned) and the reply. They get a push when either changes.
- Owners (accounts whose email is in the `OWNER_EMAILS` secret) review and reply at `/feedback/review`, and get a push for each new one.
- From a terminal, or for Claude to triage and fix: `FEEDBACK_TOKEN=… node scripts/feedback.mjs list open`, `… reply <id> <status> "<text>"`, `… photo <name>`. This calls `/api/feedback`, which is off unless the `FEEDBACK_TOKEN` secret is set.

**Guest demo:** on the sign-in page, **Try as Employer** / **Try as Caretaker** signs in a throwaway guest with two months of sample data. Invites are off in the demo, and demo families are deleted after 3 days.

**Settings:** 10 languages (繁體中文, English, Bahasa Indonesia, Tiếng Việt, Tagalog, ภาษาไทย, 日本語, 한국어, Español, Français), light/dark/auto, and 6 main colors. All are stored per device.

**Public site and growth:** logged-out visitors get a zh-TW landing page at `/` and a broker page at `/partners` (its contact buttons show once `CONTACT_EMAIL` / `CONTACT_LINE_URL` are set). A visit with `?ref=<code>` or `utm_source` is remembered for 90 days (`src/proxy.ts`) and saved as `family.source` when that person creates a family. Owners see signups, weekly active users and households by source at `/stats`; scripts use `METRICS_TOKEN=… node scripts/metrics.mjs` (falls back to `FEEDBACK_TOKEN`). The growth plan, broker playbook and weekly log are in `growth/`.

## Stack

Next.js 16 + React 19, Tailwind 4, Better Auth, SQLite (better-sqlite3), one Fly.io machine in Tokyo (`nrt`), with a 1 GB volume at `/data` holding the database and photos. Photos are shrunk in the browser to ~1600px JPEG before upload. The machine sleeps when idle, so the first visit after a quiet spell takes a few seconds.

## Sign-in

| Method | Status | To turn on (as Fly secrets) |
|---|---|---|
| Email + password | **On** | — |
| WhatsApp code | Off until keys are set | `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID`, and an approved **Authentication** template (`WHATSAPP_TEMPLATE`, default `login_code`; `WHATSAPP_TEMPLATE_LANG`, default `en`) from Meta WhatsApp Cloud API |
| Google | Off until keys are set | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. Redirect URI: `https://carecash.me/api/auth/callback/google` |
| Apple | Off until keys are set; shown on iPhone, iPad and Mac only | `APPLE_CLIENT_ID` (a Services ID), `APPLE_TEAM_ID`, `APPLE_KEY_ID` and `APPLE_KEY_P8` (a Sign in with Apple key's .p8 contents). The server makes the client secret JWT from the key at startup. `APPLE_APP_BUNDLE_IDENTIFIER=app.carecash.ios`. Return URL: `https://carecash.me/api/auth/callback/apple` |
| LINE | Off until keys are set | `LINE_CLIENT_ID`, `LINE_CLIENT_SECRET` from a LINE Login channel. Callback: `https://carecash.me/api/auth/callback/line` |

A button only appears once its keys are set. Set them like this; it restarts the app:

```powershell
flyctl secrets set GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... -a carecash
```

Google blocks its sign-in inside app web views, so the iOS app opens Google sign-in in Safari (`/native-login`), and `/api/native/finish` sends the session back to the app through a one-time code on the `carecash://` link. Email, WhatsApp, LINE and Apple work in the web view directly.

## Custom domain

The public address is **carecash.me**. It goes live in two steps, so a deploy never points visitors at a domain that doesn't work yet:
1. DNS + certificate: `flyctl certs add carecash.me -a carecash`, then add the A/AAAA records it prints at the domain's DNS (Vercel), and wait until `flyctl certs show carecash.me -a carecash` says Ready.
2. Switch: `flyctl secrets set SITE_URL=https://carecash.me -a carecash`. Sign-in, links and the sitemap then use it, and browsers on carecash.fly.dev are redirected there (308, path and `?ref=` kept). API calls and the shipped iPhone app keep working on carecash.fly.dev. Add the carecash.me callback URLs at Google, Apple and LINE.

## Deploy

Pushing to `main` deploys automatically (`.github/workflows/deploy.yml`) once the repository secret `FLY_API_TOKEN` is set (`flyctl tokens create deploy -a carecash`). By hand:

```powershell
flyctl deploy --remote-only --ha=false -a carecash
```

Keep `--ha=false`: SQLite lives on one volume, so there must be one machine. Volume snapshots are taken daily (5 kept).

## Run locally

```powershell
npm install
```

Create `.env.local` with `BETTER_AUTH_URL=http://localhost:3101`, any `BETTER_AUTH_SECRET`, and `WHATSAPP_DEV_LOG=1`. With that flag, WhatsApp codes are printed in the server log instead of being sent. Never set it in production. Then:

```powershell
npm run build; npx next start -p 3101
```

Data goes to `.data/`. The local test accounts used during development are `master@carecash.test` (email) and `+886912345678` (WhatsApp), in the local `.data` database only.

## iPhone

- **Today:** open the site in Safari → Share → **Add to Home Screen**. It opens full screen with its own icon, and the receipt button opens the camera.
- **TestFlight from GitHub:** the `iOS` workflow (Actions → iOS → Run workflow) builds, signs and uploads to TestFlight on a GitHub Mac runner. It needs repository secrets `APPLE_TEAM_ID`, `ASC_KEY_ID`, `ASC_ISSUER_ID` and `ASC_KEY_P8` (an App Store Connect API key with Admin role), and an app record for `app.carecash.ios` in App Store Connect. Build numbers come from the run number.
- **App Store shell:** `mobile/` is a Capacitor 8 iOS project (`app.carecash.ios`) that opens the live site, the same pattern as TwoClass. Camera and photo permission texts are set, and icons are generated. Building it needs a Mac with Xcode and an Apple Developer account: `cd mobile; npx cap sync ios`, then open `mobile/ios/App/App.xcodeproj` in Xcode, set your Team, and Archive. A web deploy updates the app instantly. No store build is needed for changes.
