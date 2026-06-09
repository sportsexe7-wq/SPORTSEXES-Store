import type { Order } from '@/types'
import { delay } from './api'
import { mockOrders } from '@/data/mock/orders'

export const orderService = {
  async getByUserId(userId: string): Promise<Order[]> {
    await delay()
    return mockOrders.filter((o) => o.userId === userId)
  },

  async getById(id: string): Promise<Order | null> {
    await delay()
    return mockOrders.find((o) => o.id === id) ?? null
  },
}
