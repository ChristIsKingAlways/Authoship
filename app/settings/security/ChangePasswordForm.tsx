'use client'

import { useState } from 'react'
import { Button, Input, Alert } from '@/components/ui'
import { changePassword } from '@/lib/actions/auth'

export default function ChangePasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const result = await changePassword(formData)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.success)
      // Clear form
      const form = document.getElementById('password-form') as HTMLFormElement
      form?.reset()
    }

    setIsLoading(false)
  }

  return (
    <div>
      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}

      {success && (
        <Alert type="success" className="mb-4">
          {success}
        </Alert>
      )}

      <form id="password-form" action={handleSubmit} className="space-y-4">
        <Input
          label="Current Password"
          name="currentPassword"
          type="password"
          required
          placeholder="Enter current password"
        />

        <Input
          label="New Password"
          name="newPassword"
          type="password"
          required
          placeholder="Enter new password"
          helperText="Must be at least 6 characters"
        />

        <Input
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          required
          placeholder="Confirm new password"
        />

        <div className="flex justify-end">
          <Button type="submit" isLoading={isLoading}>
            Update Password
          </Button>
        </div>
      </form>
    </div>
  )
}
