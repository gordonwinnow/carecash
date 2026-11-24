import { redirect } from "next/navigation";
import { getCtx } from "@/lib/ctx";

export default async function Root() {
  const { user, me } = await getCtx();
  if (!user) redirect("/sign-in");
  redirect(me ? "/home" : "/start");
}
