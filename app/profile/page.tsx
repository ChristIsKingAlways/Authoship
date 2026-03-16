import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader } from '@/components/ui'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account information and preferences.
        </p>
      </div>

      {/* Profile Avatar Section */}
      <Card className="mb-6">
        <CardHeader
          title="Profile Picture"
          description="Your avatar displayed across the application"
        />
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-4xl font-bold text-primary-600">
              {profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">
              Avatar upload feature coming soon.
            </p>
            <p className="text-xs text-gray-400">
              For now, we use your initials as a placeholder.
            </p>
          </div>
        </div>
      </Card>

      {/* Profile Form */}
      <Card className="mb-6">
        <CardHeader
          title="Personal Information"
          description="Update your personal details"
        />
        <ProfileForm profile={profile} email={user.email || ''} />
      </Card>

      {/* Account Info (Read-only) */}
      <Card>
        <CardHeader
          title="Account Information"
          description="This information cannot be changed"
        />
        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Email Address</dt>
            <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
            <p className="mt-1 text-xs text-gray-400">
              Email changes are not supported in this demo
            </p>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">User ID</dt>
            <dd className="mt-1 text-sm text-gray-900 font-mono text-xs bg-gray-50 p-2 rounded">
              {user.id}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Account Created</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {user.created_at
                ? new Date(user.created_at).toLocaleString()
                : 'Unknown'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {profile?.updated_at
                ? new Date(profile.updated_at).toLocaleString()
                : 'Never'}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  )
}
