import type { Lang } from "@/lib/i18n";

/**
 * Words of the public homepage (/) in the app's 10 languages. Traditional Chinese is the original;
 * the others are translations (Bahasa Indonesia, Tiếng Việt, Tagalog and Thai should get a native speaker's review).
 * `features` follows the icon order in landing.tsx.
 */
export type LandingCopy = {
  meta: { title: string; description: string };
  nav: { guide: string; signIn: string; openApp: string; partners: string; privacy: string; guideFooter: string };
  hero: { badge: string; title1: string; title2: string; sub: string; cta: string; note: string };
  pains: { title: string; items: string[]; note: string };
  steps: { title: string; items: { t: string; d: string }[] };
  features: { title: string; items: { t: string; d: string }[] };
  fair: { title: string; body: string };
  faq: { title: string; items: { q: string; a: string }[]; brokerQ: string; brokerA: string; brokerLink: string };
  final: { title: string; sub: string };
};

const zh: LandingCopy = {
  meta: {
    title: "CareCash 家用金｜外籍看護、幫傭的家用金記帳 App（免費）",
    description: "給家裡有外籍看護或幫傭的家庭：看護、幫傭拍收據記帳、交錢雙方確認，雇主隨時看到家用金餘額。支援印尼文、越南文、菲律賓文、泰文等 10 種語言，免費、免下載。",
  },
  nav: { guide: "指南", signIn: "登入", openApp: "開啟 App", partners: "仲介公司合作", privacy: "隱私權政策", guideFooter: "家用金指南" },
  hero: {
    badge: "給家裡有看護或幫傭的家庭",
    title1: "看護、幫傭的家用金",
    title2: "每一筆都清楚",
    sub: "看護拍收據記帳、交錢雙方確認，你隨時在手機上看到餘額。不用每週對帳，也不會因為菜錢傷感情。",
    cta: "免費開始使用",
    note: "免費・免下載・支援 Bahasa Indonesia、Tiếng Việt、Tagalog、ภาษาไทย 等 10 種語言",
  },
  pains: {
    title: "這些情況，你熟悉嗎？",
    items: ["每週拿一疊收據對帳，對不起來又不好意思問", "菜錢給了多少、還剩多少，兄弟姊妹各說各話", "看護說錢不夠用，卻不知道花到哪裡去", "語言不通，想問清楚又怕傷了和氣"],
    note: "家用金不是大錢，卻是雇主和看護之間最容易起摩擦的地方。帳清楚了，彼此才放心。",
  },
  steps: {
    title: "三步驟開始",
    items: [
      { t: "建立家庭", d: "用 Email、Google 或 LINE 註冊，30 秒完成。" },
      { t: "邀請看護", d: "用 LINE 或 WhatsApp 傳邀請連結，看護用自己的語言使用。" },
      { t: "看護記帳，你隨時看", d: "看護拍收據、輸入金額；你在手機上看到每一筆支出和剩下的家用金。" },
    ],
  },
  features: {
    title: "家用金需要的，都在這裡",
    items: [
      { t: "交錢收錢，雙方確認", d: "你給錢，看護按「已收到」；看護說收到錢，你按「確認」。不再有「我明明給了」的爭議。" },
      { t: "收據拍照保存", d: "每筆支出都附收據照片，按月份整理，隨時回頭查。" },
      { t: "餘額一眼看清", d: "上月剩餘＋本月給的－本月花的，自動算好，雙方看到同一個數字。" },
      { t: "家用金快用完提醒", d: "餘額低於你設定的金額時，手機推播通知你。" },
      { t: "兄弟姊妹一起管", d: "邀請家人一起看帳、一起出家用金，費用分攤清清楚楚。" },
      { t: "發票載具條碼", d: "看護結帳時出示家裡的手機條碼，發票自動歸戶，中獎不漏接。" },
      { t: "薪資與健檢紀錄", d: "薪水、健檢等費用集中記錄，可選擇是否讓看護看到。" },
      { t: "每次修改都有紀錄", d: "新增、修改、刪除都留下歷史，誰改了什麼一清二楚。" },
    ],
  },
  fair: { title: "對看護也公平", body: "看護用自己的語言操作，每一筆收到的錢都有雙方確認、每一筆支出都有收據。清楚的帳，保護你，也保護她。" },
  faq: {
    title: "常見問題",
    items: [
      { q: "要收費嗎？", a: "目前完全免費。" },
      { q: "需要下載 App 嗎？", a: "不用。手機瀏覽器打開就能用，也可以「加到主畫面」，像 App 一樣一鍵開啟。" },
      { q: "看護不會中文怎麼辦？", a: "每個人可以選自己的語言：印尼文、越南文、菲律賓文、泰文、英文等 10 種語言。你看中文，她看她的母語，記的是同一本帳。" },
      { q: "家裡的帳誰看得到？", a: "只有你邀請的家人和看護。薪資與健康紀錄預設只有雇主看得到。" },
      { q: "家裡有兩位看護可以嗎？", a: "可以。每位看護各自有自己的家用金餘額。" },
      { q: "可以先試用看看嗎？", a: "可以。登入頁有「以雇主試用」和「以看護試用」，不用註冊就能看到範例資料。" },
    ],
    brokerQ: "我是仲介公司，可以推薦給雇主嗎？",
    brokerA: "歡迎！請看",
    brokerLink: "仲介公司合作",
  },
  final: { title: "今天就讓家用金清清楚楚", sub: "免費使用，邀請看護只要傳一個連結。" },
};

