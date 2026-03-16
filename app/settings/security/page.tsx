import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader } from '@/components/ui'
import ChangePasswordForm from './ChangePasswordForm'

export default async function SecurityPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Security Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your password and security preferences.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <Link
          href="/settings"
          className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          General
        </Link>
        <Link
          href="/settings/security"
          className="px-4 py-2 text-sm font-medium text-primary-600 border-b-2 border-primary-600"
        >
          Security
        </Link>
      </div>

      {/* Change Password */}
      <Card className="mb-6">
        <CardHeader
          title="Change Password"
          description="Update your password to keep your account secure"
        />
        <ChangePasswordForm />
      </Card>

      {/* Session Information */}
      <Card className="mb-6">
        <CardHeader
          title="Session Information"
          description="Your current login session"
        />
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Current Session</p>
                <p className="text-xs text-gray-500">
                  Last sign in: {user.last_sign_in_at 
                    ? new Date(user.last_sign_in_at).toLocaleString() 
                    : 'Unknown'}
                </p>
              </div>
            </div>
            <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
              Active
            </span>
          </div>
        </div>
      </Card>

      {/* Security Tips */}
      <Card>
        <CardHeader
          title="Security Tips"
          description="Best practices to keep your account safe"
        />
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-600">Use a strong, unique password with at least 8 characters</span>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-600">Never share your password with anyone</span>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-600">Change your password regularly</span>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-600">Log out when using shared devices</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
