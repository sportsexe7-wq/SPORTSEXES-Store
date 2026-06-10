export interface Review {
  id: string
  productId: string
  productTitle: string
  productSlug: string
  userId: string
  userName: string
  rating: number
  title: string
  body: string
  images: string[]
  helpfulCount: number
  helpfulVoters: string[]
  verifiedPurchase: boolean
  createdAt: string
}

export type NewReviewInput = Pick<
  Review,
  'productId' | 'productTitle' | 'productSlug' | 'rating' | 'title' | 'body' | 'images'
>