const en: LandingCopy = {
  meta: {
    title: "CareCash | Household cash tracker for families and their caregiver (free)",
    description: "For families with a live-in caregiver in Taiwan: the caregiver logs expenses with receipt photos, both sides confirm every cash handover, and you see the balance anytime. 10 languages, free, no download.",
  },
  nav: { guide: "Guide", signIn: "Sign in", openApp: "Open app", partners: "For agencies", privacy: "Privacy", guideFooter: "Guide" },
  hero: {
    badge: "For families with a live-in caregiver or helper",
    title1: "Household cash,",
    title2: "every dollar clear",
    sub: "Your caregiver logs each expense with a receipt photo, both of you confirm every handover, and you see the balance on your phone anytime. No weekly receipt checks, no arguments over grocery money.",
    cta: "Start free",
    note: "Free · No download · 10 languages incl. Bahasa Indonesia, Tiếng Việt, Tagalog, ภาษาไทย",
  },
  pains: {
    title: "Sound familiar?",
    items: ["A stack of receipts every week that never adds up, and it feels awkward to ask", "Siblings disagree on how much was given and how much is left", "Your caregiver says the money ran out, but you don't know where it went", "A language gap makes it hard to ask without hurting feelings"],
    note: "Household cash is small money, yet it's where employers and caregivers clash most. Clear accounts mean peace of mind on both sides.",
  },
  steps: {
    title: "Three steps to start",
    items: [
      { t: "Create your family", d: "Sign up with email, Google or LINE in 30 seconds." },
      { t: "Invite your caregiver", d: "Send an invite link by LINE or WhatsApp; she uses the app in her own language." },
      { t: "She logs, you see", d: "She snaps the receipt and enters the amount; you see every expense and the cash left." },
    ],
  },
  features: {
    title: "Everything household cash needs",
    items: [
      { t: "Both sides confirm", d: "You give cash, she taps “I received it”; she says she got cash, you tap “Confirm”. No more “but I gave it to you”." },
      { t: "Receipt photos", d: "Every expense has its receipt photo, organised by month." },
      { t: "Balance at a glance", d: "Last month's leftover + given this month − spent this month, worked out for you. Both see the same number." },
      { t: "Low-cash alerts", d: "A push notification when the balance drops below the amount you set." },
      { t: "Share with siblings", d: "Invite family to see the account and chip in, so cost-sharing stays clear." },
      { t: "E-invoice barcode", d: "Your caregiver shows the family's mobile barcode at checkout, so every receipt lands in your carrier." },
      { t: "Salary and health records", d: "Keep salary and health-check costs in one place, shared with your caregiver only if you choose." },
      { t: "Full change history", d: "Every add, edit and delete is kept, so you always know who changed what." },
    ],
  },
  fair: { title: "Fair to your caregiver too", body: "She uses the app in her own language. Every cash handover is confirmed by both sides and every expense has a receipt. Clear accounts protect you, and protect her." },
  faq: {
    title: "Questions",
    items: [
      { q: "Does it cost anything?", a: "It's completely free for now." },
      { q: "Do I need to download an app?", a: "No. It opens in your phone's browser, and you can add it to your home screen to open it like an app." },
      { q: "My caregiver doesn't read Chinese", a: "Everyone picks their own language, from 10 including Bahasa Indonesia, Tiếng Việt, Tagalog, Thai and English. You each read your own language; it's the same account." },
      { q: "Who can see our account?", a: "Only the family members and caregivers you invite. Salary and health records are visible to employers only by default." },
      { q: "We have two caregivers", a: "No problem. Each caregiver has her own cash balance." },
      { q: "Can I try it first?", a: "Yes. On the sign-in page, try it as an employer or as a caregiver with sample data, no sign-up needed." },
    ],
    brokerQ: "I'm an agency. Can I recommend it to employers?",
    brokerA: "Yes, please! See",
    brokerLink: "For agencies",
  },
  final: { title: "Make household cash clear, starting today", sub: "Free to use. Inviting your caregiver takes one link." },
};

const id: LandingCopy = {
  meta: {
    title: "CareCash | Catatan uang belanja untuk majikan dan perawat (gratis)",
    description: "Untuk keluarga dengan perawat di Taiwan: perawat mencatat belanja dengan foto struk, setiap serah terima uang dikonfirmasi kedua pihak, dan saldo bisa dilihat kapan saja. 10 bahasa, gratis.",
  },
  nav: { guide: "Panduan", signIn: "Masuk", openApp: "Buka aplikasi", partners: "Untuk agensi", privacy: "Privasi", guideFooter: "Panduan" },
  hero: {
    badge: "Untuk keluarga dengan perawat atau asisten rumah tangga",
    title1: "Uang belanja,",
    title2: "setiap rupiah jelas",
    sub: "Perawat mencatat setiap belanja dengan foto struk, setiap serah terima uang dikonfirmasi kedua pihak, dan saldo terlihat di HP kapan saja. Tidak perlu cocokkan struk tiap minggu, tidak ada salah paham soal uang belanja.",
    cta: "Mulai gratis",
    note: "Gratis · Tanpa unduh · 10 bahasa termasuk Bahasa Indonesia, Tiếng Việt, Tagalog, ภาษาไทย",
  },
  pains: {
    title: "Pernah mengalami ini?",
    items: ["Setumpuk struk tiap minggu yang tidak pernah cocok, dan sungkan untuk bertanya", "Keluarga berbeda pendapat soal berapa uang yang sudah diberikan dan sisanya", "Uang belanja habis, tapi tidak jelas dipakai untuk apa", "Beda bahasa, ingin bertanya tapi takut menyinggung"],
    note: "Uang belanja memang kecil, tapi paling sering jadi sumber salah paham antara majikan dan perawat. Catatan yang jelas membuat kedua pihak tenang.",
  },
  steps: {
    title: "Tiga langkah mulai",
    items: [
      { t: "Buat keluarga", d: "Daftar dengan email, Google atau LINE dalam 30 detik." },
      { t: "Undang perawat", d: "Kirim link undangan lewat LINE atau WhatsApp; perawat memakai aplikasi dalam bahasanya sendiri." },
      { t: "Perawat mencatat, majikan melihat", d: "Foto struk dan isi jumlahnya; semua belanja dan sisa uang terlihat di HP." },
    ],
  },
  features: {
    title: "Semua yang dibutuhkan untuk uang belanja",
    items: [
      { t: "Dikonfirmasi kedua pihak", d: "Majikan memberi uang, perawat tekan “Sudah saya terima”; perawat terima uang, majikan tekan “Konfirmasi”. Tidak ada lagi “tapi saya sudah kasih”." },
      { t: "Foto struk tersimpan", d: "Setiap belanja ada foto struknya, tersusun per bulan." },
      { t: "Saldo langsung terlihat", d: "Sisa bulan lalu + uang bulan ini − belanja bulan ini, dihitung otomatis. Kedua pihak melihat angka yang sama." },
      { t: "Pengingat uang menipis", d: "Notifikasi saat saldo di bawah jumlah yang diatur." },
      { t: "Bisa dikelola bersama keluarga", d: "Anggota keluarga bisa ikut melihat dan ikut memberi uang belanja." },
      { t: "Barcode e-invoice", d: "Tunjukkan barcode keluarga saat membayar, struk elektronik langsung tersimpan." },
      { t: "Catatan gaji dan kesehatan", d: "Gaji dan biaya cek kesehatan tercatat di satu tempat." },
      { t: "Riwayat setiap perubahan", d: "Setiap tambah, ubah dan hapus tercatat, jelas siapa mengubah apa." },
    ],
  },
  fair: { title: "Adil untuk perawat juga", body: "Perawat memakai aplikasi dalam bahasanya sendiri. Setiap uang yang diterima dikonfirmasi kedua pihak dan setiap belanja ada struknya. Catatan yang jelas melindungi majikan, dan melindungi perawat." },
  faq: {
    title: "Pertanyaan",
    items: [
      { q: "Apakah berbayar?", a: "Saat ini sepenuhnya gratis." },
      { q: "Perlu mengunduh aplikasi?", a: "Tidak. Buka saja di browser HP, dan bisa ditambahkan ke layar utama seperti aplikasi." },
      { q: "Perawat tidak bisa bahasa Mandarin?", a: "Setiap orang memilih bahasanya sendiri dari 10 bahasa. Majikan membaca bahasa Mandarin, perawat membaca bahasanya sendiri, catatannya sama." },
      { q: "Siapa yang bisa melihat catatan?", a: "Hanya anggota keluarga dan perawat yang diundang. Catatan gaji dan kesehatan awalnya hanya untuk majikan." },
      { q: "Ada dua perawat di rumah?", a: "Bisa. Setiap perawat punya saldo uang belanja sendiri." },
      { q: "Bisa dicoba dulu?", a: "Bisa. Di halaman masuk, coba sebagai majikan atau perawat dengan contoh data, tanpa daftar." },
    ],
    brokerQ: "Saya dari agensi. Bisa merekomendasikan ke majikan?",
    brokerA: "Tentu! Lihat",
    brokerLink: "Untuk agensi",
  },
  final: { title: "Buat uang belanja jelas mulai hari ini", sub: "Gratis. Mengundang perawat cukup dengan satu link." },
};

