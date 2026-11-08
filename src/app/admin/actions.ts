"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";
import { requireAdmin } from "@/lib/auth";
import { db, type Program } from "@/lib/supabase";
import { grantAccess } from "@/lib/payment";
import { youtubeId } from "@/lib/youtube";

const text = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const intOrNull = (fd: FormData, k: string) => (text(fd, k) ? Math.round(Number(text(fd, k))) : null);

export async function saveProgram(fd: FormData) {
  await requireAdmin();
  const id = text(fd, "id");
  const row = {
    slug: text(fd, "slug").toLowerCase(),
    title: text(fd, "title"),
    tagline: text(fd, "tagline") || null,
    description: text(fd, "description") || null,
    kind: text(fd, "kind") === "membership" ? "membership" : "program",
    price: intOrNull(fd, "price"),
    access_days: intOrNull(fd, "access_days"),
    level: text(fd, "level") || null,
    sort: intOrNull(fd, "sort") ?? 0,
    is_published: fd.get("is_published") === "on",
  };
  if (!row.title) return { error: "Judul wajib diisi." };
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(row.slug)) return { error: "Alamat halaman hanya boleh huruf kecil, angka, dan tanda minus. Contoh: mulai-bergerak" };
  if (!row.price || row.price < 1000) return { error: "Harga minimal Rp1.000." };
  if (row.access_days != null && row.access_days < 1) return { error: "Lama akses minimal 1 hari, atau kosongkan untuk selamanya." };

  const supabase = db();
  const { data, error } = id
    ? await supabase.from("programs").update(row).eq("id", id).select("id").single()
    : await supabase.from("programs").insert(row).select("id").single();
  if (error) return { error: error.code === "23505" ? "Alamat halaman sudah dipakai program lain." : error.message };
  revalidatePath("/", "layout");
  if (!id) redirect(`/admin/program/${data.id}`);
}

export async function saveVideo(fd: FormData) {
  await requireAdmin();
  const provider = text(fd, "provider") === "bunny" ? "bunny" : "youtube";
  let ref = text(fd, "video_ref");
  if (provider === "youtube") {
    const yt = youtubeId(ref);
    if (!yt) return { error: "Link YouTube tidak dikenali. Tempel link seperti https://youtu.be/xxxxxxxxxxx" };
    ref = yt;
  }
  if (!text(fd, "title")) return { error: "Judul video wajib diisi." };
  const row = {
    program_id: text(fd, "program_id"),
    title: text(fd, "title"),
    description: text(fd, "description") || null,
    duration_min: intOrNull(fd, "duration_min"),
    provider,
    video_ref: ref,
    is_preview: fd.get("is_preview") === "on",
    sort: intOrNull(fd, "sort") ?? 0,
  };
  const id = text(fd, "id");
  const supabase = db();
  const { error } = id ? await supabase.from("videos").update(row).eq("id", id) : await supabase.from("videos").insert(row);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
}

export async function deleteVideo(fd: FormData) {
  await requireAdmin();
  const { error } = await db().from("videos").delete().eq("id", text(fd, "id"));
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
}

export async function grantManual(fd: FormData) {
  await requireAdmin();
  const email = text(fd, "email").toLowerCase();
  const { data: program } = await db().from("programs").select("*").eq("id", text(fd, "program_id")).maybeSingle<Program>();
  if (!program) return { error: "Pilih program dulu." };
  const { data: users } = await (await clerkClient()).users.getUserList({ emailAddress: [email] });
  if (!users.length) return { error: `Belum ada akun dengan email ${email}. Minta orangnya daftar dulu di website.` };
  await grantAccess(users[0].id, email, program, "manual");
  revalidatePath("/admin/member");
}

export async function revokeAccess(fd: FormData) {
  await requireAdmin();
  const { error } = await db().from("access").delete().eq("user_id", text(fd, "user_id")).eq("program_id", text(fd, "program_id"));
  if (error) return { error: error.message };
  revalidatePath("/admin/member");
}
