'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button, Input, Alert } from '@/components/ui'
import { signUp } from '@/lib/actions/auth'

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const result = await signUp(formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="auth-card">
        <div className="auth-header">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Start your journey with us today</p>
        </div>

        {error && (
          <Alert type="error" className="mb-6">
            {error}
          </Alert>
        )}

        <form action={handleSubmit} className="form-group">
          <Input
            label="Full name"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            placeholder="John Doe"
          />

          <Input
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="••••••••"
            helperText="Must be at least 6 characters"
          />

          <div className="text-sm text-gray-600">
            By creating an account, you agree to our{' '}
            <Link href="#" className="link-primary">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="link-primary">
              Privacy Policy
            </Link>
          </div>

          <Button type="submit" fullWidth isLoading={isLoading}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="link-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
