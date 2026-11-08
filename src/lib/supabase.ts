import { createClient } from "@supabase/supabase-js";

// Hanya dipakai di server. Service role key melewati RLS, jadi jangan pernah diimpor dari komponen "use client".
export const db = () =>
  createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });

export type Program = {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  kind: "program" | "membership";
  price: number;
  access_days: number | null;
  level: string | null;
  is_published: boolean;
  sort: number;
};

export type Video = {
  id: string;
  program_id: string;
  title: string;
  description: string | null;
  duration_min: number | null;
  provider: "youtube" | "bunny";
  video_ref: string;
  is_preview: boolean;
  sort: number;
};

export type Order = {
  id: string;
  user_id: string;
  email: string | null;
  program_id: string;
  amount: number;
  status: "pending" | "paid" | "failed";
  payment_type: string | null;
  created_at: string;
  paid_at: string | null;
};
