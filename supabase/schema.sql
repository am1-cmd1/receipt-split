-- ReceiptSplit Database Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase Auth users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  trial_ends_at timestamptz default (now() + interval '48 hours'),
  is_pro boolean default false,
  created_at timestamptz default now()
);

-- Receipts table
create table receipts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  image_url text,
  ocr_result jsonb,
  total_amount numeric(10,2),
  created_at timestamptz default now()
);

-- Splits table
create table splits (
  id uuid default uuid_generate_v4() primary key,
  receipt_id uuid references receipts(id) on delete cascade not null,
  person_name text not null,
  items jsonb,
  amount numeric(10,2),
  tip_share numeric(10,2),
  tax_share numeric(10,2),
  total numeric(10,2),
  created_at timestamptz default now()
);

-- RLS policies
alter table profiles enable row level security;
alter table receipts enable row level security;
alter table splits enable row level security;

create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

create policy "Users can view own receipts" on receipts for select using (auth.uid() = user_id);
create policy "Users can insert own receipts" on receipts for insert with check (auth.uid() = user_id);
create policy "Users can delete own receipts" on receipts for delete using (auth.uid() = user_id);

create policy "Users can view splits for own receipts" on splits for select
  using (receipt_id in (select id from receipts where user_id = auth.uid()));
create policy "Users can insert splits for own receipts" on splits for insert
  with check (receipt_id in (select id from receipts where user_id = auth.uid()));
create policy "Users can delete splits for own receipts" on splits for delete
  using (receipt_id in (select id from receipts where user_id = auth.uid()));

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage bucket (run via Supabase dashboard or API)
-- insert into storage.buckets (id, name, public) values ('receipt-images', 'receipt-images', true);
