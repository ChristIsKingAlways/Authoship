'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button, Input, Alert } from '@/components/ui'
import { forgotPassword } from '@/lib/actions/auth'

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const result = await forgotPassword(formData)
    
    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.success)
    }
    
    setIsLoading(false)
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
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h1 className="auth-title">Forgot your password?</h1>
          <p className="auth-subtitle">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {error && (
          <Alert type="error" className="mb-6">
            {error}
          </Alert>
        )}

        {success && (
          <Alert type="success" className="mb-6">
            {success}
          </Alert>
        )}

        {!success && (
          <form action={handleSubmit} className="form-group">
            <Input
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
            />

            <Button type="submit" fullWidth isLoading={isLoading}>
              Send reset link
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Remember your password?{' '}
          <Link href="/login" className="link-primary">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
