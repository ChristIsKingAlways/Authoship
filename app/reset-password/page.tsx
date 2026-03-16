'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Input, Alert } from '@/components/ui'
import { resetPassword } from '@/lib/actions/auth'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      
      // Check for code in URL (Supabase sends this for password reset)
      const code = searchParams.get('code')
      
      if (code) {
        // Exchange code for session
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          setError('Invalid or expired reset link. Please request a new one.')
          setIsValidSession(false)
          return
        }
      }
      
      // Check if user has a valid session
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('Invalid or expired reset link. Please request a new one.')
        setIsValidSession(false)
      } else {
        setIsValidSession(true)
      }
    }

    checkSession()
  }, [searchParams])

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const result = await resetPassword(formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  if (isValidSession === null) {
    return (
      <div className="auth-container bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="auth-card">
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin h-8 w-8 text-primary-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <p className="text-center mt-4 text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    )
  }

  if (!isValidSession) {
    return (
      <div className="auth-container bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="auth-card">
          <div className="auth-header">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="auth-title">Invalid Reset Link</h1>
            <p className="auth-subtitle">{error}</p>
          </div>
          <Button fullWidth onClick={() => router.push('/forgot-password')}>
            Request New Reset Link
          </Button>
        </div>
      </div>
    )
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
          <h1 className="auth-title">Set new password</h1>
          <p className="auth-subtitle">Enter your new password below</p>
        </div>

        {error && (
          <Alert type="error" className="mb-6">
            {error}
          </Alert>
        )}

        <form action={handleSubmit} className="form-group">
          <Input
            label="New password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="••••••••"
            helperText="Must be at least 6 characters"
          />

          <Input
            label="Confirm new password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            placeholder="••••••••"
          />

          <Button type="submit" fullWidth isLoading={isLoading}>
            Reset password
          </Button>
        </form>
      </div>
    </div>
  )
}