const vi: LandingCopy = {
  meta: {
    title: "CareCash | Ghi chép tiền chợ giữa chủ nhà và người chăm sóc (miễn phí)",
    description: "Dành cho gia đình có người chăm sóc tại Đài Loan: ghi chi tiêu kèm ảnh hóa đơn, mỗi lần giao tiền đều được hai bên xác nhận, xem số dư bất cứ lúc nào. 10 ngôn ngữ, miễn phí.",
  },
  nav: { guide: "Hướng dẫn", signIn: "Đăng nhập", openApp: "Mở ứng dụng", partners: "Dành cho công ty môi giới", privacy: "Quyền riêng tư", guideFooter: "Hướng dẫn" },
  hero: {
    badge: "Dành cho gia đình có người chăm sóc hoặc giúp việc",
    title1: "Tiền chợ,",
    title2: "từng khoản đều rõ ràng",
    sub: "Người chăm sóc ghi từng khoản chi kèm ảnh hóa đơn, mỗi lần giao tiền đều được hai bên xác nhận, và bạn xem số dư trên điện thoại bất cứ lúc nào. Không cần đối chiếu hóa đơn mỗi tuần, không còn hiểu lầm vì tiền chợ.",
    cta: "Bắt đầu miễn phí",
    note: "Miễn phí · Không cần tải · 10 ngôn ngữ gồm Bahasa Indonesia, Tiếng Việt, Tagalog, ภาษาไทย",
  },
  pains: {
    title: "Bạn có gặp những điều này?",
    items: ["Một xấp hóa đơn mỗi tuần không khớp, lại ngại hỏi", "Anh chị em không thống nhất đã đưa bao nhiêu, còn lại bao nhiêu", "Tiền chợ hết nhưng không rõ đã tiêu vào đâu", "Khác ngôn ngữ, muốn hỏi rõ lại sợ mất lòng"],
    note: "Tiền chợ là khoản nhỏ, nhưng lại dễ gây hiểu lầm nhất giữa chủ nhà và người chăm sóc. Sổ sách rõ ràng, hai bên đều yên tâm.",
  },
  steps: {
    title: "Ba bước để bắt đầu",
    items: [
      { t: "Tạo gia đình", d: "Đăng ký bằng email, Google hoặc LINE trong 30 giây." },
      { t: "Mời người chăm sóc", d: "Gửi link mời qua LINE hoặc WhatsApp; người chăm sóc dùng bằng ngôn ngữ của mình." },
      { t: "Họ ghi, bạn xem", d: "Chụp hóa đơn và nhập số tiền; bạn thấy mọi khoản chi và tiền còn lại." },
    ],
  },
  features: {
    title: "Mọi thứ cần cho tiền chợ",
    items: [
      { t: "Hai bên cùng xác nhận", d: "Bạn đưa tiền, người chăm sóc bấm “Đã nhận”; họ nhận tiền, bạn bấm “Xác nhận”. Không còn cảnh “tôi đã đưa rồi mà”." },
      { t: "Lưu ảnh hóa đơn", d: "Mỗi khoản chi đều có ảnh hóa đơn, sắp xếp theo tháng." },
      { t: "Số dư rõ ngay", d: "Dư tháng trước + tiền tháng này − chi tháng này, tự động tính. Hai bên thấy cùng một con số." },
      { t: "Nhắc khi sắp hết tiền", d: "Thông báo khi số dư xuống dưới mức bạn đặt." },
      { t: "Cả nhà cùng quản lý", d: "Mời người thân cùng xem và cùng góp tiền, chia sẻ chi phí rõ ràng." },
      { t: "Mã vạch hóa đơn điện tử", d: "Đưa mã vạch của gia đình khi thanh toán, hóa đơn tự động được lưu." },
      { t: "Ghi chép lương và khám sức khỏe", d: "Lương và chi phí khám sức khỏe được ghi ở một nơi." },
      { t: "Lưu lại mọi thay đổi", d: "Mỗi lần thêm, sửa, xóa đều được lưu, rõ ai đã thay đổi gì." },
    ],
  },
  fair: { title: "Công bằng cho cả người chăm sóc", body: "Người chăm sóc dùng ứng dụng bằng ngôn ngữ của mình. Mỗi khoản tiền nhận đều được hai bên xác nhận, mỗi khoản chi đều có hóa đơn. Sổ sách rõ ràng bảo vệ bạn, và bảo vệ cả họ." },
  faq: {
    title: "Câu hỏi thường gặp",
    items: [
      { q: "Có mất phí không?", a: "Hiện tại hoàn toàn miễn phí." },
      { q: "Có cần tải ứng dụng không?", a: "Không. Mở trên trình duyệt điện thoại, có thể thêm vào màn hình chính như một ứng dụng." },
      { q: "Người chăm sóc không biết tiếng Trung?", a: "Mỗi người chọn ngôn ngữ của mình trong 10 ngôn ngữ. Mỗi người đọc bằng tiếng của mình, nhưng là cùng một sổ." },
      { q: "Ai xem được sổ của gia đình?", a: "Chỉ những người thân và người chăm sóc được mời. Lương và hồ sơ sức khỏe mặc định chỉ chủ nhà xem được." },
      { q: "Nhà có hai người chăm sóc?", a: "Được. Mỗi người có số dư tiền chợ riêng." },
      { q: "Có thể dùng thử trước không?", a: "Có. Ở trang đăng nhập, dùng thử với vai chủ nhà hoặc người chăm sóc với dữ liệu mẫu, không cần đăng ký." },
    ],
    brokerQ: "Tôi là công ty môi giới, có thể giới thiệu cho chủ nhà không?",
    brokerA: "Rất hoan nghênh! Xem",
    brokerLink: "Dành cho công ty môi giới",
  },
  final: { title: "Làm rõ tiền chợ ngay hôm nay", sub: "Miễn phí. Mời người chăm sóc chỉ cần một đường link." },
};

