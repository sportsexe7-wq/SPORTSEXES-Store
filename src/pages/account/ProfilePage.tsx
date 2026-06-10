import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function ProfilePage() {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const [phone, setPhone] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      getDoc(doc(db, 'customers', user.uid)).then((snap) => {
        if (snap.exists()) setPhone(snap.data().phone ?? null)
      })
    }
  }, [user])

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
            <dd className="flex items-center gap-2 font-medium">
              {user.email}
              {user.emailVerified
                ? <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-bold text-green-400">Verified</span>
                : <span className="rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-bold text-orange-400">Unverified</span>
              }
            </dd>
          </div>
          {phone && (
            <div className="flex justify-between border-b border-border pb-3">
              <dt className="text-text-muted">Phone</dt>
              <dd className="font-medium">{phone}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-text-muted">Member since</dt>
            <dd className="text-text-muted">{user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</dd>
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
