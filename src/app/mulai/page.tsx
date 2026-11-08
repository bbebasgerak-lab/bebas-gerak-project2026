import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

// Tujuan setelah login: admin -> panel admin, member -> latihan.
export default async function AfterLogin() {
  const viewer = await requireUser();
  redirect(viewer.isAdmin ? "/admin" : "/latihan");
}
