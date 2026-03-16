'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Alert } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

export default function DeleteAccountButton() {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmText, setConfirmText] = useState('')

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm')
      return
    }

    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    
    // Sign out first
    const { error: signOutError } = await supabase.auth.signOut()
    
    if (signOutError) {
      setError(signOutError.message)
      setIsLoading(false)
      return
    }

    router.push('/?deleted=true')
    router.refresh()
  }

  if (!showConfirm) {
    return (
      <Button
        variant="danger"
        size="sm"
        onClick={() => setShowConfirm(true)}
      >
        Delete
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Delete Account
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          This action cannot be undone. This will permanently delete your account
          and remove all your data from our servers.
        </p>

        {error && (
          <Alert type="error" className="mb-4">
            {error}
          </Alert>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type <span className="font-bold">DELETE</span> to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="DELETE"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="ghost"
            onClick={() => {
              setShowConfirm(false)
              setConfirmText('')
              setError(null)
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={isLoading}
            disabled={confirmText !== 'DELETE'}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  )
}