const tl: LandingCopy = {
  meta: {
    title: "CareCash | Talaan ng pambili para sa amo at caregiver (libre)",
    description: "Para sa mga pamilyang may caregiver sa Taiwan: itinatala ng caregiver ang bawat gastos na may litrato ng resibo, kinukumpirma ng dalawang panig ang bawat abot ng pera, at makikita ang balanse kahit kailan. 10 wika, libre.",
  },
  nav: { guide: "Gabay", signIn: "Mag-sign in", openApp: "Buksan ang app", partners: "Para sa ahensya", privacy: "Privacy", guideFooter: "Gabay" },
  hero: {
    badge: "Para sa pamilyang may caregiver o kasambahay",
    title1: "Pera para sa bahay,",
    title2: "malinaw ang bawat piso",
    sub: "Itinatala ng caregiver ang bawat gastos na may litrato ng resibo, kinukumpirma ninyong dalawa ang bawat abot ng pera, at makikita mo ang balanse sa phone kahit kailan. Wala nang lingguhang pag-check ng resibo, wala nang tampuhan dahil sa pambili.",
    cta: "Magsimula nang libre",
    note: "Libre · Walang download · 10 wika kasama ang Bahasa Indonesia, Tiếng Việt, Tagalog, ภาษาไทย",
  },
  pains: {
    title: "Pamilyar ba ito?",
    items: ["Isang tumpok na resibo bawat linggo na hindi tugma, at nahihiyang magtanong", "Hindi magkasundo ang magkakapatid kung magkano na ang naibigay at natira", "Ubos na raw ang pera pero hindi alam kung saan napunta", "Magkaiba ang wika, gustong magtanong pero ayaw makasakit"],
    note: "Maliit na halaga ang pambili, pero dito madalas magkaroon ng hindi pagkakaunawaan ang amo at caregiver. Kapag malinaw ang talaan, panatag ang lahat.",
  },
  steps: {
    title: "Tatlong hakbang para magsimula",
    items: [
      { t: "Gumawa ng pamilya", d: "Mag-sign up gamit ang email, Google o LINE sa loob ng 30 segundo." },
      { t: "Imbitahan ang caregiver", d: "Ipadala ang link sa LINE o WhatsApp; gagamitin niya ito sa sarili niyang wika." },
      { t: "Siya ang nagtatala, ikaw ang nakakakita", d: "Kunan ng litrato ang resibo at ilagay ang halaga; makikita mo ang bawat gastos at natitirang pera." },
    ],
  },
  features: {
    title: "Lahat ng kailangan para sa pambili",
    items: [
      { t: "Kinukumpirma ng dalawang panig", d: "Ikaw ang nag-abot, pipindutin niya ang “Natanggap ko”; siya ang nakatanggap, pipindutin mo ang “Kumpirmahin”. Wala nang “pero naibigay ko na”." },
      { t: "Litrato ng resibo", d: "May litrato ng resibo ang bawat gastos, nakaayos ayon sa buwan." },
      { t: "Kita agad ang balanse", d: "Natira noong nakaraang buwan + ibinigay ngayong buwan − ginastos ngayong buwan, awtomatikong kinukuwenta." },
      { t: "Paalala kapag paubos na", d: "May notification kapag bumaba ang balanse sa halagang itinakda mo." },
      { t: "Kasama ang buong pamilya", d: "Imbitahan ang mga kapatid na tumingin at mag-ambag, malinaw ang hatian." },
      { t: "Barcode ng e-invoice", d: "Ipakita ang barcode ng pamilya sa pagbabayad, awtomatikong naitatabi ang resibo." },
      { t: "Talaan ng sahod at health check", d: "Nakatala sa isang lugar ang sahod at gastos sa health check." },
      { t: "Kumpletong kasaysayan", d: "Naitatala ang bawat dagdag, pagbabago at bura, malinaw kung sino ang nagbago." },
    ],
  },
  fair: { title: "Patas din sa caregiver", body: "Ginagamit niya ang app sa sarili niyang wika. Kinukumpirma ng dalawang panig ang bawat perang natanggap, at may resibo ang bawat gastos. Ang malinaw na talaan ay proteksyon mo, at proteksyon din niya." },
  faq: {
    title: "Mga tanong",
    items: [
      { q: "May bayad ba?", a: "Libre ito sa ngayon." },
      { q: "Kailangan bang mag-download?", a: "Hindi. Bukas ito sa browser ng phone, at puwedeng idagdag sa home screen na parang app." },
      { q: "Hindi marunong ng Chinese ang caregiver?", a: "Bawat isa ay pipili ng sariling wika mula sa 10. Iisang talaan, magkaibang wika." },
      { q: "Sino ang makakakita ng talaan?", a: "Ang mga inimbitahang kapamilya at caregiver lamang. Ang sahod at health records ay para sa amo lang bilang default." },
      { q: "Dalawa ang caregiver namin", a: "Puwede. May sariling balanse ang bawat caregiver." },
      { q: "Puwede bang subukan muna?", a: "Oo. Sa sign-in page, subukan bilang amo o caregiver na may sample na datos, walang sign-up." },
    ],
    brokerQ: "Ahensya ako. Puwede ko bang irekomenda sa mga amo?",
    brokerA: "Oo naman! Tingnan ang",
    brokerLink: "Para sa ahensya",
  },
  final: { title: "Gawing malinaw ang pambili ngayon", sub: "Libre. Isang link lang para imbitahan ang caregiver." },
};

