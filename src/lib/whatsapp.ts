export const whatsappConfigured = !!(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_ID);
// Locally, codes are printed to the server log instead of sent. Never set WHATSAPP_DEV_LOG in production.
const devFallback = process.env.NODE_ENV !== "production" || process.env.WHATSAPP_DEV_LOG === "1";
export const whatsappEnabled = whatsappConfigured || devFallback;

/** Sends a login code through an approved WhatsApp "Authentication" template. */
export async function sendWhatsAppCode(phone: string, code: string) {
  if (!whatsappConfigured) {
    if (devFallback) {
      console.log(`[dev] WhatsApp code for ${phone}: ${code}`);
      return;
    }
    throw new Error("WhatsApp sign-in is not configured");
  }
  const res = await fetch(`https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_ID}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phone.replace(/\D/g, ""),
      type: "template",
      template: {
        name: process.env.WHATSAPP_TEMPLATE || "login_code",
        language: { code: process.env.WHATSAPP_TEMPLATE_LANG || "en" },
        components: [
          { type: "body", parameters: [{ type: "text", text: code }] },
          { type: "button", sub_type: "url", index: "0", parameters: [{ type: "text", text: code }] },
        ],
      },
    }),
  });
  if (!res.ok) throw new Error(`WhatsApp send failed: ${res.status} ${await res.text()}`);
}
