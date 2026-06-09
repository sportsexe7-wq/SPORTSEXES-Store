import type { Product } from '@/types'
import { delay } from './api'
import { mockProducts } from '@/data/mock/products'

export interface ProductFilters {
  category?: string
  country?: string
  featured?: boolean
  trending?: boolean
  bestSeller?: boolean
  playerEdition?: boolean
  retroEdition?: boolean
  search?: string
}

function filterProducts(products: Product[], filters?: ProductFilters): Product[] {
  if (!filters) return products

  return products.filter((p) => {
    if (filters.category && !p.category.toLowerCase().includes(filters.category.toLowerCase()) &&
        !p.slug.includes(filters.category) && !p.tags.some(t => t.includes(filters.category!))) {
      const slug = filters.category.replace(/-/g, ' ')
      if (!p.category.toLowerCase().includes(slug) && p.country.toLowerCase() !== slug) return false
    }
    if (filters.country && p.country.toLowerCase() !== filters.country.toLowerCase()) return false
    if (filters.featured && !p.featured) return false
    if (filters.trending && !p.trending) return false
    if (filters.bestSeller && !p.bestSeller) return false
    if (filters.playerEdition && !p.playerEdition) return false
    if (filters.retroEdition && !p.retroEdition) return false
    if (filters.search) {
      const q = filters.search.toLowerCase()
      return (
        p.title.toLowerCase().includes(q) ||
        p.team.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
      )
    }
    return true
  })
}

export const productService = {
  async getAll(filters?: ProductFilters): Promise<Product[]> {
    await delay()
    return filterProducts(mockProducts, filters)
  },

  async getBySlug(slug: string): Promise<Product | null> {
    await delay()
    return mockProducts.find((p) => p.slug === slug) ?? null
  },

  async getById(id: string): Promise<Product | null> {
    await delay()
    return mockProducts.find((p) => p.id === id) ?? null
  },

  async getBestSellers(): Promise<Product[]> {
    return this.getAll({ bestSeller: true })
  },

  async getTrending(): Promise<Product[]> {
    return this.getAll({ trending: true })
  },

  async getNewArrivals(): Promise<Product[]> {
    await delay()
    return [...mockProducts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ).slice(0, 8)
  },

  async getPlayerEditions(): Promise<Product[]> {
    return this.getAll({ playerEdition: true })
  },

  async getRetro(): Promise<Product[]> {
    return this.getAll({ retroEdition: true })
  },
}
