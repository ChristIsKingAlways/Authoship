import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader } from '@/components/ui'
import ProfileForm from './ProfileForm'
import AvatarUpload from './AvatarUpload'
import type { Profile } from '@/types'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  const profile = data as Profile | null
  const fallbackInitial = profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'

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
        <AvatarUpload
          userId={user.id}
          currentAvatarUrl={profile?.avatar_url || null}
          fallbackInitial={fallbackInitial}
        />
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
              Contact support to change your email
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
