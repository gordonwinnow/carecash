import crypto from "node:crypto";
import http2 from "node:http2";
import * as webpush from "web-push";
import { db } from "./db";

/**
 * Sends notifications to a person's devices.
 * - Browsers and the iPhone home-screen app: Web Push, with the VAPID_* keys.
 * - The App Store app: Apple Push (APNs), with an APNs auth key (APNS_* keys). Off until those are set.
 */
const env = process.env;
export const webPushReady = !!(env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY);
const apnsReady = !!(env.APNS_KEY_P8 && env.APNS_KEY_ID && env.APNS_TEAM_ID);

if (webPushReady) webpush.setVapidDetails(env.VAPID_SUBJECT || "https://carecash.me", env.VAPID_PUBLIC_KEY!, env.VAPID_PRIVATE_KEY!);

export type Sub = { id: string; kind: "web" | "apns"; endpoint: string; keys: string | null; lang: string };
export type Message = { title: string; body: string; url: string };

export function subsOf(userId: string) {
  return db.prepare("select id, kind, endpoint, keys, lang from push_sub where user_id = ?").all(userId) as Sub[];
}
function drop(id: string) {
  db.prepare("delete from push_sub where id = ?").run(id);
}

export async function send(sub: Sub, msg: Message) {
  try {
    if (sub.kind === "web" && webPushReady) {
      await webpush.sendNotification({ endpoint: sub.endpoint, keys: JSON.parse(sub.keys ?? "{}") }, JSON.stringify(msg), { TTL: 24 * 3600 });
    } else if (sub.kind === "apns" && apnsReady) {
      const status = await sendApns(sub.endpoint, msg);
      if (status === 410 || status === 400) drop(sub.id); // app removed or token no longer valid
    }
  } catch (e) {
    const code = (e as { statusCode?: number }).statusCode;
    if (code === 404 || code === 410) drop(sub.id); // the browser unsubscribed
    else console.error("push failed", sub.kind, code ?? e);
  }
}

// ---------- APNs ----------

let jwtCache: { token: string; at: number } | null = null;
/** APNs wants an ES256 token signed with the .p8 key, refreshed at most hourly. */
function apnsJwt() {
  if (jwtCache && Date.now() - jwtCache.at < 50 * 60 * 1000) return jwtCache.token;
  const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const head = b64({ alg: "ES256", kid: env.APNS_KEY_ID });
  const claims = b64({ iss: env.APNS_TEAM_ID, iat: Math.floor(Date.now() / 1000) });
  const key = env.APNS_KEY_P8!.replace(/\\n/g, "\n");
  const sig = crypto.sign("sha256", Buffer.from(`${head}.${claims}`), { key, dsaEncoding: "ieee-p1363" }).toString("base64url");
  jwtCache = { token: `${head}.${claims}.${sig}`, at: Date.now() };
  return jwtCache.token;
}

function sendApns(token: string, msg: Message) {
  const host = env.APNS_SANDBOX === "1" ? "https://api.sandbox.push.apple.com" : "https://api.push.apple.com";
  return new Promise<number>((resolve, reject) => {
    const client = http2.connect(host);
    client.on("error", reject);
    const req = client.request({
      ":method": "POST",
      ":path": `/3/device/${token}`,
      authorization: `bearer ${apnsJwt()}`,
      "apns-topic": env.APNS_TOPIC || "app.carecash.ios",
      "apns-push-type": "alert",
      "content-type": "application/json",
    });
    let status = 0;
    req.on("response", (h) => (status = Number(h[":status"])));
    req.on("data", () => {});
    req.on("end", () => {
      client.close();
      resolve(status);
    });
    req.on("error", (e) => {
      client.close();
      reject(e);
    });
    req.end(JSON.stringify({ aps: { alert: { title: msg.title, body: msg.body }, sound: "default" }, url: msg.url }));
  });
}