const th: LandingCopy = {
  meta: {
    title: "CareCash | บันทึกเงินค่าใช้จ่ายในบ้านระหว่างนายจ้างกับผู้ดูแล (ฟรี)",
    description: "สำหรับครอบครัวที่มีผู้ดูแลในไต้หวัน: ผู้ดูแลบันทึกค่าใช้จ่ายพร้อมรูปใบเสร็จ ทั้งสองฝ่ายยืนยันทุกครั้งที่ส่งเงิน และดูยอดคงเหลือได้ตลอดเวลา 10 ภาษา ฟรี",
  },
  nav: { guide: "คู่มือ", signIn: "เข้าสู่ระบบ", openApp: "เปิดแอป", partners: "สำหรับบริษัทจัดหางาน", privacy: "ความเป็นส่วนตัว", guideFooter: "คู่มือ" },
  hero: {
    badge: "สำหรับครอบครัวที่มีผู้ดูแลหรือแม่บ้าน",
    title1: "เงินค่าใช้จ่ายในบ้าน",
    title2: "ชัดเจนทุกบาท",
    sub: "ผู้ดูแลบันทึกค่าใช้จ่ายทุกรายการพร้อมรูปใบเสร็จ ทั้งสองฝ่ายยืนยันทุกครั้งที่ส่งเงิน และคุณดูยอดคงเหลือในมือถือได้ตลอดเวลา ไม่ต้องตรวจใบเสร็จทุกสัปดาห์ ไม่ต้องผิดใจกันเรื่องเงินค่ากับข้าว",
    cta: "เริ่มใช้ฟรี",
    note: "ฟรี · ไม่ต้องดาวน์โหลด · 10 ภาษา รวม Bahasa Indonesia, Tiếng Việt, Tagalog, ภาษาไทย",
  },
  pains: {
    title: "เคยเจอแบบนี้ไหม?",
    items: ["ใบเสร็จกองโตทุกสัปดาห์ที่ไม่เคยตรงกัน และไม่กล้าถาม", "พี่น้องจำไม่ตรงกันว่าให้เงินไปเท่าไรและเหลือเท่าไร", "เงินหมดแล้ว แต่ไม่รู้ว่าใช้ไปกับอะไร", "ภาษาต่างกัน อยากถามให้ชัดแต่กลัวเสียน้ำใจ"],
    note: "เงินค่าใช้จ่ายในบ้านเป็นเงินไม่มาก แต่เป็นจุดที่นายจ้างกับผู้ดูแลผิดใจกันบ่อยที่สุด บัญชีชัดเจน ทั้งสองฝ่ายก็สบายใจ",
  },
  steps: {
    title: "เริ่มได้ใน 3 ขั้นตอน",
    items: [
      { t: "สร้างครอบครัว", d: "สมัครด้วยอีเมล Google หรือ LINE ภายใน 30 วินาที" },
      { t: "เชิญผู้ดูแล", d: "ส่งลิงก์เชิญทาง LINE หรือ WhatsApp ผู้ดูแลใช้งานเป็นภาษาของตัวเอง" },
      { t: "ผู้ดูแลบันทึก คุณดูได้", d: "ถ่ายรูปใบเสร็จและใส่จำนวนเงิน คุณเห็นทุกรายการและเงินที่เหลือ" },
    ],
  },
  features: {
    title: "ทุกอย่างที่ต้องใช้สำหรับเงินในบ้าน",
    items: [
      { t: "ยืนยันทั้งสองฝ่าย", d: "คุณให้เงิน ผู้ดูแลกด “ได้รับแล้ว” ผู้ดูแลได้รับเงิน คุณกด “ยืนยัน” ไม่มีคำว่า “ก็ให้ไปแล้วนี่”" },
      { t: "เก็บรูปใบเสร็จ", d: "ทุกรายการมีรูปใบเสร็จ จัดเรียงตามเดือน" },
      { t: "เห็นยอดคงเหลือทันที", d: "เหลือจากเดือนก่อน + ให้เดือนนี้ − ใช้เดือนนี้ คำนวณให้อัตโนมัติ ทั้งสองฝ่ายเห็นตัวเลขเดียวกัน" },
      { t: "เตือนเมื่อเงินใกล้หมด", d: "แจ้งเตือนเมื่อยอดต่ำกว่าจำนวนที่ตั้งไว้" },
      { t: "ทั้งครอบครัวดูได้", d: "เชิญพี่น้องมาดูบัญชีและช่วยออกเงิน แบ่งค่าใช้จ่ายได้ชัดเจน" },
      { t: "บาร์โค้ดใบกำกับภาษีอิเล็กทรอนิกส์", d: "แสดงบาร์โค้ดของครอบครัวตอนจ่ายเงิน ใบเสร็จจะถูกเก็บอัตโนมัติ" },
      { t: "บันทึกเงินเดือนและตรวจสุขภาพ", d: "เงินเดือนและค่าตรวจสุขภาพบันทึกไว้ที่เดียว" },
      { t: "ประวัติการแก้ไขครบถ้วน", d: "ทุกการเพิ่ม แก้ไข และลบถูกบันทึก รู้ว่าใครแก้อะไร" },
    ],
  },
  fair: { title: "ยุติธรรมกับผู้ดูแลด้วย", body: "ผู้ดูแลใช้แอปเป็นภาษาของตัวเอง เงินทุกครั้งที่ได้รับมีการยืนยันทั้งสองฝ่าย และทุกค่าใช้จ่ายมีใบเสร็จ บัญชีที่ชัดเจนปกป้องคุณ และปกป้องเขาด้วย" },
  faq: {
    title: "คำถามที่พบบ่อย",
    items: [
      { q: "มีค่าใช้จ่ายไหม?", a: "ตอนนี้ใช้ฟรีทั้งหมด" },
      { q: "ต้องดาวน์โหลดแอปไหม?", a: "ไม่ต้อง เปิดในเบราว์เซอร์มือถือได้เลย และเพิ่มไว้ที่หน้าจอหลักเหมือนแอปได้" },
      { q: "ผู้ดูแลอ่านภาษาจีนไม่ได้?", a: "แต่ละคนเลือกภาษาของตัวเองได้จาก 10 ภาษา บัญชีเดียวกัน คนละภาษา" },
      { q: "ใครเห็นบัญชีได้บ้าง?", a: "เฉพาะสมาชิกครอบครัวและผู้ดูแลที่ได้รับเชิญ บันทึกเงินเดือนและสุขภาพเห็นได้เฉพาะนายจ้างโดยค่าเริ่มต้น" },
      { q: "บ้านมีผู้ดูแลสองคน?", a: "ได้ ผู้ดูแลแต่ละคนมียอดเงินของตัวเอง" },
      { q: "ทดลองใช้ก่อนได้ไหม?", a: "ได้ ที่หน้าเข้าสู่ระบบ ทดลองในฐานะนายจ้างหรือผู้ดูแลพร้อมข้อมูลตัวอย่าง ไม่ต้องสมัคร" },
    ],
    brokerQ: "เป็นบริษัทจัดหางาน แนะนำให้นายจ้างได้ไหม?",
    brokerA: "ยินดีมาก! ดูที่",
    brokerLink: "สำหรับบริษัทจัดหางาน",
  },
  final: { title: "ทำให้เงินในบ้านชัดเจนตั้งแต่วันนี้", sub: "ใช้ฟรี เชิญผู้ดูแลแค่ส่งลิงก์เดียว" },
};

