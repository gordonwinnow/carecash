import { redirect } from "next/navigation";
import { providers } from "@/lib/auth";
import { getUser } from "@/lib/ctx";
import { whatsappEnabled } from "@/lib/whatsapp";
import { SignIn } from "./sign-in";

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/home";
  if (await getUser()) redirect(safeNext);
  return <SignIn next={safeNext} enabled={{ ...providers, whatsapp: whatsappEnabled }} />;
}
