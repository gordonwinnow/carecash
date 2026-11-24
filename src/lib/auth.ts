import { betterAuth } from "better-auth";
import { getMigrations } from "better-auth/db/migration";
import { nextCookies } from "better-auth/next-js";
import { anonymous, phoneNumber } from "better-auth/plugins";
import { db } from "./db";
import { sendWhatsAppCode } from "./whatsapp";

const env = process.env;

export const providers = {
  google: !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
  apple: !!(env.APPLE_CLIENT_ID && env.APPLE_CLIENT_SECRET),
  line: !!(env.LINE_CLIENT_ID && env.LINE_CLIENT_SECRET),
};

export const auth = betterAuth({
  database: db,
  secret: env.BETTER_AUTH_SECRET || "dev-only-secret-change-me-dev-only-secret",
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: ["https://appleid.apple.com"],
  session: { expiresIn: 60 * 60 * 24 * 180, updateAge: 60 * 60 * 24 },
  emailAndPassword: { enabled: true, minPasswordLength: 6, autoSignIn: true },
  socialProviders: {
    ...(providers.google && {
      google: { clientId: env.GOOGLE_CLIENT_ID!, clientSecret: env.GOOGLE_CLIENT_SECRET!, prompt: "select_account" as const },
    }),
    ...(providers.apple && {
      apple: {
        clientId: env.APPLE_CLIENT_ID!,
        clientSecret: env.APPLE_CLIENT_SECRET!,
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