const ja: LandingCopy = {
  meta: {
    title: "CareCash｜介護者との生活費を記録する無料アプリ",
    description: "住み込みの介護者がいるご家庭へ：レシート写真付きで支出を記録し、現金の受け渡しは双方で確認、残高はいつでも確認できます。10言語対応、無料。",
  },
  nav: { guide: "ガイド", signIn: "ログイン", openApp: "アプリを開く", partners: "仲介会社の方へ", privacy: "プライバシー", guideFooter: "ガイド" },
  hero: {
    badge: "介護者や家事ヘルパーがいるご家庭へ",
    title1: "介護者に渡す生活費、",
    title2: "一円まで明確に",
    sub: "介護者がレシート写真付きで支出を記録し、現金の受け渡しは双方で確認。残高はスマホでいつでも見られます。毎週のレシート確認も、お金をめぐる気まずさもなくなります。",
    cta: "無料で始める",
    note: "無料・ダウンロード不要・インドネシア語、ベトナム語、タガログ語、タイ語など10言語",
  },
  pains: {
    title: "こんなこと、ありませんか？",
    items: ["毎週レシートの束が合わず、聞くのも気が引ける", "兄弟姉妹で、渡した額や残りの額の認識が違う", "お金が足りないと言われても、何に使ったか分からない", "言葉の壁があり、聞きたくても気まずい"],
    note: "生活費は小さなお金ですが、雇用主と介護者の間で最も摩擦が起きやすいところ。記録が明確なら、お互い安心です。",
  },
  steps: {
    title: "3ステップで開始",
    items: [
      { t: "家族を作成", d: "メール、Google、LINEで30秒で登録。" },
      { t: "介護者を招待", d: "LINEかWhatsAppで招待リンクを送信。介護者は自分の言語で使えます。" },
      { t: "介護者が記録、あなたが確認", d: "レシートを撮って金額を入力。すべての支出と残高が見られます。" },
    ],
  },
  features: {
    title: "生活費管理に必要なものがすべて",
    items: [
      { t: "受け渡しは双方で確認", d: "あなたが渡すと介護者が「受け取った」を押し、介護者が受け取ったと言えばあなたが「確認」を押す。「渡したはず」はもうありません。" },
      { t: "レシート写真を保存", d: "すべての支出にレシート写真、月ごとに整理。" },
      { t: "残高がひと目で", d: "先月の残り＋今月渡した額－今月の支出を自動計算。双方が同じ数字を見られます。" },
      { t: "残高不足のお知らせ", d: "設定した額を下回るとプッシュ通知。" },
      { t: "兄弟姉妹で共有", d: "家族を招待して一緒に確認・負担、分担が明確に。" },
      { t: "電子発票のバーコード", d: "会計時に家族のモバイルバーコードを提示、発票が自動で保存。" },
      { t: "給与・健康診断の記録", d: "給与や健康診断の費用をまとめて記録。" },
      { t: "すべての変更履歴", d: "追加・編集・削除はすべて記録、誰が何を変えたか明確。" },
    ],
  },
  fair: { title: "介護者にも公平に", body: "介護者は自分の言語で使えます。受け取ったお金は双方で確認し、支出にはすべてレシート。明確な記録は、あなたも介護者も守ります。" },
  faq: {
    title: "よくある質問",
    items: [
      { q: "料金はかかりますか？", a: "現在は完全無料です。" },
      { q: "アプリのダウンロードは必要？", a: "不要です。スマホのブラウザで開けて、ホーム画面に追加すればアプリのように使えます。" },
      { q: "介護者が中国語を読めません", a: "10言語から各自が自分の言語を選べます。同じ記録を、それぞれの言語で。" },
      { q: "記録は誰が見られますか？", a: "招待した家族と介護者だけです。給与と健康の記録は初期設定で雇用主のみ。" },
      { q: "介護者が2人いる場合は？", a: "大丈夫です。介護者ごとに残高があります。" },
      { q: "先に試せますか？", a: "はい。ログイン画面で、雇用主または介護者としてサンプルデータで試せます。登録不要。" },
    ],
    brokerQ: "仲介会社ですが、雇用主に紹介できますか？",
    brokerA: "ぜひ！こちらをご覧ください：",
    brokerLink: "仲介会社の方へ",
  },
  final: { title: "今日から生活費を明確に", sub: "無料。介護者の招待はリンクひとつ。" },
};

