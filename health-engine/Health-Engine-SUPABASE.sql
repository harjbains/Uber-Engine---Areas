-- Health Engine — Supabase schema
-- Designed to coexist with Map Engine in the same Supabase project.
-- All application tables are prefixed health_.
-- Run in Supabase SQL Editor after reviewing against the target project.
-- This script does not modify any uber_* tables.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Utility trigger
-- ---------------------------------------------------------------------------

create or replace function public.health_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Settings
-- ---------------------------------------------------------------------------

create table if not exists public.health_settings (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  weekly_strength_goal integer not null default 3 check (weekly_strength_goal >= 0),
  weekly_cardio_goal integer not null default 3 check (weekly_cardio_goal >= 0),
  weekly_mobility_goal integer not null default 3 check (weekly_mobility_goal >= 0),
  sound_enabled boolean not null default true,
  celebrations_enabled boolean not null default true,
  weight_unit text not null default 'kg' check (weight_unit in ('kg')),
  distance_unit text not null default 'km' check (distance_unit in ('km')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Strength configuration
-- ---------------------------------------------------------------------------

create table if not exists public.health_strength_exercises (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  display_order integer not null check (display_order > 0),
  sets integer not null default 3 check (sets > 0),
  rep_min integer not null default 8 check (rep_min > 0),
  rep_max integer not null default 12 check (rep_max >= rep_min),
  current_weight_kg numeric(7,2) not null default 0 check (current_weight_kg >= 0),
  progression_increment_kg numeric(7,2) not null default 1 check (progression_increment_kg > 0),
  rest_seconds integer not null default 90 check (rest_seconds >= 0),
  image_path text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, name),
  unique (owner_id, display_order)
);

-- ---------------------------------------------------------------------------
-- Strength sessions and actual sets
-- ---------------------------------------------------------------------------

create table if not exists public.health_strength_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'in_progress'
    check (status in ('in_progress', 'completed', 'ended_early')),
  elapsed_seconds integer check (elapsed_seconds is null or elapsed_seconds >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (completed_at is null or completed_at >= started_at)
);

create table if not exists public.health_strength_sets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null references public.health_strength_sessions(id) on delete cascade,
  exercise_id uuid references public.health_strength_exercises(id) on delete set null,

  -- Snapshot fields preserve history if Admin configuration later changes.
  exercise_name text not null,
  exercise_order integer not null check (exercise_order > 0),
  set_number integer not null check (set_number > 0),
  prescribed_rep_min integer not null check (prescribed_rep_min > 0),
  prescribed_rep_max integer not null check (prescribed_rep_max >= prescribed_rep_min),
  prescribed_weight_kg numeric(7,2) not null check (prescribed_weight_kg >= 0),
  progression_increment_kg numeric(7,2) not null check (progression_increment_kg > 0),
  reps_completed integer not null check (reps_completed >= 0),
  actual_weight_kg numeric(7,2) not null check (actual_weight_kg >= 0),
  completed_at timestamptz not null default now(),

  unique (session_id, exercise_order, set_number)
);

-- Records the user's explicit ACCEPT/STAY decision.
create table if not exists public.health_strength_progression_events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null references public.health_strength_sessions(id) on delete cascade,
  exercise_id uuid references public.health_strength_exercises(id) on delete set null,
  exercise_name text not null,
  previous_weight_kg numeric(7,2) not null check (previous_weight_kg >= 0),
  recommended_weight_kg numeric(7,2) not null check (recommended_weight_kg >= 0),
  decision text not null check (decision in ('accepted', 'stayed')),
  decided_at timestamptz not null default now(),
  unique (session_id, exercise_id)
);

-- ---------------------------------------------------------------------------
-- Cardio — one treadmill
-- ---------------------------------------------------------------------------

