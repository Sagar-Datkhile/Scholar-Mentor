-- Auth: Using Supabase Auth built-in users table (auth.users)
-- App tables reference auth.users via user_id UUID

-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role text check (role in ('student','alumni','admin')) not null default 'student',
  branch text,
  year int,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles (email);

-- Blogs
create table if not exists public.blogs (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blogs_author_idx on public.blogs (author_id);

-- Discussions Rooms
create table if not exists public.rooms (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  is_private boolean not null default false,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Room Members
create table if not exists public.room_members (
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('member','moderator','owner')),
  joined_at timestamptz not null default now(),
  primary key (room_id, user_id)
);

-- Messages
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_room_idx on public.messages (room_id, created_at);

-- Content moderation flags
create table if not exists public.flags (
  id uuid primary key default uuid_generate_v4(),
  target_type text not null check (target_type in ('blog','message')),
  target_id uuid not null,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text,
  status text not null default 'open' check (status in ('open','reviewing','closed')),
  created_at timestamptz not null default now()
);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.blogs enable row level security;
alter table public.rooms enable row level security;
alter table public.room_members enable row level security;
alter table public.messages enable row level security;
alter table public.flags enable row level security;

-- Profiles policies
create policy "Public read profiles" on public.profiles
  for select using (true);
create policy "User manage own profile" on public.profiles
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Blogs policies
create policy "Read published blogs or own drafts" on public.blogs
  for select using (is_published or author_id = auth.uid());
create policy "Insert own blogs" on public.blogs
  for insert with check (author_id = auth.uid());
create policy "Update own blogs" on public.blogs
  for update using (author_id = auth.uid());
create policy "Delete own blogs" on public.blogs
  for delete using (author_id = auth.uid());

-- Rooms policies
create policy "Read public rooms or where member" on public.rooms
  for select using (
    not is_private or exists (
      select 1 from public.room_members m
      where m.room_id = id and m.user_id = auth.uid()
    )
  );
create policy "Create room" on public.rooms
  for insert with check (owner_id = auth.uid());
create policy "Owner manage room" on public.rooms
  for update using (owner_id = auth.uid());
create policy "Owner delete room" on public.rooms
  for delete using (owner_id = auth.uid());

-- Room members policies
create policy "Read members where room visible" on public.room_members
  for select using (
    exists (
      select 1 from public.rooms r
      where r.id = room_id and (
        not r.is_private or exists (
          select 1 from public.room_members m where m.room_id = r.id and m.user_id = auth.uid()
        )
      )
    )
  );
create policy "Join room self" on public.room_members
  for insert with check (user_id = auth.uid());
create policy "Leave room self" on public.room_members
  for delete using (user_id = auth.uid());

-- Messages policies
create policy "Read messages where room visible" on public.messages
  for select using (
    exists (
      select 1 from public.rooms r
      left join public.room_members m on m.room_id = r.id and m.user_id = auth.uid()
      where r.id = room_id and (not r.is_private or m.user_id is not null)
    )
  );
create policy "Post message when member or public room" on public.messages
  for insert with check (
    author_id = auth.uid() and exists (
      select 1 from public.rooms r
      left join public.room_members m on m.room_id = r.id and m.user_id = auth.uid()
      where r.id = room_id and (not r.is_private or m.user_id is not null)
    )
  );
create policy "Delete own messages" on public.messages
  for delete using (author_id = auth.uid());

-- Flags policies
create policy "Users can create flags" on public.flags
  for insert with check (reporter_id = auth.uid());
create policy "Read own flags or admin" on public.flags
  for select using (reporter_id = auth.uid());

-- Triggers to update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

create trigger blogs_set_updated_at
before update on public.blogs
for each row execute procedure public.set_updated_at();