const ko: LandingCopy = {
  meta: {
    title: "CareCash | 간병인과의 생활비를 기록하는 무료 앱",
    description: "입주 간병인이 있는 가정을 위해: 영수증 사진과 함께 지출을 기록하고, 현금 전달은 양쪽이 확인하며, 잔액은 언제든 확인할 수 있습니다. 10개 언어, 무료.",
  },
  nav: { guide: "가이드", signIn: "로그인", openApp: "앱 열기", partners: "중개업체 안내", privacy: "개인정보", guideFooter: "가이드" },
  hero: {
    badge: "간병인이나 가사도우미가 있는 가정을 위해",
    title1: "간병인 생활비,",
    title2: "한 푼까지 투명하게",
    sub: "간병인이 영수증 사진과 함께 지출을 기록하고, 현금 전달은 양쪽이 확인합니다. 잔액은 휴대폰으로 언제든지. 매주 영수증 대조도, 장보기 돈 때문에 서운할 일도 없습니다.",
    cta: "무료로 시작하기",
    note: "무료 · 다운로드 불필요 · 인도네시아어, 베트남어, 타갈로그어, 태국어 등 10개 언어",
  },
  pains: {
    title: "이런 적 있으신가요?",
    items: ["매주 맞지 않는 영수증 뭉치, 물어보기도 민망하다", "형제자매끼리 얼마를 줬고 얼마가 남았는지 말이 다르다", "돈이 부족하다는데 어디에 썼는지 모르겠다", "언어가 달라 물어보고 싶어도 마음 상할까 걱정된다"],
    note: "생활비는 작은 돈이지만, 고용주와 간병인 사이에서 가장 갈등이 생기기 쉬운 부분입니다. 기록이 분명하면 서로 안심할 수 있습니다.",
  },
  steps: {
    title: "3단계로 시작",
    items: [
      { t: "가족 만들기", d: "이메일, Google, LINE으로 30초 만에 가입." },
      { t: "간병인 초대", d: "LINE이나 WhatsApp으로 초대 링크를 보내면 간병인은 자기 언어로 사용합니다." },
      { t: "간병인이 기록, 당신이 확인", d: "영수증을 찍고 금액을 입력하면 모든 지출과 잔액이 보입니다." },
    ],
  },
  features: {
    title: "생활비 관리에 필요한 모든 것",
    items: [
      { t: "양쪽이 함께 확인", d: "당신이 주면 간병인이 “받았어요”를, 간병인이 받았다고 하면 당신이 “확인”을 누릅니다. “분명히 줬는데”는 이제 그만." },
      { t: "영수증 사진 보관", d: "모든 지출에 영수증 사진, 월별로 정리." },
      { t: "잔액을 한눈에", d: "지난달 잔액 + 이번 달 준 돈 − 이번 달 지출을 자동 계산. 양쪽이 같은 숫자를 봅니다." },
      { t: "잔액 부족 알림", d: "설정한 금액 아래로 내려가면 푸시 알림." },
      { t: "형제자매와 함께", d: "가족을 초대해 함께 보고 함께 부담, 분담이 분명해집니다." },
      { t: "전자영수증 바코드", d: "계산할 때 가족의 모바일 바코드를 보여주면 영수증이 자동 저장." },
      { t: "급여·건강검진 기록", d: "급여와 건강검진 비용을 한곳에 기록." },
      { t: "모든 변경 기록", d: "추가·수정·삭제가 모두 남아 누가 무엇을 바꿨는지 분명합니다." },
    ],
  },
  fair: { title: "간병인에게도 공정하게", body: "간병인은 자기 언어로 사용합니다. 받은 돈은 양쪽이 확인하고, 모든 지출에는 영수증이 있습니다. 분명한 기록은 당신도, 간병인도 지켜줍니다." },
  faq: {
    title: "자주 묻는 질문",
    items: [
      { q: "요금이 있나요?", a: "현재 완전히 무료입니다." },
      { q: "앱을 다운로드해야 하나요?", a: "아니요. 휴대폰 브라우저에서 열리고, 홈 화면에 추가하면 앱처럼 쓸 수 있습니다." },
      { q: "간병인이 중국어를 못 읽어요", a: "10개 언어 중 각자 자기 언어를 고릅니다. 같은 장부, 다른 언어." },
      { q: "누가 장부를 볼 수 있나요?", a: "초대한 가족과 간병인만 볼 수 있습니다. 급여와 건강 기록은 기본적으로 고용주만 봅니다." },
      { q: "간병인이 두 명이에요", a: "괜찮습니다. 간병인마다 잔액이 따로 있습니다." },
      { q: "먼저 써볼 수 있나요?", a: "네. 로그인 화면에서 고용주 또는 간병인으로 샘플 데이터를 체험할 수 있습니다. 가입 불필요." },
    ],
    brokerQ: "중개업체인데 고용주에게 추천해도 되나요?",
    brokerA: "물론입니다! 여기를 보세요:",
    brokerLink: "중개업체 안내",
  },
  final: { title: "오늘부터 생활비를 투명하게", sub: "무료. 간병인 초대는 링크 하나면 됩니다." },
};

const es: LandingCopy = {
  meta: {
    title: "CareCash | Control del dinero de la casa entre familia y cuidadora (gratis)",
    description: "Para familias con una cuidadora interna en Taiwán: ella registra cada gasto con foto del recibo, ambas partes confirman cada entrega de dinero y ves el saldo cuando quieras. 10 idiomas, gratis.",
  },
  nav: { guide: "Guía", signIn: "Entrar", openApp: "Abrir la app", partners: "Para agencias", privacy: "Privacidad", guideFooter: "Guía" },
  hero: {
    badge: "Para familias con cuidadora o empleada del hogar",
    title1: "El dinero de la casa,",
    title2: "claro hasta el último peso",
    sub: "Tu cuidadora registra cada gasto con foto del recibo, ambas partes confirman cada entrega y ves el saldo en el móvil cuando quieras. Sin revisar recibos cada semana, sin malentendidos por el dinero de la compra.",
    cta: "Empezar gratis",
    note: "Gratis · Sin descargas · 10 idiomas, incluidos Bahasa Indonesia, Tiếng Việt, Tagalog, ภาษาไทย",
  },
  pains: {
    title: "¿Te suena?",
    items: ["Un montón de recibos cada semana que no cuadran, y da apuro preguntar", "Los hermanos no se ponen de acuerdo en cuánto se dio y cuánto queda", "Se acabó el dinero, pero no sabes en qué se gastó", "El idioma complica preguntar sin herir sentimientos"],
    note: "El dinero de la casa es poco, pero es donde más chocan empleadores y cuidadoras. Con cuentas claras, todos tranquilos.",
  },
  steps: {
    title: "Empieza en tres pasos",
    items: [
      { t: "Crea tu familia", d: "Regístrate con email, Google o LINE en 30 segundos." },
      { t: "Invita a tu cuidadora", d: "Envía un enlace por LINE o WhatsApp; ella usa la app en su idioma." },
      { t: "Ella registra, tú lo ves", d: "Foto del recibo e importe; ves cada gasto y el dinero que queda." },
    ],
  },
  features: {
    title: "Todo lo que necesita el dinero de la casa",
    items: [
      { t: "Confirmación de ambas partes", d: "Tú das el dinero y ella pulsa “Lo recibí”; ella dice que lo recibió y tú pulsas “Confirmar”. Se acabó el “pero si te lo di”." },
      { t: "Fotos de recibos", d: "Cada gasto con su foto, ordenado por mes." },
      { t: "Saldo de un vistazo", d: "Lo que sobró el mes pasado + lo dado este mes − lo gastado, calculado solo. Ambas ven el mismo número." },
      { t: "Aviso de saldo bajo", d: "Notificación cuando el saldo baja de la cantidad que elijas." },
      { t: "Compártelo con tus hermanos", d: "Invita a la familia a ver y aportar, con el reparto claro." },
      { t: "Código de factura electrónica", d: "Ella muestra el código de la familia al pagar y la factura se guarda sola." },
      { t: "Salario y chequeos médicos", d: "Salario y gastos de chequeos en un solo lugar." },
      { t: "Historial de cambios", d: "Cada alta, edición y borrado queda registrado." },
    ],
  },
  fair: { title: "Justo también para tu cuidadora", body: "Ella usa la app en su propio idioma. Cada entrega de dinero la confirman ambas partes y cada gasto tiene recibo. Las cuentas claras te protegen a ti, y a ella." },
  faq: {
    title: "Preguntas",
    items: [
      { q: "¿Cuesta algo?", a: "Por ahora es totalmente gratis." },
      { q: "¿Hay que descargar una app?", a: "No. Se abre en el navegador del móvil y puedes añadirla a la pantalla de inicio." },
      { q: "Mi cuidadora no lee chino", a: "Cada persona elige su idioma entre 10. La misma cuenta, cada uno en su idioma." },
      { q: "¿Quién ve nuestras cuentas?", a: "Solo los familiares y cuidadoras que invites. Salario y salud, solo para empleadores por defecto." },
      { q: "Tenemos dos cuidadoras", a: "Sin problema. Cada una tiene su propio saldo." },
      { q: "¿Puedo probarla antes?", a: "Sí. En la página de entrada, pruébala como empleador o cuidadora con datos de ejemplo, sin registrarte." },
    ],
    brokerQ: "Soy una agencia. ¿Puedo recomendarla a los empleadores?",
    brokerA: "¡Claro! Mira",
    brokerLink: "Para agencias",
  },
  final: { title: "Cuentas claras desde hoy", sub: "Gratis. Invitar a tu cuidadora es un solo enlace." },
};

