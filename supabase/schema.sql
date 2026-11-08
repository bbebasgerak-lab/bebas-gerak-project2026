-- Jalankan sekali di Supabase: SQL Editor -> New query -> tempel semua -> Run.

create table if not exists programs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  tagline text,
  description text,
  kind text not null default 'program' check (kind in ('program', 'membership')),
  price integer not null check (price > 0),          -- rupiah
  access_days integer check (access_days > 0),       -- null = akses selamanya
  level text,
  is_published boolean not null default false,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs on delete cascade,
  title text not null,
  description text,
  duration_min integer,
  provider text not null default 'youtube' check (provider in ('youtube', 'bunny')),
  video_ref text not null,                           -- ID YouTube / ID video Bunny
  is_preview boolean not null default false,         -- true = bisa ditonton gratis
  sort integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key,                               -- order_id yang dikirim ke Midtrans
  user_id text not null,                             -- user ID Clerk
  email text,
  program_id uuid not null references programs,
  amount integer not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  payment_type text,
  raw jsonb,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists access (
  user_id text not null,
  program_id uuid not null references programs on delete cascade,
  email text,
  expires_at timestamptz,                            -- null = selamanya
  source text not null default 'purchase' check (source in ('purchase', 'manual')),
  granted_at timestamptz not null default now(),
  primary key (user_id, program_id)
);

create table if not exists progress (
  user_id text not null,
  video_id uuid not null references videos on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, video_id)
);

-- Kunci semua tabel. Web hanya mengakses lewat server (service role key),
-- jadi tanpa policy apa pun, kunci publik (anon) tidak bisa membaca/menulis.
alter table programs enable row level security;
alter table videos enable row level security;
alter table orders enable row level security;
alter table access enable row level security;
alter table progress enable row level security;

-- Contoh data awal (boleh diubah/dihapus dari panel admin).
insert into programs (slug, title, tagline, description, kind, price, access_days, level, is_published, sort) values
  ('mulai-bergerak', 'Mulai Bergerak', 'Program pemula 14 hari dari kursi',
   'Latihan duduk yang ringan untuk membangun kebiasaan bergerak. Cocok untuk yang baru mulai atau lama tidak berolahraga.',
   'program', 149000, null, 'Pemula', true, 1),
  ('keseimbangan-15-hari', 'Keseimbangan 15 Hari', 'Lebih stabil, lebih percaya diri',
   'Latihan terarah untuk memperbaiki keseimbangan dan mengurangi risiko jatuh, dengan pegangan kursi untuk keamanan.',
   'program', 199000, null, 'Semua level', true, 2),
  ('member-bugar', 'Member Bugar', 'Semua program, satu tahun penuh',
   'Akses ke semua program dan video baru selama satu tahun, plus bantuan langsung lewat WhatsApp.',
   'membership', 599000, 365, 'Semua level', true, 3)
on conflict (slug) do nothing;
