# Authoship

A production-ready authentication starter kit built with Next.js 15, Supabase, TypeScript, and Tailwind CSS. Get your app up and running with secure authentication in minutes.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-Auth-3ecf8e)

## Features

- **Email Authentication** - Sign up and login with email/password
- **Password Recovery** - Secure password reset via email
- **Protected Routes** - Middleware-based route protection
- **User Profiles** - Automatic profile creation on signup
- **Session Persistence** - Sessions survive page refreshes
- **Row Level Security** - Database-level security with Supabase RLS
- **Responsive Design** - Mobile-first UI with Tailwind CSS
- **Type Safety** - Full TypeScript support

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Supabase | Authentication & Database |
| Vercel | Deployment |

## Quick Start

### Prerequisites

- Node.js 18+
- [Supabase](https://supabase.com) account
- [Vercel](https://vercel.com) account (optional, for deployment)

### 1. Clone & Install

```bash
git clone https://github.com/ChristIsKingAlways/Authoship.git
cd Authoship
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://app.supabase.com)
2. Go to **SQL Editor** → **New Query**
3. Copy and run the contents of `supabase/schema.sql`

This creates:
- `profiles` table linked to `auth.users`
- Row Level Security policies
- Auto-create profile trigger on signup

### 3. Configure Environment

```bash
cp .env.local.example .env.local
```

Update `.env.local` with your Supabase credentials (found in **Project Settings** → **API**):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Configure Auth Redirects

In Supabase Dashboard → **Authentication** → **URL Configuration**:

- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: Add `http://localhost:3000/**`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── auth/callback/      # OAuth callback handler
│   ├── dashboard/          # Protected dashboard
│   ├── forgot-password/    # Password recovery
│   ├── login/              # Login page
│   ├── profile/            # Profile settings
│   ├── reset-password/     # Password reset
│   ├── signup/             # Registration
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx            # Landing page
├── components/
│   ├── dashboard/          # Dashboard components
│   ├── layout/             # Layout components
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── actions/            # Server actions
│   └── supabase/           # Supabase clients
├── types/                  # TypeScript definitions
├── utils/                  # Utility functions
├── supabase/
│   └── schema.sql          # Database schema
└── middleware.ts           # Route protection
```

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com/dashboard)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` → your Vercel domain
4. Deploy

### Update Supabase Settings

After deployment, update in Supabase Dashboard:

- **Site URL**: `https://your-app.vercel.app`
- **Redirect URLs**: Add `https://your-app.vercel.app/**`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `NEXT_PUBLIC_SITE_URL` | Your application URL |

## Authentication Flow

### Sign Up
1. User submits registration form
2. Supabase creates user in `auth.users`
3. Database trigger creates profile row
4. User redirected to dashboard

### Sign In
1. User submits credentials
2. Supabase validates and creates session
3. Session stored in HTTP-only cookies
4. User redirected to dashboard

### Password Reset
1. User requests reset email
2. Supabase sends email with secure link
3. User clicks link and sets new password
4. Session created, user redirected to dashboard

### Route Protection
- Middleware runs on every request
- Protected routes (`/dashboard`, `/profile`) require authentication
- Unauthenticated users redirected to `/login`
- Authenticated users redirected from auth pages to `/dashboard`

## Database Schema

The `profiles` table extends Supabase Auth:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

Row Level Security ensures users can only access their own data.

## Customization

### Adding New Protected Routes

Update `lib/supabase/middleware.ts`:

```typescript
const protectedRoutes = ['/dashboard', '/profile', '/settings']
```

### Adding Profile Fields

1. Update `supabase/schema.sql` with new columns
2. Update `types/database.ts` with new fields
3. Update profile form and display components

### Adding OAuth Providers

```typescript
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${origin}/auth/callback` }
})
```

Configure providers in Supabase Dashboard → **Authentication** → **Providers**

## Extending the App

### Avatar Upload

```typescript
const { data } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.png`, file)
```

### Role-Based Access

```sql
ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';
```

### Audit Logging

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Two-Factor Authentication

```typescript
const { data } = await supabase.auth.mfa.enroll({
  factorType: 'totp'
})
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - use freely for personal and commercial projects.

---

Built with Next.js, Supabase, and TypeScript
