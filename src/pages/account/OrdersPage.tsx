import { useQuery } from '@tanstack/react-query'
import { orderService } from '@/services/orderService'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/utils/format'
import { Package } from 'lucide-react'

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'outline',
  processing: 'secondary',
  shipped: 'default',
  delivered: 'default',
  cancelled: 'destructive',
}

export function OrdersPage() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', 'user-1'],
    queryFn: () => orderService.getByUserId('user-1'),
  })

  if (isLoading) return <p className="text-text-muted">Loading orders...</p>

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
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-bold">{order.id}</p>
                <p className="text-sm text-text-muted">{formatDate(order.createdAt)}</p>
              </div>
              <Badge variant={STATUS_VARIANT[order.status] ?? 'outline'} className="capitalize">
                {order.status}
              </Badge>
            </div>
            <div className="mt-4 space-y-3">
              {order.items.map((item, i) => (
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
