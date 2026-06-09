import type { Order } from '@/types'
import {
  collection, doc, getDocs, getDoc, addDoc, query, where,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const orderService = {
  async getByUserId(userId: string): Promise<Order[]> {
    const q = query(collection(db, 'orders'), where('userId', '==', userId))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order))
  },

  async getById(id: string): Promise<Order | null> {
    const snap = await getDoc(doc(db, 'orders', id))
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as Order) : null
  },

  async create(order: Omit<Order, 'id'>): Promise<Order> {
    const ref = await addDoc(collection(db, 'orders'), order)
    return { ...order, id: ref.id }
  },
}
