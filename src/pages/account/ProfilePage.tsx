import { useQuery } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export function ProfilePage() {
  const navigate = useNavigate()
  const isLoggedIn = localStorage.getItem('sportsexe_auth') === 'true'

  const { data: user } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authService.getProfile(),
    enabled: isLoggedIn,
  })

  if (!isLoggedIn) {
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
            <dd className="font-medium">{user?.name}</dd>
          </div>
          <div className="flex justify-between border-b border-border pb-3">
            <dt className="text-text-muted">Email</dt>
            <dd className="font-medium">{user?.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-muted">Phone</dt>
            <dd className="font-medium">{user?.phone ?? '—'}</dd>
          </div>
        </dl>
        <Button
          variant="outline"
          onClick={() => {
            localStorage.removeItem('sportsexe_auth')
            navigate('/login')
          }}
        >
          Sign Out
        </Button>
      </CardContent>
    </Card>
  )
}
