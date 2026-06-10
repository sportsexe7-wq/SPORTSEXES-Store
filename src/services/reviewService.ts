import {
  collection,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit as fbLimit,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage, auth } from '@/lib/firebase'
import type { Review, NewReviewInput } from '@/types'

const REVIEWS_COL = 'reviews'

export const MAX_REVIEW_IMAGE_SIZE = 1024 * 1024 // 1 MB
export const MAX_REVIEW_IMAGES = 3

function docToReview(id: string, data: Record<string, unknown>): Review {
  const createdAtRaw = data.createdAt as Timestamp | string | undefined
  const createdAt =
    createdAtRaw instanceof Timestamp
      ? createdAtRaw.toDate().toISOString()
      : typeof createdAtRaw === 'string'
        ? createdAtRaw
        : new Date().toISOString()

  return {
    id,
    productId: (data.productId as string) ?? '',
    productTitle: (data.productTitle as string) ?? '',
    productSlug: (data.productSlug as string) ?? '',
    userId: (data.userId as string) ?? '',
    userName: (data.userName as string) ?? 'Anonymous',
    rating: (data.rating as number) ?? 0,
    title: (data.title as string) ?? '',
    body: (data.body as string) ?? '',
    images: (data.images as string[]) ?? [],
    helpfulCount: (data.helpfulCount as number) ?? 0,
    helpfulVoters: (data.helpfulVoters as string[]) ?? [],
    verifiedPurchase: (data.verifiedPurchase as boolean) ?? false,
    createdAt,
  }
}

export const reviewService = {
  async getRecent(max = 8): Promise<Review[]> {
    const q = query(collection(db, REVIEWS_COL), orderBy('createdAt', 'desc'), fbLimit(max))
    const snap = await getDocs(q)
    return snap.docs.map((d) => docToReview(d.id, d.data()))
  },

  async getByProduct(productId: string): Promise<Review[]> {
    const q = query(
      collection(db, REVIEWS_COL),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc'),
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => docToReview(d.id, d.data()))
  },

  async uploadImage(file: File): Promise<string> {
    if (file.size > MAX_REVIEW_IMAGE_SIZE) {
      throw new Error(`Image must be under 1 MB (got ${(file.size / 1024 / 1024).toFixed(2)} MB)`)
    }
    const user = auth.currentUser
    if (!user) throw new Error('Sign in to upload review images')

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `reviews/${user.uid}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const fileRef = ref(storage, path)
    await uploadBytes(fileRef, file, { contentType: file.type })
    return getDownloadURL(fileRef)
  },

  async addReview(input: NewReviewInput): Promise<string> {
    const user = auth.currentUser
    if (!user) throw new Error('Sign in to write a review')

    const ref = await addDoc(collection(db, REVIEWS_COL), {
      ...input,
      userId: user.uid,
      userName: user.displayName ?? user.email?.split('@')[0] ?? 'Anonymous',
      helpfulCount: 0,
      helpfulVoters: [],
      verifiedPurchase: false,
      createdAt: serverTimestamp(),
    })
    return ref.id
  },

  async toggleHelpful(reviewId: string, alreadyVoted: boolean): Promise<void> {
    const user = auth.currentUser
    if (!user) throw new Error('Sign in to mark reviews helpful')

    const reviewRef = doc(db, REVIEWS_COL, reviewId)
    if (alreadyVoted) {
      await updateDoc(reviewRef, {
        helpfulCount: increment(-1),
        helpfulVoters: arrayRemove(user.uid),
      })
    } else {
      await updateDoc(reviewRef, {
        helpfulCount: increment(1),
        helpfulVoters: arrayUnion(user.uid),
      })
    }
  },
}
