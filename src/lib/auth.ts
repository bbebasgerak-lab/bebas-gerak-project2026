import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Admin = user Clerk dengan Public metadata {"role": "admin"} (diatur di dashboard Clerk).
export async function getViewer() {
  const user = await currentUser();
  if (!user) return null;
  return {
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress ?? null,
    name: user.firstName ?? user.primaryEmailAddress?.emailAddress ?? "Member",
    isAdmin: user.publicMetadata?.role === "admin",
  };
}

export async function requireUser() {
  const viewer = await getViewer();
  if (!viewer) (await auth()).redirectToSignIn();
  return viewer!;
}

export async function requireAdmin() {
  const viewer = await requireUser();
  if (!viewer.isAdmin) redirect("/latihan");
  return viewer;
}
