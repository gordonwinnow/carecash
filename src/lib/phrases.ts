/**
 * Money phrases for the moment cash changes hands, shown full screen so one side can just turn the phone around.
 * The employer's lines are shown big in the caregiver's language; the caregiver's lines big in Chinese.
 * Same wording as /guide/talking-about-money-with-caregiver (Indonesian), plus vi/tl/th/en.
 * TODO(native review): the id/vi/tl/th lines were written by Claude, not checked by a native speaker.
 */
export const PHRASE_LANGS = ["id", "vi", "tl", "th", "en"] as const;
export type PhraseLang = (typeof PHRASE_LANGS)[number];
export const PHRASE_LANG_LABEL: Record<PhraseLang, string> = {
  id: "Bahasa Indonesia",
  vi: "Tiếng Việt",
  tl: "Tagalog",
  th: "ภาษาไทย",
  en: "English",
};

export type Phrase = { key: string; first?: boolean; zh: string } & Record<PhraseLang, string>;

/** What the employer says; `first` marks the lines for the very first handover. */
export const EMPLOYER_PHRASES: Phrase[] = [
  {
    key: "this-week",
    first: true,
    zh: "這是這個星期的家用金，請你數一下。",
    id: "Ini uang belanja untuk minggu ini. Tolong dihitung dulu, ya.",
    vi: "Đây là tiền chợ của tuần này. Bạn đếm lại giúp tôi nhé.",
    tl: "Ito ang pambili para sa linggong ito. Pakibilang muna, ha.",
    th: "นี่คือเงินค่าใช้จ่ายในบ้านของสัปดาห์นี้ ช่วยนับก่อนนะ",
    en: "This is the household cash for this week. Please count it.",
  },
  {
    key: "not-salary",
    first: true,
    zh: "這是買家裡東西的錢，不是薪水。薪水我會另外給你。",
    id: "Ini uang untuk belanja keperluan rumah, bukan gaji. Gajimu saya berikan terpisah.",
    vi: "Đây là tiền mua đồ cho nhà, không phải lương. Lương tôi sẽ trả riêng.",
    tl: "Pera ito para sa gamit sa bahay, hindi ito sweldo. Hiwalay kong ibibigay ang sweldo mo.",
    th: "เงินนี้สำหรับซื้อของใช้ในบ้าน ไม่ใช่เงินเดือน เงินเดือนฉันจะให้แยกต่างหาก",
    en: "This money is for household things, not your salary. I pay your salary separately.",
  },
  {
    key: "receipts",
    first: true,
    zh: "買東西的時候請拿收據，拍照記下來就好。",
    id: "Kalau belanja, tolong minta struknya, lalu difoto dan dicatat, ya.",
    vi: "Khi mua đồ, bạn lấy hóa đơn, chụp ảnh và ghi lại là được.",
    tl: "Kapag namimili, pakikuha ang resibo, kunan ng litrato at itala lang.",
    th: "เวลาซื้อของ ขอใบเสร็จด้วย ถ่ายรูปแล้วบันทึกไว้ก็พอ",
    en: "When you shop, please keep the receipt. Just take a photo and record it.",
  },
  {
    key: "running-low",
    first: true,
    zh: "錢快用完的時候，請直接跟我說，不用不好意思。",
    id: "Kalau uangnya hampir habis, langsung bilang ke saya saja, ya. Tidak usah sungkan.",
    vi: "Khi tiền sắp hết, cứ nói thẳng với tôi, đừng ngại nhé.",
    tl: "Kapag paubos na ang pera, sabihin mo lang agad sa akin. Huwag kang mahiya.",
    th: "ถ้าเงินใกล้หมด บอกฉันได้เลยนะ ไม่ต้องเกรงใจ",
    en: "When the money is almost gone, just tell me. Don't feel shy.",
  },
  {
    key: "no-receipt",
    zh: "菜市場沒有收據沒關係，寫下買了什麼、多少錢就可以。",
    id: "Kalau di pasar tidak ada struk, tidak apa-apa. Cukup tulis beli apa dan berapa harganya.",
    vi: "Ở chợ không có hóa đơn cũng không sao. Chỉ cần ghi mua gì và bao nhiêu tiền.",
    tl: "Kung walang resibo sa palengke, okay lang. Isulat lang kung ano ang binili at magkano.",
    th: "ที่ตลาดไม่มีใบเสร็จไม่เป็นไร แค่จดว่าซื้ออะไร ราคาเท่าไร",
    en: "No receipt at the market is fine. Just write what you bought and how much.",
  },
  {
    key: "dont-pay-first",
    zh: "不要用你自己的錢先付。錢不夠的話，先告訴我。",
    id: "Jangan pakai uangmu sendiri dulu, ya. Kalau uangnya kurang, kasih tahu saya.",
    vi: "Đừng dùng tiền của bạn để trả trước. Nếu không đủ tiền, hãy nói với tôi trước.",
    tl: "Huwag mong gamitin ang sarili mong pera. Kung kulang ang pera, sabihin mo muna sa akin.",
    th: "อย่าใช้เงินของตัวเองจ่ายก่อนนะ ถ้าเงินไม่พอ บอกฉันก่อน",
    en: "Please don't pay with your own money. If it's not enough, tell me first.",
  },
  {
    key: "weekly-check",
    zh: "每個星期天晚上，我們花五分鐘一起看這個星期的帳，好嗎？",
    id: "Setiap Minggu malam, kita lihat catatan minggu ini sama-sama sebentar, sekitar lima menit. Boleh?",
    vi: "Mỗi tối Chủ nhật, mình cùng xem sổ chi tiêu của tuần khoảng năm phút, được không?",
    tl: "Tuwing Linggo ng gabi, sabay nating tingnan ang gastos ng linggo, mga limang minuto. Okay ba?",
    th: "ทุกเย็นวันอาทิตย์ เรามาดูบัญชีของสัปดาห์ด้วยกันสักห้านาทีนะ ได้ไหม",
    en: "Every Sunday evening, let's look at the week's spending together for five minutes. OK?",
  },
  {
    key: "just-asking",
    zh: "這一筆我看不太懂，可以跟我說是買什麼嗎？我只是想了解。",
    id: "Yang ini saya kurang paham. Boleh dijelaskan ini beli apa? Saya cuma ingin tahu saja, ya.",
    vi: "Khoản này tôi chưa hiểu lắm. Bạn nói tôi biết đã mua gì được không? Tôi chỉ muốn hiểu thôi.",
    tl: "Hindi ko masyadong maintindihan ang isang ito. Puwede mo bang sabihin kung ano ang binili? Gusto ko lang malaman.",
    th: "รายการนี้ฉันไม่ค่อยเข้าใจ บอกได้ไหมว่าซื้ออะไร ฉันแค่อยากรู้เฉยๆ",
    en: "I don't quite understand this one. Can you tell me what it was for? I just want to understand.",
  },
  {
    key: "thank-you",
    zh: "謝謝你記得這麼清楚。",
    id: "Terima kasih sudah mencatat dengan rapi.",
    vi: "Cảm ơn bạn đã ghi chép rõ ràng như vậy.",
    tl: "Salamat at maayos mong naitala.",
    th: "ขอบคุณที่จดไว้อย่างละเอียดนะ",
    en: "Thank you for keeping such clear records.",
  },
];

