-- PCBuilders Supabase schema and access policies.
-- Create the Storage bucket named product-images in the Supabase Dashboard first,
-- set it to PUBLIC, and set the file size limit to 50 MB.
-- Then run this whole file in SQL Editor.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  price numeric(12, 2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  category text not null default 'Other',
  description text not null default '',
  specifications jsonb not null default '{}'::jsonb,
  image_url text not null,
  image_path text,
  deal_label text not null default '',
  is_top_item boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_active_created_idx
  on public.products (active, created_at desc);
create index if not exists products_top_items_idx
  on public.products (is_top_item) where is_top_item = true;

-- Only UUIDs inserted by the project owner in this table will have admin access.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.admin_users enable row level security;

revoke all on table public.products from anon, authenticated;
grant select on table public.products to anon, authenticated;
grant insert, update, delete on table public.products to authenticated;
revoke all on table public.admin_users from anon, authenticated;

-- Safely tells the logged-in client whether their own account is an administrator.
-- A caller only receives true/false; the admin_users table itself remains private.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Visitors can read active product records. Admins can also see inactive records.
drop policy if exists "Active products are public" on public.products;
create policy "Active products are public"
  on public.products for select
  to anon, authenticated
  using (active = true);

drop policy if exists "Admins can read all products" on public.products;
create policy "Admins can read all products"
  on public.products for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
  on public.products for insert
  to authenticated
  with check ((select public.is_admin()));

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
  on public.products for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
  on public.products for delete
  to authenticated
  using ((select public.is_admin()));

-- Product image storage. The bucket must be public for image URLs to display,
-- but only a verified admin may upload, replace, or remove files. Files are put
-- under a folder matching the admin's Supabase Auth user ID.
drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'product-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.is_admin())
  );

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'product-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.is_admin())
  )
  with check (
    bucket_id = 'product-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.is_admin())
  );

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'product-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.is_admin())
  );

-- IMPORTANT: After creating the admin account in Authentication > Users,
-- copy its user UUID and run the following separately in SQL Editor:
-- insert into public.admin_users (user_id)
-- values ('PASTE-ADMIN-USER-UUID-HERE')
-- on conflict (user_id) do nothing;
