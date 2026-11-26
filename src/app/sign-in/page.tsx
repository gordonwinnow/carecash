import { redirect } from "next/navigation";
import { providers } from "@/lib/auth";
import { getUser } from "@/lib/ctx";
import { db } from "@/lib/db";
import { whatsappEnabled } from "@/lib/whatsapp";
import { SignIn } from "./sign-in";

/**
 * `?mode=signup` (the public pages' "start free" buttons) and invite links open account creation directly,
 * and an invitee sees which family invited them instead of a bare sign-in screen.
 */
export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string; mode?: string }> }) {
  const { next, mode } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/home";
  if (await getUser()) redirect(safeNext);
  const code = safeNext.match(/^\/join\/([a-z0-9]+)$/)?.[1];
  const invite = code
    ? (db
        .prepare("select f.name as family from invite i join family f on f.id = i.family_id where i.code = ? and i.expires_at > ?")
        .get(code, Date.now()) as { family: string } | undefined)
    : undefined;
  return (
    <SignIn
      next={safeNext}
      enabled={{ ...providers, whatsapp: whatsappEnabled }}
      signUp={mode === "signup" || !!invite}
      invitedBy={invite?.family}
    />
  );
}
