import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function ProfilePage() {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-text-muted">Please sign in to view your profile.</p>
          <Button className="mt-4" onClick={() => navigate('/login')}>Sign In</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <h2 className="text-lg font-bold">Profile Information</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-border pb-3">
            <dt className="text-text-muted">Name</dt>
            <dd className="font-medium">{user.displayName ?? '—'}</dd>
          </div>
          <div className="flex justify-between border-b border-border pb-3">
            <dt className="text-text-muted">Email</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-muted">Account ID</dt>
            <dd className="font-mono text-xs text-text-muted">{user.uid.slice(0, 12)}…</dd>
          </div>
        </dl>
        <Button
          variant="outline"
          onClick={async () => {
            await signOut()
            navigate('/login')
          }}
        >
          Sign Out
        </Button>
      </CardContent>
    </Card>
  )
}
