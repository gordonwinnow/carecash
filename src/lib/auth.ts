import crypto from "node:crypto";
import { betterAuth } from "better-auth";
import { getMigrations } from "better-auth/db/migration";
import { nextCookies } from "better-auth/next-js";
import { anonymous, phoneNumber } from "better-auth/plugins";
import { db } from "./db";
import { sendWhatsAppCode } from "./whatsapp";

const env = process.env;

// Without a real secret anyone could forge sign-in sessions, so a running production server refuses to start.
// (`next build` also runs with NODE_ENV=production but has no secrets, so the build phase is let through.)
if (
  env.NODE_ENV === "production" &&
  env.NEXT_PHASE !== "phase-production-build" &&
  (!env.BETTER_AUTH_SECRET || env.BETTER_AUTH_SECRET.length < 32)
) {
  throw new Error("BETTER_AUTH_SECRET must be set (32+ characters) in production");
}

/**
 * Apple's client secret is a JWT signed with the Sign in with Apple key, valid at most 6 months.
 * Made here from APPLE_KEY_P8 / APPLE_KEY_ID / APPLE_TEAM_ID at startup, so it never needs renewing by hand.
 */
function appleSecret() {
  if (env.APPLE_CLIENT_SECRET) return env.APPLE_CLIENT_SECRET;
  if (!(env.APPLE_CLIENT_ID && env.APPLE_KEY_P8 && env.APPLE_KEY_ID && env.APPLE_TEAM_ID)) return "";
  const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const head = b64({ alg: "ES256", kid: env.APPLE_KEY_ID });
  const body = b64({ iss: env.APPLE_TEAM_ID, iat: now, exp: now + 150 * 86400, aud: "https://appleid.apple.com", sub: env.APPLE_CLIENT_ID });
  const key = env.APPLE_KEY_P8.replace(/\\n/g, "\n");
  const sig = crypto.sign("sha256", Buffer.from(`${head}.${body}`), { key, dsaEncoding: "ieee-p1363" }).toString("base64url");
  return `${head}.${body}.${sig}`;
}
const APPLE_SECRET = appleSecret();

export const providers = {
  google: !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
  apple: !!(env.APPLE_CLIENT_ID && APPLE_SECRET),
  line: !!(env.LINE_CLIENT_ID && env.LINE_CLIENT_SECRET),
};

export const auth = betterAuth({
  database: db,
  secret: env.BETTER_AUTH_SECRET || "dev-only-secret-change-me-dev-only-secret",
  baseURL: env.BETTER_AUTH_URL,
  // The old Fly address stays trusted while people move over to the main one
  trustedOrigins: ["https://appleid.apple.com", "https://carecash.me", "https://carecash.fly.dev"],
  session: { expiresIn: 60 * 60 * 24 * 180, updateAge: 60 * 60 * 24 },
  emailAndPassword: { enabled: true, minPasswordLength: 6, autoSignIn: true },
  socialProviders: {
    ...(providers.google && {
      google: { clientId: env.GOOGLE_CLIENT_ID!, clientSecret: env.GOOGLE_CLIENT_SECRET!, prompt: "select_account" as const },
    }),
    ...(providers.apple && {
      apple: {
        clientId: env.APPLE_CLIENT_ID!,
        clientSecret: APPLE_SECRET,
        appBundleIdentifier: env.APPLE_APP_BUNDLE_IDENTIFIER,
      },
    }),
    ...(providers.line && {
      line: {
        clientId: env.LINE_CLIENT_ID!,
        clientSecret: env.LINE_CLIENT_SECRET!,
        // LINE only shares email after a separate permission review; until then use an internal address from the LINE user ID
        mapProfileToUser: (p: { sub?: string; email?: string }) =>
          p.email ? {} : { email: `${p.sub}@line.carecash.local` },
      },
    }),
  },
  plugins: [
    phoneNumber({
      sendOTP: async ({ phoneNumber, code }) => {
        await sendWhatsAppCode(phoneNumber, code);
      },
      otpLength: 6,
      signUpOnVerification: {
        getTempEmail: (p) => `${p.replace(/\D/g, "")}@phone.carecash.local`,
        getTempName: (p) => p,
      },
    }),
    // Guest demo: a throwaway user with sample data
    anonymous({ emailDomainName: "demo.carecash.local" }),
    nextCookies(),
  ],
});

let ready: Promise<void> | null = null;
/** Creates or updates Better Auth's own tables once per process. */
export function authReady() {
  ready ??= getMigrations(auth.options).then(({ runMigrations }) => runMigrations());
  return ready;
}
