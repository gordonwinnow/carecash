import "server-only";
import fs from "node:fs";
import path from "node:path";
import { AwsClient } from "aws4fetch";
import { newId, UPLOAD_DIR } from "./db";

/**
 * Receipt photos live on the Fly volume (UPLOAD_DIR) and, when a bucket is set up
 * (`flyctl storage create` sets these secrets), a copy goes to that bucket too.
 * Photos never change once saved, so copying each one once is a full backup.
 */
const env = process.env;
const bucket = env.BUCKET_NAME && env.AWS_ENDPOINT_URL_S3 && env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
  ? {
      base: `${env.AWS_ENDPOINT_URL_S3.replace(/\/$/, "")}/${env.BUCKET_NAME}/photos/`,
      client: new AwsClient({
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        service: "s3",
        region: env.AWS_REGION || "auto",
      }),
    }
  : null;

/** The real type of an image, read from its first bytes; null when it is not an image we accept. */
export function imageType(b: Uint8Array): string | null {
  const at = (i: number, s: string) => [...s].every((c, k) => b[i + k] === c.charCodeAt(0));
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x89 && at(1, "PNG")) return "image/png";
  if (at(0, "RIFF") && at(8, "WEBP")) return "image/webp";
  if (at(4, "ftyp") && ["heic", "heix", "mif1", "msf1", "avif"].some((t) => at(8, t))) return at(8, "avif") ? "image/avif" : "image/heic";
  return null;
}

async function upload(name: string, buf: Uint8Array<ArrayBuffer>) {
  if (!bucket) return;
  const res = await bucket.client.fetch(bucket.base + name, {
    method: "PUT",
    body: buf,
    // Tigris requires the size up front (411 otherwise)
    headers: { "Content-Length": String(buf.byteLength), "Content-Type": "application/octet-stream" },
  });
  if (!res.ok) throw new Error(`Photo backup failed: ${res.status}`);
}

/** Saves the photo in a form, after checking it really is an image. Returns its file name, or null if there is none. */
export async function savePhoto(fd: FormData) {
  const f = fd.get("photo");
  if (!(f instanceof File) || f.size === 0) return null;
  if (f.size > 9 * 1024 * 1024) throw new Error("Bad photo");
  const buf = new Uint8Array(await f.arrayBuffer());
  if (!imageType(buf)) throw new Error("Bad photo");
  // Names stay *.jpg (older links use that); the real type is read again when the photo is served
  const name = `${newId()}.jpg`;
  await fs.promises.writeFile(path.join(UPLOAD_DIR, name), buf);
  upload(name, buf).catch((e) => console.error(e));
  return name;
}

/** Reads a photo from the volume, or from the bucket when the volume lost it (then keeps a copy on the volume again). */
export async function readPhoto(name: string): Promise<Uint8Array<ArrayBuffer> | null> {
  const file = path.join(UPLOAD_DIR, name);
  try {
    return new Uint8Array(await fs.promises.readFile(file));
  } catch {
    if (!bucket) return null;
    const res = await bucket.client.fetch(bucket.base + name);
    if (!res.ok) return null;
    const buf = new Uint8Array(await res.arrayBuffer());
    await fs.promises.writeFile(file, buf).catch(() => {});
    return buf;
  }
}

/** Copies photos saved before the bucket existed (or whose copy failed). Runs once per server start. */
async function backfill() {
  if (!bucket) return;
  const have = new Set<string>();
  let token = "";
  do {
    const url = `${bucket.base.replace(/photos\/$/, "")}?list-type=2&prefix=photos/${token ? `&continuation-token=${encodeURIComponent(token)}` : ""}`;
    const res = await bucket.client.fetch(url);
    if (!res.ok) throw new Error(`Photo list failed: ${res.status}`);
    const xml = await res.text();
    for (const m of xml.matchAll(/<Key>photos\/([^<]+)<\/Key>/g)) have.add(m[1]);
    token = /<IsTruncated>true<\/IsTruncated>/.test(xml) ? (xml.match(/<NextContinuationToken>([^<]+)</)?.[1] ?? "") : "";
  } while (token);
  let n = 0;
  for (const name of await fs.promises.readdir(UPLOAD_DIR)) {
    if (have.has(name)) continue;
    await upload(name, new Uint8Array(await fs.promises.readFile(path.join(UPLOAD_DIR, name))));
    n++;
  }
  if (n) console.log(`Backed up ${n} photo(s) to the bucket`);
}

const g = globalThis as unknown as { __photoBackfill?: Promise<void> };
if (bucket && env.NEXT_PHASE !== "phase-production-build") {
  g.__photoBackfill ??= backfill().catch((e) => console.error(e));
}
