'use client'

import { useState } from 'react'
import { Button, Input, Alert } from '@/components/ui'
import { updateProfile } from '@/lib/actions/profile'
import type { Profile } from '@/types'

interface ProfileFormProps {
  profile: Profile | null
  email: string
}

export default function ProfileForm({ profile, email }: ProfileFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const result = await updateProfile(formData)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.success)
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

      <form action={handleSubmit} className="space-y-6">
        <Input
          label="Full Name"
          name="fullName"
          type="text"
          defaultValue={profile?.full_name || ''}
          placeholder="Enter your full name"
          required
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          defaultValue={email}
          disabled
          helperText="Email cannot be changed"
        />

        <div className="flex justify-end">
          <Button type="submit" isLoading={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