/** What the caregiver may need to say but not dare to: shown big in Chinese for the employer. */
export const CARETAKER_PHRASES: Phrase[] = [
  {
    key: "received",
    zh: "我收到家用金了，謝謝。",
    id: "Saya sudah terima uang belanjanya, terima kasih.",
    vi: "Tôi đã nhận tiền chợ rồi, cảm ơn.",
    tl: "Natanggap ko na ang pambili, salamat.",
    th: "ฉันได้รับเงินแล้ว ขอบคุณ",
    en: "I've received the household cash, thank you.",
  },
  {
    key: "running-low",
    zh: "錢快用完了，可以再補一點嗎？",
    id: "Uangnya hampir habis. Boleh ditambah lagi?",
    vi: "Tiền sắp hết rồi, có thể đưa thêm một ít không?",
    tl: "Paubos na ang pera. Puwede bang dagdagan?",
    th: "เงินใกล้หมดแล้ว ขอเพิ่มอีกหน่อยได้ไหม",
    en: "The money is almost gone. Could you add some more?",
  },
  {
    key: "paid-first",
    zh: "我先用自己的錢付了，已經記在 App 裡，可以還我嗎？",
    id: "Saya sudah bayar pakai uang saya sendiri dan sudah dicatat di aplikasi. Boleh diganti?",
    vi: "Tôi đã trả bằng tiền của mình và đã ghi trong ứng dụng. Có thể trả lại cho tôi không?",
    tl: "Ginamit ko ang sarili kong pera at naitala ko na sa app. Puwede bang ibalik?",
    th: "ฉันจ่ายด้วยเงินตัวเองไปก่อน บันทึกในแอปแล้ว คืนให้ได้ไหม",
    en: "I paid with my own money and recorded it in the app. Could you pay me back?",
  },
  {
    key: "no-receipt",
    zh: "這家店沒有收據，我已經在 App 裡寫了買什麼、多少錢。",
    id: "Toko ini tidak kasih struk. Saya sudah tulis di aplikasi beli apa dan berapa.",
    vi: "Cửa hàng này không có hóa đơn. Tôi đã ghi trong ứng dụng mua gì và bao nhiêu tiền.",
    tl: "Walang resibo ang tindahang ito. Isinulat ko na sa app kung ano ang binili at magkano.",
    th: "ร้านนี้ไม่มีใบเสร็จ ฉันเขียนในแอปแล้วว่าซื้ออะไร ราคาเท่าไร",
    en: "This shop gives no receipt. I wrote in the app what I bought and how much.",
  },
  {
    key: "ask-first",
    zh: "這個要買嗎？我想先問一下。",
    id: "Yang ini perlu dibeli? Saya mau tanya dulu.",
    vi: "Cái này có cần mua không? Tôi muốn hỏi trước.",
    tl: "Kailangan bang bilhin ito? Gusto ko munang magtanong.",
    th: "อันนี้ต้องซื้อไหม ฉันอยากถามก่อน",
    en: "Should I buy this? I want to ask first.",
  },
  {
    key: "weekly-check",
    zh: "可以一起看一下這星期的帳嗎？",
    id: "Boleh kita lihat catatan minggu ini sama-sama?",
    vi: "Mình cùng xem sổ chi tiêu tuần này được không?",
    tl: "Puwede ba nating tingnan nang sabay ang gastos ngayong linggo?",
    th: "เรามาดูบัญชีของสัปดาห์นี้ด้วยกันได้ไหม",
    en: "Can we look at this week's spending together?",
  },
];

export function isPhraseLang(x: string | null | undefined): x is PhraseLang {
  return !!x && (PHRASE_LANGS as readonly string[]).includes(x);
}