const fr: LandingCopy = {
  meta: {
    title: "CareCash | L'argent du foyer entre la famille et l'aide à domicile (gratuit)",
    description: "Pour les familles avec une aide à domicile à Taïwan : elle note chaque dépense avec la photo du ticket, chaque remise d'argent est confirmée des deux côtés, et vous voyez le solde à tout moment. 10 langues, gratuit.",
  },
  nav: { guide: "Guide", signIn: "Connexion", openApp: "Ouvrir l'app", partners: "Pour les agences", privacy: "Confidentialité", guideFooter: "Guide" },
  hero: {
    badge: "Pour les familles avec une aide à domicile ou une employée de maison",
    title1: "L'argent du foyer,",
    title2: "clair au centime près",
    sub: "Votre aide note chaque dépense avec la photo du ticket, vous confirmez tous les deux chaque remise d'argent, et vous voyez le solde sur votre téléphone. Plus de vérification de tickets chaque semaine, plus de malentendus sur l'argent des courses.",
    cta: "Commencer gratuitement",
    note: "Gratuit · Sans téléchargement · 10 langues dont Bahasa Indonesia, Tiếng Việt, Tagalog, ภาษาไทย",
  },
  pains: {
    title: "Ça vous parle ?",
    items: ["Une pile de tickets chaque semaine qui ne tombe jamais juste, et on n'ose pas demander", "Frères et sœurs ne sont pas d'accord sur ce qui a été donné et ce qui reste", "L'argent est épuisé, mais on ne sait pas où il est passé", "La langue rend les questions délicates"],
    note: "L'argent du foyer, ce sont de petites sommes, mais c'est là que naissent le plus de tensions. Des comptes clairs rassurent tout le monde.",
  },
  steps: {
    title: "Trois étapes pour commencer",
    items: [
      { t: "Créez votre famille", d: "Inscription par email, Google ou LINE en 30 secondes." },
      { t: "Invitez votre aide", d: "Envoyez un lien par LINE ou WhatsApp ; elle utilise l'app dans sa langue." },
      { t: "Elle note, vous voyez", d: "Photo du ticket et montant ; vous voyez chaque dépense et l'argent restant." },
    ],
  },
  features: {
    title: "Tout ce qu'il faut pour l'argent du foyer",
    items: [
      { t: "Confirmé des deux côtés", d: "Vous donnez, elle appuie sur « Reçu » ; elle a reçu, vous appuyez sur « Confirmer ». Fini le « mais je te l'ai donné »." },
      { t: "Photos des tickets", d: "Chaque dépense avec sa photo, classée par mois." },
      { t: "Solde d'un coup d'œil", d: "Reste du mois dernier + donné ce mois − dépensé, calculé pour vous." },
      { t: "Alerte solde bas", d: "Une notification quand le solde passe sous le montant choisi." },
      { t: "À partager en famille", d: "Invitez frères et sœurs à suivre et à contribuer." },
      { t: "Code-barres de facture électronique", d: "Elle présente le code de la famille en caisse, la facture est enregistrée." },
      { t: "Salaire et bilans de santé", d: "Salaire et frais médicaux au même endroit." },
      { t: "Historique complet", d: "Chaque ajout, modification et suppression est conservé." },
    ],
  },
  fair: { title: "Juste pour votre aide aussi", body: "Elle utilise l'app dans sa propre langue. Chaque remise d'argent est confirmée des deux côtés et chaque dépense a son ticket. Des comptes clairs vous protègent, et la protègent." },
  faq: {
    title: "Questions",
    items: [
      { q: "C'est payant ?", a: "C'est entièrement gratuit pour le moment." },
      { q: "Faut-il télécharger une app ?", a: "Non. Elle s'ouvre dans le navigateur du téléphone et peut être ajoutée à l'écran d'accueil." },
      { q: "Mon aide ne lit pas le chinois", a: "Chacun choisit sa langue parmi 10. Les mêmes comptes, chacun dans sa langue." },
      { q: "Qui voit nos comptes ?", a: "Seulement les proches et aides que vous invitez. Salaire et santé : employeurs uniquement par défaut." },
      { q: "Nous avons deux aides", a: "Aucun problème. Chacune a son propre solde." },
      { q: "Puis-je l'essayer d'abord ?", a: "Oui. Sur la page de connexion, essayez-la en employeur ou en aide avec des données d'exemple, sans inscription." },
    ],
    brokerQ: "Je suis une agence. Puis-je la recommander aux employeurs ?",
    brokerA: "Avec plaisir ! Voir",
    brokerLink: "Pour les agences",
  },
  final: { title: "Des comptes clairs dès aujourd'hui", sub: "Gratuit. Inviter votre aide, c'est un seul lien." },
};

export const LANDING: Record<Lang, LandingCopy> = { "zh-TW": zh, en, id, vi, tl, th, ja, ko, es, fr };
