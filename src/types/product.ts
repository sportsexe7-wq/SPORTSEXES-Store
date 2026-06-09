export type ProductSize = 'S' | 'M' | 'L' | 'XL'

export interface Product {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  price: number
  salePrice?: number
  stock: number
  category: string
  subCategory: string
  team: string
  league: string
  country: string
  season: string
  sizes: ProductSize[]
  images: string[]
  tags: string[]
  featured: boolean
  trending: boolean
  bestSeller: boolean
  playerEdition: boolean
  retroEdition: boolean
  rating?: number
  reviewCount?: number
  createdAt: string
  updatedAt: string
}
