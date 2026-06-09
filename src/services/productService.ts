import type { Product } from '@/types'
import { collection, doc, getDocs, getDoc, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

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
    if (filters.country && p.country.toLowerCase() !== filters.country.toLowerCase()) return false
    if (filters.category) {
      const cat = filters.category.toLowerCase()
      const slug = cat.replace(/-/g, ' ')
      if (
        !p.category.toLowerCase().includes(cat) &&
        !p.category.toLowerCase().includes(slug) &&
        !p.slug.includes(cat) &&
        !p.tags.some((t) => t.includes(cat))
      ) return false
    }
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

async function fetchAllProducts(): Promise<Product[]> {
  const snap = await getDocs(collection(db, 'products'))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product))
}

export const productService = {
  async getAll(filters?: ProductFilters): Promise<Product[]> {
    const products = await fetchAllProducts()
    return filterProducts(products, filters)
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const q = query(collection(db, 'products'), where('slug', '==', slug))
    const snap = await getDocs(q)
    if (snap.empty) return null
    const d = snap.docs[0]
    return { id: d.id, ...d.data() } as Product
  },

  async getById(id: string): Promise<Product | null> {
    const snap = await getDoc(doc(db, 'products', id))
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as Product) : null
  },

  async getBestSellers(): Promise<Product[]> {
    return this.getAll({ bestSeller: true })
  },

  async getTrending(): Promise<Product[]> {
    return this.getAll({ trending: true })
  },

  async getNewArrivals(): Promise<Product[]> {
    const products = await fetchAllProducts()
    return [...products]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8)
  },

  async getPlayerEditions(): Promise<Product[]> {
    return this.getAll({ playerEdition: true })
  },

  async getRetro(): Promise<Product[]> {
    return this.getAll({ retroEdition: true })
  },
}
