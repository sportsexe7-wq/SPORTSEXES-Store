import type { Banner } from '@/types'
import { delay } from './api'
import { mockBanners } from '@/data/mock/banners'

export const bannerService = {
  async getActive(): Promise<Banner[]> {
    await delay()
    return mockBanners
      .filter((b) => b.active)
      .sort((a, b) => a.priority - b.priority)
  },
}
