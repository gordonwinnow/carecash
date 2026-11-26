# Account setup kit: LINE Login, LINE Official Account, Facebook, Threads

Only the founder can create these, because each is tied to your own LINE / Facebook / Instagram login. Everything you need to paste is below. Use the same name everywhere: **看護家用金 CareCash**.

Profile picture: `public/icon-1024.png` from the repo (the green purse icon).

---

## 1. LINE Login (lets people sign in with LINE) — about 15 minutes

The code is already in the app. The button appears, first on the sign-in page, as soon as the two keys are set.

1. Go to https://developers.line.biz/console/ and log in with your LINE account.
2. **Create a provider**. Name: `CareCash`.
3. Inside it, **Create a new channel** → choose **LINE Login**.
   - Region: **Taiwan**
   - Channel name: `看護家用金 CareCash`
   - Channel description: `讓雇主與外籍看護清楚記錄家用金的免費工具`
   - App types: tick **Web app**
   - Email address: yours
   - Privacy policy URL: `https://carecash.fly.dev/privacy`
   - Agree to the terms → **Create**
4. Open the **LINE Login** tab → **Callback URL** → enter `https://carecash.fly.dev/api/auth/callback/line` → Update.
5. Open the **Basic settings** tab and copy two values:
   - **Channel ID** → this is `LINE_CLIENT_ID`
   - **Channel secret** → this is `LINE_CLIENT_SECRET`
6. At the top of the channel page, change the status from **Developing** to **Published**. Until you do this, only you can log in.
7. Set the keys on Fly (in PowerShell; the app restarts by itself):
   ```powershell
   flyctl secrets set LINE_CLIENT_ID=paste-channel-id LINE_CLIENT_SECRET=paste-channel-secret -a carecash
   ```
8. Test: open https://carecash.fly.dev/sign-in on your phone. A green **使用 LINE 繼續** button should be at the top.

Optional, later: under Basic settings → **OpenID Connect → Email address permission → Apply**. This lets LINE share users' email addresses. It needs a screenshot of the sign-in page. The app works without it.

## 2. LINE Official Account (官方帳號) — about 20 minutes

1. Go to https://tw.linebiz.com/ → 建立帳號 → **一般帳號 (free)**.
2. Fill in:
   - 帳號名稱: `看護家用金 CareCash`
   - 業種: 生活服務 → 其他 (or the closest match)
3. In the **LINE Official Account Manager**, set up the following.

**狀態消息** (status line, max 20 characters):
> 家用金每一筆都清楚

**Greeting message** (加入好友的歡迎訊息):
> 您好，歡迎加入「看護家用金 CareCash」😊
>
> 我們幫聘請外籍看護的家庭，把家用金記得清清楚楚：
> ✅ 給錢時看護按「已收到」，雙方確認
> ✅ 每筆支出拍收據保存
> ✅ 看護用印尼文、越南文等母語操作
> ✅ 完全免費，不用下載
>
> 👉 開始使用：https://carecash.fly.dev/?ref=line-oa
>
> 有任何問題，直接在這裡傳訊息給我們就可以！

**Auto-reply keywords** (自動回應). These answer common questions while you are busy:

| Keyword | Reply |
|---|---|
| 收費 / 免費 / 多少錢 | 目前完全免費使用喔！ |
| 怎麼用 / 教學 | 三步驟：① 註冊建立家庭 ② 在「設定」邀請看護（用 LINE 或 WhatsApp 傳連結）③ 看護拍收據記帳。需要的話我們可以視訊幫您設定 😊 |
| 仲介 / 合作 | 謝謝您的興趣！合作說明在這裡：https://carecash.fly.dev/partners ，也歡迎直接留下您的公司名稱和方便聯絡的時間。 |

**Rich menu** (圖文選單). Use the 3-button template, with text only on a green background:
- 開始使用 → `https://carecash.fly.dev/?ref=line-menu`
- 免註冊試用 → `https://carecash.fly.dev/sign-in#demo`
- 仲介合作 → `https://carecash.fly.dev/partners`

When it's done, send me the OA's add-friend link (`https://lin.ee/...`). I'll put it on the website and use it as `CONTACT_LINE_URL` for the broker page.

## 3. Facebook Page — about 10 minutes

1. Go to https://www.facebook.com/pages/create.
   - Page name: `看護家用金 CareCash`
   - Category: `應用程式頁面` (App page); you can add `社區服務` too
2. **簡介 (bio, max 255 characters):**
   > 給聘請外籍看護的家庭：看護拍收據記帳、交錢雙方確認，雇主隨時看到家用金餘額。支援印尼文、越南文等 10 種語言，免費、免下載。
3. Website: `https://carecash.fly.dev/?ref=fb-page`
4. Action button: **報名 / Sign up** → the same URL.
5. Cover image: plain green (#1f9461) with white text `看護家用金，每一筆都清楚`. Canva is quickest; I can make a cover in the repo instead if you want.
6. First post: use the Facebook group post in `week1-posts.md` §3, changing `?ref=fb` to `?ref=fb-page`.

The Page also lets you join Facebook groups as the Page. Still, post in groups **as yourself**, because personal stories work better there.

## 4. Threads (needs an Instagram account) — about 5 minutes

1. Create an Instagram account. Handle: `carecash.tw`, or `carecash_tw` if that's taken.
   - Name: `看護家用金 CareCash`
   - Bio:
     > 外籍看護家用金，每一筆都清楚 ✅ 雙方確認・收據留存・母語操作・免費
   - Link: `https://carecash.fly.dev/?ref=ig`
2. Open the Threads app and log in with that Instagram account. Bio link: `https://carecash.fly.dev/?ref=threads`
3. Post the 3 Threads posts in `week1-posts.md` §4, one per day.

## When you're done

Tick the items in the plan doc and send me:
- the LINE OA add-friend link
- the Facebook Page URL
- the Threads handle

I'll add them to the website footer and the weekly review.