create table if not exists public.health_cardio_settings (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  default_duration_minutes numeric(6,2) check (default_duration_minutes is null or default_duration_minutes >= 0),
  default_speed_kmh numeric(5,2) check (default_speed_kmh is null or default_speed_kmh >= 0),
  default_incline_percent numeric(5,2) check (default_incline_percent is null or default_incline_percent >= 0),
  default_distance_km numeric(7,2) check (default_distance_km is null or default_distance_km >= 0),
  image_path text,
  updated_at timestamptz not null default now()
);

create table if not exists public.health_cardio_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  performed_at timestamptz not null default now(),
  duration_minutes numeric(6,2) not null check (duration_minutes > 0),
  speed_kmh numeric(5,2) not null check (speed_kmh >= 0),
  incline_percent numeric(5,2) not null check (incline_percent >= 0),
  distance_km numeric(7,2) not null check (distance_km >= 0),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Mobility configuration and results
-- ---------------------------------------------------------------------------

create table if not exists public.health_mobility_exercises (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  display_order integer not null check (display_order > 0),
  measurement_type text not null check (measurement_type in ('TIME', 'REPS')),
  target_value integer not null check (target_value > 0),
  sets integer not null default 1 check (sets > 0),
  rest_seconds integer not null default 0 check (rest_seconds >= 0),
  per_side boolean not null default false,
  image_path text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, name),
  unique (owner_id, display_order)
);

create table if not exists public.health_mobility_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'in_progress'
    check (status in ('in_progress', 'completed', 'ended_early')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (completed_at is null or completed_at >= started_at)
);

create table if not exists public.health_mobility_results (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null references public.health_mobility_sessions(id) on delete cascade,
  exercise_id uuid references public.health_mobility_exercises(id) on delete set null,

  -- Snapshot fields
  exercise_name text not null,
  exercise_order integer not null check (exercise_order > 0),
  measurement_type text not null check (measurement_type in ('TIME', 'REPS')),
  target_value integer not null check (target_value > 0),
  set_number integer not null check (set_number > 0),
  side text not null default 'NONE' check (side in ('NONE', 'LEFT', 'RIGHT')),
  actual_value integer not null check (actual_value >= 0),
  feedback text check (feedback is null or feedback in ('KEEP', 'UNSURE', 'DROP')),
  completed_at timestamptz not null default now(),

  unique (session_id, exercise_order, set_number, side)
);

-- ---------------------------------------------------------------------------
-- Achievements
-- ---------------------------------------------------------------------------

