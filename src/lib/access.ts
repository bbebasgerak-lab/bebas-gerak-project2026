// Aturan akses. Sengaja tanpa import supaya bisa dites langsung (npm test).

const DAY = 86_400_000;

/** Tanggal habis akses baru. null = selamanya. Masih aktif -> diperpanjang dari tanggal habisnya. */
export function computeExpiry(current: Date | null, accessDays: number | null, now: Date): Date | null {
  if (accessDays == null) return null;
  const start = current && current > now ? current : now;
  return new Date(start.getTime() + accessDays * DAY);
}

export type AccessRow = { program_id: string; kind: string; expires_at: string | null };

export function isActive(row: Pick<AccessRow, "expires_at">, now: Date) {
  return row.expires_at == null || new Date(row.expires_at) > now;
}

/** Boleh nonton program ini? Punya akses program-nya, atau membership yang masih aktif. */
export function canWatch(rows: AccessRow[], programId: string, now: Date) {
  return rows.some((r) => isActive(r, now) && (r.program_id === programId || r.kind === "membership"));
}
