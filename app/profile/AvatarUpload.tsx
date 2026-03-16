'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Alert } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

interface AvatarUploadProps {
  userId: string
  currentAvatarUrl: string | null
  fallbackInitial: string
}

export default function AvatarUpload({ userId, currentAvatarUrl, fallbackInitial }: AvatarUploadProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be less than 2MB')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const supabase = createClient()

    // Create a unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/avatar.${fileExt}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true })

    if (uploadError) {
      setError(uploadError.message)
      setIsLoading(false)
      return
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    // Update profile with new avatar URL
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId)

    if (updateError) {
      setError(updateError.message)
      setIsLoading(false)
      return
    }

    setPreviewUrl(publicUrl)
    setSuccess('Avatar updated successfully')
    setIsLoading(false)
    router.refresh()
  }

  const handleRemoveAvatar = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const supabase = createClient()

    // Remove from storage
    const { error: deleteError } = await supabase.storage
      .from('avatars')
      .remove([`${userId}/avatar.jpg`, `${userId}/avatar.png`, `${userId}/avatar.jpeg`, `${userId}/avatar.webp`])

    if (deleteError) {
      // Ignore if file doesn't exist
      console.log('Delete error (may be ignored):', deleteError)
    }

    // Update profile to remove avatar URL
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', userId)

    if (updateError) {
      setError(updateError.message)
      setIsLoading(false)
      return
    }

    setPreviewUrl(null)
    setSuccess('Avatar removed')
    setIsLoading(false)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-4xl font-bold text-primary-600">
              {fallbackInitial}
            </span>
          </div>
        )}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
            <svg className="animate-spin h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1">
        {error && (
          <Alert type="error" className="mb-3">
            {error}
          </Alert>
        )}
        {success && (
          <Alert type="success" className="mb-3">
            {success}
          </Alert>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            {previewUrl ? 'Change' : 'Upload'}
          </Button>
          {previewUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveAvatar}
              disabled={isLoading}
            >
              Remove
            </Button>
          )}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          JPG, PNG or WebP. Max 2MB.
        </p>
      </div>
    </div>
  )
}
