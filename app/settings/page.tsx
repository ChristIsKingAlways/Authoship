import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader } from '@/components/ui'
import DeleteAccountButton from './DeleteAccountButton'

export default async function SettingsPage() {
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
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account preferences and settings.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <Link
          href="/settings"
          className="px-4 py-2 text-sm font-medium text-primary-600 border-b-2 border-primary-600"
        >
          General
        </Link>
        <Link
          href="/settings/security"
          className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          Security
        </Link>
      </div>

      {/* Account Overview */}
      <Card className="mb-6">
        <CardHeader
          title="Account Overview"
          description="Your account details"
        />
        <dl className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <dt className="text-sm font-medium text-gray-900">Email</dt>
              <dd className="text-sm text-gray-500">{user.email}</dd>
            </div>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <dt className="text-sm font-medium text-gray-900">Account ID</dt>
              <dd className="text-sm text-gray-500 font-mono">{user.id.slice(0, 8)}...</dd>
            </div>
          </div>
          <div className="flex justify-between items-center py-3">
            <div>
              <dt className="text-sm font-medium text-gray-900">Member Since</dt>
              <dd className="text-sm text-gray-500">
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Unknown'}
              </dd>
            </div>
          </div>
        </dl>
      </Card>

      {/* Preferences */}
      <Card className="mb-6">
        <CardHeader
          title="Preferences"
          description="Customize your experience"
        />
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive email updates about your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Marketing Emails</p>
              <p className="text-sm text-gray-500">Receive news and product updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader
          title="Danger Zone"
          description="Irreversible actions"
        />
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">Export Data</p>
              <p className="text-sm text-gray-500">Download a copy of your data</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              Export
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-red-600">Delete Account</p>
              <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
            </div>
            <DeleteAccountButton />
          </div>
        </div>
      </Card>
    </div>
  )
}
