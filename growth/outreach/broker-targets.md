# Broker target list (家庭看護工 agencies)

Compiled 2026-11-26. Read with `broker-pitch.md` (pitch, pilot offer) and `leona.md`. Nobody here gets contacted until Leona's pilot has a result.

## 1. How the data was gathered, and caveats

| Source | Result |
|---|---|
| https://agent.wda.gov.tw/agentext/agent/QryAgent.jsp | Form posts to `QryAgentMain.jsp` with params `head, kind, agno, title, coid, addr, tel, region` (e.g. `A`=臺北, `J`=臺中, `Q`=臺南, `B`=高雄), `ceasekind, respname`. **Every query needs an image CAPTCHA** (`answer`), so it can't be scripted. I didn't try to get past it. It's usable by hand. |
| 評鑑 results: https://emp.wda.gov.tw/Index.aspx?Year=113 (linked from the agent.wda home page) | Host blocked from this session. It can filter by city, **家庭類/事業類** and grade, so it's the right place for a manual check. |
| data.gov.tw dataset **6682** 跨國人力仲介公司許可名冊 (updated 2026-11-25) | Metadata read OK. The CSV/JSON is served from `https://apiservice.mol.gov.tw/OdService/download/A17000000J-020001-NEH` (JSON `…-QHy`). **Download blocked**, so I couldn't compute the total count. Fields: 許可證, 機構名稱, 地址, 電話, 負責人, 統編, staff counts, permit and suspension dates. No grade. |
| data.gov.tw **134650** 臺北市仲介公司資料 (has **評鑑等級** and 經營業務範圍) and **123046** 新北市外勞仲介資訊 | Best files for grade plus 家庭類 filtering. Served from data.taipei and data.ntpc.gov.tw, both **blocked**. |
| Web search (snippets only; agency sites couldn't be opened) | Names and grades come from Care喵 (caremeow.com.tw/agencies/<許可證號>/), a third-party mirror of the 113年 (2024) WDA scores. Branches, focus and channels come from the agencies' own sites as shown in search results. |

**Caveats**
- "Self-claimed A" means the agency's own marketing says so. I haven't verified it.
- Most brand names below are **not confirmed registered names**. Where Care喵 showed a full 有限公司 name, I used it.
- I found no phone numbers except the two already in `broker-pitch.md`. Get every contact channel from the agency's own site before use.
- 113年 is the latest year I saw. 114年 (2025) results were not found, and the 2026 results are due by 12/31.
- Care喵 doesn't show whether a score is 家庭類 or 事業類. A factory-focused agency can be A-grade and still be useless to us.

## 2. Targets (north → central → south within priority)

Abbreviations: Grade = 113年 WDA score via Care喵 unless it says "self-claim". HC = places home caregivers.

| # | Agency | City | Grade | HC? (evidence) | Website | Public channel | Content signal | Pri |
|---|---|---|---|---|---|---|---|---|
| 1 | 21世紀人力仲介 (reg. name unverified) | 臺北 HQ, 臺中 branch | Self-claim "連續多年 A"; a group affiliate cites 96.94 (year unknown) | Yes, has a family-caregiver section on site | 21manpower.com.tw | Official LINE / toll-free on site (per earlier notes; verify) | Daily blog; posts caregiver statistics and 評鑑 news | **A**: biggest content machine; multi-city |
| 2 | 惜福人力集團 (reg. name unverified; a similarly named 惜福國際人力資源有限公司 in 宜蘭 is a different match) | 6 sites (北/新北/桃/…/高雄) | Self-claim long-term A | Yes, claims 40k+ caregivers and helpers placed | xifu.com.tw | Site contact | Active 2026 blog (A-grade guide; salary-slip post) | **A**: caregiver-only focus, national, writes on money topics |
| 3 | 力琪國際 (reg. name unverified) | 新北林口; serves 雙北/桃/基 | Self-claim A | Yes, caregiver/helper only | family-care.tw | Official LINE live chat, 07:00–24:00 | Site content | **A**: pure 家庭類, reachable on LINE |
| 4 | 全世界人力資源開發股份有限公司 (permit 1562) | Not confirmed | **A 96.89** (2022: 96.26; 2019: 97.6) | Site title advertises 外勞申請; HC unverified | wwmanpower.com.tw | Site | Claims "連續15年A" | B: verified strong grade; check HC share |
| 5 | 驊達人力開發有限公司 | 新北三重 HQ, 桃園 | Self-claim "連續十年 A" | Yes, 外勞看護/女佣 on site; separate household HQ | hwa-da.com.tw, fangyun.com.tw | Site phones | Site | B: multi-site, household arm |
| 6 | 關懷照護人力仲介 | 臺北 | Not found | Yes, caregiver-branded | wwhr.com.tw | Site | Long comparison article "16間外勞仲介…" | B: content-active, caregiver-focused |
| 7 | 傑報外籍看護 | Not confirmed | Not found | Yes, dedicated caregiver site | care.jbjob.com.tw | Site | Employer-guide blog (how to pick a broker, 評鑑 explainer) | B: content-first; good co-marketing fit |
| 8 | 倍斯特人力仲介 | 臺北, 桃園中壢, 臺中 | Not found | Yes, home-caregiver application guides | best-co.com.tw | Site contact page | Writes about the 80+ 免巴氏 rule, which is our first-time-employer wave | B |
| 9 | 盈象人力資源管理顧問有限公司 (722) | 桃園中壢 | **A 98.2** | Unverified | Not found | Not found | Not found | B: top score; check 家庭類 |
| 10 | 唐明國際 | Not confirmed | Self-claim A | Yes, 外籍看護申請 on site | tangming.org.tw | Site | Not found | C |
| 11 | 立豪國際有限公司 | 新北新店 | Not found | Yes, 台北/新北外籍看護 | lihau.com.tw | Official LINE listed on site | Not found | C |
| 12 | 力通國際開發股份有限公司 | 新北林口 | Self-claim "多次 A" (third-party article) | Unverified | Not found | Not found | Not found | C |
| 13 | 鼎尚人力仲介有限公司 (3090) | 臺北內湖 | **A 91.86** | Unverified | Not found | Not found | Not found | C |
| 14 | 翔鈺國際人力資源有限公司 (2013) | 基隆 | **A 95.64** | Unverified | Not found | Not found | Not found | C |
| 15 | 新象人力仲介有限公司 (852) | 臺中北屯 | **A 101.06** | Likely: phr.com.tw "新象人力" says 合法看護仲介 (same entity not confirmed) | phr.com.tw (?) | Official LINE 08:30–22:00 (per phr.com.tw) | Claims 連續16年優良 | **A**: highest score seen; confirm entity |
| 16 | 世華人才仲介 | 臺中; serves 彰化/南投 | Self-claim "連續多年 A" | Yes | ss1689.com | Official LINE | Already writes about **伙食費** | **A**: direct content hook |
| 17 | 萬通人力集團 | 臺南, 臺中, 彰化 branch (serves 雲/投) | Self-claim A | Yes, 外籍看護申辦 | dachao.com.tw | 0800-600-885 (earlier notes); LINE page.line.me/775kajjf (seen in search; verify it's theirs) | Active LINE, franchise posts | **A**: multi-branch, south and central |
| 18 | 環久國際 (UNIPRO) | 臺中 | Self-claim A | Yes, 臺中外籍看護 and 幫傭 | unipro.tw | Site | 2026 blog post (臺中 broker guide) | B |
| 19 | 宗得國際人力機構 | 臺中太平 (permit 3136), 彰化溪湖 (1391) | Self-claim A (site title) | Not confirmed | tthuman.com | Site | Not found | B: 2 branches |
| 20 | 安祺人力仲介 | 臺中大里 | Self-claim A | Yes, local home care | anntchi.com | Site | Not found | C |
| 21 | 冠台人力仲介 | 彰化 | Self-claim A | Yes, 家庭看護工 and 幫傭 | kc104.com.tw | Site | Not found | C |
| 22 | 勤進人力仲介股份有限公司 (3117) | 彰化市 | **A 94.41** (2023: B 75.59) | Unverified | Not found | Not found | Not found | C |
| 23 | 神龍人力仲介有限公司 (3316) | 臺中潭子 | **A 93.48** | Unverified | Not found | Not found | Not found | C |
| 24 | 南陽人力仲介有限公司 (3546) | 臺中豐原 | **A 92.88** | Unverified | Not found | Not found | Not found | C |
| 25 | 達鴻人力仲介有限公司 (1560) | 雲林斗六 | **A 97.35** | Unverified | Not found | Not found | Not found | C |
| 26 | 東南亞集團 | Companies in 北/中/南 | Not found | Yes (earlier notes) | sea.com.tw | 0800-011-234 (earlier notes) | Not found | B: national footprint |
| 27 | 亞太人力仲介 | 6 cities | Not found | Yes | asiapacific.tw | Site | 評鑑 explainer page (2026) | B |
| 28 | 吉星人力仲介有限公司 (2475) | 嘉義太保 | **A 97.58** | Unverified | Not found | Not found | Not found | C |
| 29 | 翊揚人力仲介有限公司 (822) | 高雄前鎮 | **A 98.23** | Unverified | Not found | Not found | Not found | B: top score in the south |
| 30 | 冠龍外勞集團 (冠龍國際/冠龍人力/好事多) | 高雄 (仁武, permit 0994 per third party) | Self-claim A (2022) | Yes, 幫傭/看護 in site title | kuanlung.com.tw | Site | Not found | B: group of 3 companies, since 2000 |
| 31 | 康健人力 (康健人力資源管理顧問) | 高雄三民; serves 高/屏/南 | Self-claim A | Yes, home caregivers | kj-agent.com.tw | Site | Not found | C |
| 32 | 新興國際開發有限公司 | 高雄; serves 南/屏 | Self-claim A | Yes, 外籍看護申請 | xinxingmanpower.com | Site | Not found | C |

## 3. Counts

- **Dataset 6682, total agencies:** not computed, because the download host was blocked. RESEARCH.md's "~1,200–1,400" still stands.
- **Evaluated and A-grade (secondary sources, not the raw data):**
  - 113年 (2024): 1,247 agencies evaluated; preliminary result 814 A (~65%) and 255 B. Source: 21manpower.com.tw/migrant-workers/31383/, citing a 勞動部 notice.
  - 111年: 1,231 evaluated, 795 A (64.6%), 372 B, 64 C.
  - A Taiwan News report (Mar 2024) gave 1,042 evaluated: 333 A (32%), 663 B, 46 C, plus 371 績優免評.
  - Agencies exempt as 績優免評 are excluded from the A count, which is why the counts differ.
- **What this means:** about two-thirds of agencies hold A, so A alone doesn't separate them. Use home-caregiver focus and content activity as the real filters.

## 4. First five after Leona's pilot

1. **世華人才仲介**: already publishes about 伙食費, our exact problem. Lead with 「你們寫過伙食費那篇…」.
2. **21世紀人力仲介**: the most prolific blog; a guest post or data piece reaches many employers. Multi-city.
3. **惜福人力集團**: caregiver and helper only, 6 directly run sites, writes about salary slips (our compliance angle). One yes covers north and south.
4. **萬通人力集團**: south and central coverage plus franchise branches and an active LINE. Gives the list a southern pilot.
5. **力琪國際**: pure 家庭類, LINE chat 7am–midnight, so the easiest cold first touch. Northern counterweight.

Next best: 新象 (852), the highest verified score, once the phr.com.tw link is confirmed. 傑報 for co-marketing content.

**Before contacting anyone:** look up each one by hand on emp.wda.gov.tw (filter 家庭類) to get the registered name, the 113/114 grade and the permit number. Then update this table.