create table if not exists public.health_achievements (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text not null,
  category text not null check (category in ('GENERAL', 'STRENGTH', 'CARDIO', 'MOBILITY')),
  icon_path text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.health_achievement_awards (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  achievement_id uuid not null references public.health_achievements(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  context jsonb not null default '{}'::jsonb
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index if not exists health_strength_exercises_owner_active_order_idx
  on public.health_strength_exercises(owner_id, is_active, display_order);

create index if not exists health_strength_sessions_owner_started_idx
  on public.health_strength_sessions(owner_id, started_at desc);

create index if not exists health_strength_sets_session_order_idx
  on public.health_strength_sets(session_id, exercise_order, set_number);

create index if not exists health_strength_sets_owner_completed_idx
  on public.health_strength_sets(owner_id, completed_at desc);

create index if not exists health_strength_progression_owner_decided_idx
  on public.health_strength_progression_events(owner_id, decided_at desc);

create index if not exists health_cardio_sessions_owner_performed_idx
  on public.health_cardio_sessions(owner_id, performed_at desc);

create index if not exists health_mobility_exercises_owner_active_order_idx
  on public.health_mobility_exercises(owner_id, is_active, display_order);

create index if not exists health_mobility_sessions_owner_started_idx
  on public.health_mobility_sessions(owner_id, started_at desc);

create index if not exists health_mobility_results_session_order_idx
  on public.health_mobility_results(session_id, exercise_order, set_number);

create index if not exists health_mobility_results_owner_completed_idx
  on public.health_mobility_results(owner_id, completed_at desc);

create index if not exists health_achievement_awards_owner_awarded_idx
  on public.health_achievement_awards(owner_id, awarded_at desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

drop trigger if exists health_settings_updated_at on public.health_settings;
create trigger health_settings_updated_at
before update on public.health_settings
for each row execute function public.health_set_updated_at();

drop trigger if exists health_strength_exercises_updated_at on public.health_strength_exercises;
create trigger health_strength_exercises_updated_at
before update on public.health_strength_exercises
for each row execute function public.health_set_updated_at();

drop trigger if exists health_strength_sessions_updated_at on public.health_strength_sessions;
create trigger health_strength_sessions_updated_at
before update on public.health_strength_sessions
for each row execute function public.health_set_updated_at();

drop trigger if exists health_cardio_settings_updated_at on public.health_cardio_settings;
create trigger health_cardio_settings_updated_at
before update on public.health_cardio_settings
for each row execute function public.health_set_updated_at();

drop trigger if exists health_mobility_exercises_updated_at on public.health_mobility_exercises;
create trigger health_mobility_exercises_updated_at
before update on public.health_mobility_exercises
for each row execute function public.health_set_updated_at();

drop trigger if exists health_mobility_sessions_updated_at on public.health_mobility_sessions;
create trigger health_mobility_sessions_updated_at
before update on public.health_mobility_sessions
for each row execute function public.health_set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.health_settings enable row level security;
alter table public.health_strength_exercises enable row level security;
alter table public.health_strength_sessions enable row level security;
alter table public.health_strength_sets enable row level security;
alter table public.health_strength_progression_events enable row level security;
alter table public.health_cardio_settings enable row level security;
alter table public.health_cardio_sessions enable row level security;
alter table public.health_mobility_exercises enable row level security;
alter table public.health_mobility_sessions enable row level security;
alter table public.health_mobility_results enable row level security;
alter table public.health_achievements enable row level security;
alter table public.health_achievement_awards enable row level security;

-- User-owned tables: authenticated user can operate only on their own rows.

create policy "health_settings_owner_all"
on public.health_settings for all
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "health_strength_exercises_owner_all"
on public.health_strength_exercises for all
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "health_strength_sessions_owner_all"
on public.health_strength_sessions for all
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "health_strength_sets_owner_all"
on public.health_strength_sets for all
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "health_strength_progression_owner_all"
on public.health_strength_progression_events for all
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "health_cardio_settings_owner_all"
on public.health_cardio_settings for all
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "health_cardio_sessions_owner_all"
on public.health_cardio_sessions for all
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "health_mobility_exercises_owner_all"
on public.health_mobility_exercises for all
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "health_mobility_sessions_owner_all"
on public.health_mobility_sessions for all
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "health_mobility_results_owner_all"
on public.health_mobility_results for all
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "health_achievement_awards_owner_all"
on public.health_achievement_awards for all
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

-- Achievement definitions are global/read-only to normal authenticated clients.
create policy "health_achievements_authenticated_read"
on public.health_achievements for select
to authenticated
using (true);

-- ---------------------------------------------------------------------------
-- Optional starter achievement definitions.
-- Safe to rerun because code is unique.
-- ---------------------------------------------------------------------------

insert into public.health_achievements (code, name, description, category)
values
  ('FIRST_STRENGTH', 'First Strength Workout', 'Complete your first Strength session.', 'STRENGTH'),
  ('FIRST_CARDIO', 'First Cardio Session', 'Record your first treadmill session.', 'CARDIO'),
  ('FIRST_MOBILITY', 'First Mobility Session', 'Complete your first Mobility session.', 'MOBILITY'),
  ('STRENGTH_PROGRESSION', 'Progression Earned', 'Earn and accept a Strength weight progression.', 'STRENGTH')
on conflict (code) do nothing;

-- End of Health Engine schema.
