# Wedding RSVP Next.js Website

Vercel-ready RSVP website with:

- Public guest RSVP page
- Private admin dashboard
- Attendance stats
- Search and filter
- CSV export
- Supabase database storage

## 1. Install

```bash
npm install
npm run dev
```

## 2. Supabase table

Create a Supabase project, then run this SQL in Supabase SQL Editor:

```sql
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  attending text not null check (attending in ('yes', 'no', 'maybe')),
  guests_count integer not null default 1 check (guests_count >= 0),
  note text,
  created_at timestamptz not null default now()
);

alter table public.rsvps enable row level security;
```

This project uses the Supabase service role key only inside Next.js API routes, so users cannot see it in the browser.

## 3. Environment variables

Copy `.env.example` to `.env.local` locally.

On Vercel, add the same variables in:

Project Settings → Environment Variables

Required:

```txt
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
ADMIN_PASSWORD
```

Optional wedding text:

```txt
NEXT_PUBLIC_WEDDING_GROOM
NEXT_PUBLIC_WEDDING_BRIDE
NEXT_PUBLIC_WEDDING_DATE
NEXT_PUBLIC_WEDDING_TIME
NEXT_PUBLIC_WEDDING_LOCATION
```

## 4. Deploy to Vercel

```bash
npm run build
```

Then push to GitHub and import the repo in Vercel.

Admin page:

```txt
/admin
```
