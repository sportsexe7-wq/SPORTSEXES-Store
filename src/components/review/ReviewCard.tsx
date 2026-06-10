import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, ThumbsUp, BadgeCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { reviewService } from '@/services/reviewService'
import { useAuth } from '@/contexts/AuthContext'
import { formatDate } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { Review } from '@/types'

interface ReviewCardProps {
  review: Review
  showProduct?: boolean
}

export function ReviewCard({ review, showProduct = false }: ReviewCardProps) {
  const { user } = useAuth()
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount)
  const [voted, setVoted] = useState(user ? review.helpfulVoters.includes(user.uid) : false)
  const [busy, setBusy] = useState(false)

  const handleHelpful = async () => {
    if (!user) {
      alert('Sign in to mark reviews helpful')
      return
    }
    if (busy) return
    setBusy(true)
    const prevVoted = voted
    setVoted(!prevVoted)
    setHelpfulCount((c) => c + (prevVoted ? -1 : 1))
    try {
      await reviewService.toggleHelpful(review.id, prevVoted)
    } catch (e) {
      setVoted(prevVoted)
      setHelpfulCount((c) => c + (prevVoted ? 1 : -1))
      console.error(e)
    } finally {
      setBusy(false)
    }
  }

  const initial = (review.userName ?? 'A').charAt(0).toUpperCase()

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex h-full flex-col rounded-2xl border border-border bg-surface p-5"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/20 text-sm font-bold text-brand">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-semibold">{review.userName}</p>
            {review.verifiedPurchase && (
              <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-brand" />
            )}
          </div>
          <p className="text-[11px] text-text-muted">{formatDate(review.createdAt)}</p>
        </div>
        <div className="flex shrink-0 gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                'h-3.5 w-3.5',
                i < review.rating ? 'fill-brand text-brand' : 'text-border',
              )}
            />
          ))}
        </div>
      </div>

      {/* Body */}
      {review.title && (
        <h4 className="mt-3 text-sm font-bold leading-tight">{review.title}</h4>
      )}
      <p className="mt-1.5 line-clamp-4 flex-1 text-sm leading-relaxed text-text-muted">
        {review.body}
      </p>

      {/* Images */}
      {review.images.length > 0 && (
        <div className="mt-3 flex gap-2">
          {review.images.slice(0, 3).map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-14 w-14 overflow-hidden rounded-md border border-border"
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </a>
          ))}
        </div>
      )}

      {/* Product link */}
      {showProduct && review.productSlug && (
        <Link
          to={`/product/${review.productSlug}`}
          className="mt-3 inline-block text-[11px] font-semibold text-brand hover:underline"
        >
          on {review.productTitle} →
        </Link>
      )}

      {/* Helpful button */}
      <div className="mt-4 border-t border-border pt-3">
        <button
          type="button"
          onClick={handleHelpful}
          disabled={busy}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
            voted
              ? 'border-brand bg-brand/10 text-brand'
              : 'border-border text-text-muted hover:border-brand/40 hover:text-text',
          )}
        >
          <ThumbsUp className={cn('h-3.5 w-3.5', voted && 'fill-brand')} />
          Found helpful {helpfulCount > 0 && `· ${helpfulCount}`}
        </button>
      </div>
    </motion.article>
  )
}
