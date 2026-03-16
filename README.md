# Auth Starter Portfolio App

A production-ready authentication system built with Next.js 15, Supabase, TypeScript, and Tailwind CSS. Perfect for your developer portfolio or as a starting point for your next project.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-Auth-3ecf8e)

## Features

- **Email Authentication** - Sign up and login with email/password
- **Password Recovery** - Forgot password flow with email reset link
- **Protected Routes** - Middleware-based route protection
- **User Profiles** - Automatic profile creation on signup
- **Session Persistence** - Sessions survive page refreshes
- **Row Level Security** - Database-level security with Supabase RLS
- **Modern UI** - Clean, responsive design with Tailwind CSS
- **Type Safety** - Full TypeScript support throughout

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth & Database**: Supabase
- **Deployment**: Vercel

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with navbar
│   ├── page.tsx            # Landing page
│   ├── login/
│   │   └── page.tsx        # Login page
│   ├── signup/
│   │   └── page.tsx        # Sign up page
│   ├── forgot-password/
│   │   └── page.tsx        # Forgot password page
│   ├── reset-password/
│   │   └── page.tsx        # Reset password page
│   ├── dashboard/
│   │   └── page.tsx        # Protected dashboard
│   └── profile/
│       ├── page.tsx        # Protected profile page
│       └── ProfileForm.tsx # Profile edit form
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Alert.tsx
│   │   └── index.ts
│   ├── layout/
│   │   └── Navbar.tsx      # Navigation component
│   └── dashboard/
│       └── DashboardCard.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Browser Supabase client
│   │   ├── server.ts       # Server Supabase client
│   │   └── middleware.ts   # Auth middleware utilities
│   └── actions/
│       ├── auth.ts         # Auth server actions
│       └── profile.ts      # Profile server actions
├── types/
│   ├── database.ts         # Database types
│   └── index.ts            # Shared types
├── utils/
│   └── validation.ts       # Form validation helpers
├── supabase/
│   └── schema.sql          # Database schema & RLS policies
├── middleware.ts           # Next.js middleware
└── README.md
```

## Prerequisites

- Node.js 18+ installed
- A [Supabase](https://supabase.com) account (free tier works)
- A [Vercel](https://vercel.com) account for deployment (optional)

## Local Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd auth-starter-portfolio

# Install dependencies
npm install
```

### 2. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details and wait for setup to complete

### 3. Run Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Click **New Query**
3. Copy the contents of `supabase/schema.sql` and paste it
4. Click **Run** to execute

This creates:
- `profiles` table linked to `auth.users`
- Row Level Security policies
- Trigger to auto-create profile on signup
- Function to auto-update `updated_at` timestamp

### 4. Configure Environment Variables

1. Copy the example env file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Get your Supabase credentials:
   - Go to **Project Settings** > **API**
   - Copy the **Project URL** and **anon/public** key

3. Update `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

### 5. Configure Supabase Auth Settings

1. Go to **Authentication** > **URL Configuration**
2. Set **Site URL**: `http://localhost:3000`
3. Add to **Redirect URLs**:
   - `http://localhost:3000/reset-password`
   - `http://localhost:3000/**`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Vercel Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New Project**
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (set to your Vercel domain, e.g., `https://your-app.vercel.app`)
5. Click **Deploy**

### 3. Update Supabase Redirect URLs

After deployment, update Supabase:

1. Go to **Authentication** > **URL Configuration**
2. Update **Site URL**: `https://your-app.vercel.app`
3. Add to **Redirect URLs**:
   - `https://your-app.vercel.app/reset-password`
   - `https://your-app.vercel.app/**`

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGciOiJIUzI1...` |
| `NEXT_PUBLIC_SITE_URL` | Your application URL | `http://localhost:3000` |

## How Authentication Works

### Sign Up Flow

1. User fills out signup form (name, email, password)
2. Form submits to server action (`signUp`)
3. Server action calls `supabase.auth.signUp()` with user metadata
4. Supabase creates user in `auth.users`
5. Database trigger `on_auth_user_created` fires
6. Trigger function `handle_new_user()` creates profile row
7. User is redirected to dashboard

### Login Flow

1. User enters email and password
2. Form submits to server action (`signIn`)
3. Server action calls `supabase.auth.signInWithPassword()`
4. Supabase validates credentials and creates session
5. Session cookies are set via `@supabase/ssr`
6. User is redirected to dashboard

### Password Reset Flow

1. User clicks "Forgot Password" and enters email
2. Server action calls `supabase.auth.resetPasswordForEmail()`
3. Supabase sends email with reset link (contains code)
4. User clicks link, lands on `/reset-password?code=...`
5. Page exchanges code for session via `exchangeCodeForSession()`
6. User enters new password
7. Server action calls `supabase.auth.updateUser({ password })`
8. User is redirected to dashboard

### Route Protection

1. Middleware runs on every request (except static files)
2. Middleware refreshes session via `supabase.auth.getUser()`
3. For protected routes (`/dashboard`, `/profile`):
   - If no user, redirect to `/login?redirectTo=...`
4. For auth routes (`/login`, `/signup`, `/forgot-password`):
   - If user exists, redirect to `/dashboard`

### Session Management

- Sessions are stored in HTTP-only cookies
- `@supabase/ssr` handles cookie management
- Middleware refreshes expired sessions automatically
- Sessions persist across page refreshes and browser restarts

## How to Explain This in an Interview

> "I built a production-ready authentication system using Next.js 15 App Router and Supabase. The project demonstrates several important concepts:
>
> **Architecture**: I used Next.js server actions for form handling, which provides a clean separation between client and server code. The middleware handles route protection at the edge, redirecting unauthenticated users before they hit protected pages.
>
> **Security**: All protected routes are verified server-side using Supabase's `getUser()` method, not just client-side checks. The database uses Row Level Security so users can only access their own profile data, even if someone tries to manipulate API calls.
>
> **Database Design**: I created a `profiles` table that automatically syncs with Supabase's auth system using a PostgreSQL trigger. When a user signs up, a database function creates their profile row automatically.
>
> **User Experience**: The UI shows loading states during auth actions, provides clear error messages, and handles edge cases like invalid password reset links. The password reset flow uses Supabase's secure email-based recovery.
>
> **DevOps**: The project is configured for Vercel deployment with proper environment variable handling. The README includes complete setup instructions so anyone can run it locally or deploy their own instance."

### Key Technical Points to Mention

1. **Why Server Actions?** - Secure by default, no API routes needed, integrated form validation
2. **Why Middleware?** - Runs at the edge, protects routes before rendering
3. **Why RLS?** - Defense in depth, even if client code has bugs
4. **Why SSR Cookies?** - Secure session storage, works with server components

## Future Upgrades

Here are ideas to extend this project:

### OAuth Providers
Add social login with Google, GitHub, etc:
```typescript
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${origin}/auth/callback` }
})
```

### Avatar Upload
Add file upload to Supabase Storage:
```typescript
const { data } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.png`, file)
```

### Admin Roles
Add role-based access control:
```sql
ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';
CREATE POLICY "Admins can view all" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Audit Logs
Track user actions:
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Email Verification
Require email confirmation:
```typescript
const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${origin}/auth/confirm`
  }
})
```

### Two-Factor Authentication
Supabase MFA support:
```typescript
const { data } = await supabase.auth.mfa.enroll({
  factorType: 'totp'
})
```

## License

MIT License - feel free to use this for your own portfolio or projects.

---

Built with ❤️ using Next.js, Supabase, and TypeScript
