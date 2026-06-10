import { useQuery } from '@tanstack/react-query'
import { orderService } from '@/services/orderService'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/utils/format'
import { Package, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate, useSearchParams } from 'react-router-dom'

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'outline',
  processing: 'secondary',
  shipped: 'default',
  delivered: 'default',
  cancelled: 'destructive',
}

export function OrdersPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const newOrderId = searchParams.get('new')

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', user?.uid],
    queryFn: () => orderService.getByUserId(user!.uid),
    enabled: !!user,
  })

  if (loading || isLoading) return <p className="text-text-muted">Loading orders…</p>

  if (!user) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-text-muted">Please sign in to view your orders.</p>
          <Button className="mt-4" onClick={() => navigate('/login')}>Sign In</Button>
        </CardContent>
      </Card>
    )
  }

  if (!orders.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Package className="mx-auto h-12 w-12 text-text-muted" />
          <p className="mt-4 text-text-muted">No orders yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {newOrderId && (
        <div className="flex items-center gap-3 rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm font-medium text-brand">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          Order placed successfully! We'll start processing it shortly.
        </div>
      )}
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-bold">#{order.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-sm text-text-muted">{formatDate(order.createdAt)}</p>
              </div>
              <Badge variant={STATUS_VARIANT[order.status] ?? 'outline'} className="capitalize">
                {order.status}
              </Badge>
            </div>
            <div className="mt-4 space-y-3">
              {order.items.map((item: { productId: string; image: string; title: string; size: string; quantity: number; price: number }, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={item.image} alt={item.title} className="h-14 w-12 rounded object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-text-muted">Size {item.size} × {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <div>
                {order.trackingNumber && (
                  <p className="text-xs text-text-muted">Tracking: {order.trackingNumber}</p>
                )}
              </div>
              <p className="font-bold">{formatCurrency(order.total)}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
