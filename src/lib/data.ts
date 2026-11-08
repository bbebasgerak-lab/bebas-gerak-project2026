import { db, type Program, type Video } from "./supabase";
import { canWatch, type AccessRow } from "./access";

// Sebelum Supabase diatur, halaman umum tetap bisa dibuka (tampil "segera hadir").
export const dbReady = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function publishedPrograms() {
  if (!dbReady()) return [];
  const { data, error } = await db().from("programs").select("*").eq("is_published", true).order("sort");
  if (error) throw error;
  return data as Program[];
}

export async function programBySlug(slug: string) {
  if (!dbReady()) return null;
  const { data, error } = await db().from("programs").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data as Program | null;
}

export async function videosOf(programId: string) {
  const { data, error } = await db().from("videos").select("*").eq("program_id", programId).order("sort");
  if (error) throw error;
  return data as Video[];
}

/** Video contoh gratis pertama, untuk beranda. */
export async function firstPreview() {
  if (!dbReady()) return null;
  const { data } = await db()
    .from("videos").select("*, programs!inner(is_published)").eq("is_preview", true).eq("programs.is_published", true)
    .order("sort").limit(1).maybeSingle();
  return data as Video | null;
}

export async function accessRows(userId: string): Promise<AccessRow[]> {
  const { data, error } = await db().from("access").select("program_id, expires_at, programs(kind)").eq("user_id", userId);
  if (error) throw error;
  return (data ?? []).map((r) => ({
    program_id: r.program_id,
    expires_at: r.expires_at,
    kind: (r.programs as unknown as { kind: string } | null)?.kind ?? "program",
  }));
}

export async function userCanWatch(userId: string, programId: string) {
  return canWatch(await accessRows(userId), programId, new Date());
}

export const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export const accessLabel = (p: Pick<Program, "access_days">) =>
  p.access_days == null ? "Akses selamanya" : p.access_days >= 365 && p.access_days % 365 === 0
    ? `Akses ${p.access_days / 365} tahun`
    : `Akses ${p.access_days} hari`;
