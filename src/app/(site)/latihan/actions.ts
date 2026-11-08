"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/supabase";
import { userCanWatch } from "@/lib/data";

export async function toggleDone(formData: FormData) {
  const viewer = await requireUser();
  const videoId = String(formData.get("videoId"));
  const supabase = db();
  const { data: video } = await supabase.from("videos").select("program_id, programs(slug)").eq("id", videoId).maybeSingle();
  if (!video || !(await userCanWatch(viewer.id, video.program_id))) return;

  if (formData.get("done") === "1") {
    await supabase.from("progress").delete().eq("user_id", viewer.id).eq("video_id", videoId);
  } else {
    await supabase.from("progress").upsert({ user_id: viewer.id, video_id: videoId });
  }
  revalidatePath(`/latihan/${(video.programs as unknown as { slug: string }).slug}`);
}
