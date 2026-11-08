import type { Video } from "./supabase";
import { youtubeId } from "./youtube";

// Satu-satunya tempat yang tahu video disimpan di mana.
// Pindah ke Bunny Stream: isi BUNNY_LIBRARY_ID + BUNNY_TOKEN_KEY, lalu ganti provider video jadi "bunny" di admin.
export function playbackUrl(video: Pick<Video, "provider" | "video_ref">): string | null {
  if (video.provider === "youtube") {
    const id = youtubeId(video.video_ref);
    return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1` : null;
  }
  // shortcut: Bunny belum diaktifkan (link bertanda tangan + kedaluwarsa), aktifkan saat budget video disetujui.
  return null;
}
