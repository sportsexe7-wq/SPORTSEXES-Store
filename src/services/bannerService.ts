import type { Banner } from '@/types'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const bannerService = {
  async getActive(): Promise<Banner[]> {
    const snap = await getDocs(collection(db, 'banners'))
    const banners = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Banner))
    return banners.filter((b) => b.active).sort((a, b) => a.priority - b.priority)
  },
}
