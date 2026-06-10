import { useRef, useState } from 'react'
import { Star, ImagePlus, X, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { reviewService, MAX_REVIEW_IMAGE_SIZE, MAX_REVIEW_IMAGES } from '@/services/reviewService'
import { cn } from '@/utils/cn'
import type { Product } from '@/types'

interface ReviewFormProps {
  product: Product
  onSubmitted?: () => void
}

const MB = 1024 * 1024

export function ReviewForm({ product, onSubmitted }: ReviewFormProps) {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return

    if (images.length + files.length > MAX_REVIEW_IMAGES) {
      setError(`You can upload up to ${MAX_REVIEW_IMAGES} images`)
      return
    }

    const oversize = files.find((f) => f.size > MAX_REVIEW_IMAGE_SIZE)
    if (oversize) {
      setError(
        `"${oversize.name}" is ${(oversize.size / MB).toFixed(2)} MB — images must be under 1 MB`,
      )
      return
    }

    setUploading(true)
    try {
      const urls = await Promise.all(files.map((f) => reviewService.uploadImage(f)))
      setImages((prev) => [...prev, ...urls])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((u) => u !== url))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!user) {
      setError('Please sign in to write a review')
      return
    }
    if (!body.trim() || body.trim().length < 10) {
      setError('Please write at least 10 characters in your review')
      return
    }

    setSubmitting(true)
    try {
      await reviewService.addReview({
        productId: product.id,
        productTitle: product.title,
        productSlug: product.slug,
        rating,
        title: title.trim(),
        body: body.trim(),
        images,
      })
      setDone(true)
      setRating(5)
      setTitle('')
      setBody('')
      setImages([])
      onSubmitted?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-brand/40 bg-brand/5 p-6 text-center">
        <p className="text-sm font-semibold text-brand">Thanks for your review! 🎉</p>
        <p className="mt-1 text-xs text-text-muted">
          It's now visible on the product page and homepage.
        </p>
        <Button onClick={() => setDone(false)} variant="outline" size="sm" className="mt-4">
          Write another
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-surface p-5">
      <div>
        <h3 className="text-lg font-bold">Write a review</h3>
        <p className="text-xs text-text-muted">
          Share your experience to help other fans choose.
        </p>
      </div>

      {/* Rating */}
      <div>
        <p className="mb-2 text-sm font-semibold">Your rating</p>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = i + 1
            const active = value <= (hoverRating || rating)
            return (
              <button
                key={value}
                type="button"
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(value)}
                className="p-1"
                aria-label={`${value} stars`}
              >
                <Star
                  className={cn(
                    'h-7 w-7 transition-colors',
                    active ? 'fill-brand text-brand' : 'text-border hover:text-brand/50',
                  )}
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold">Title (optional)</label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sum up your experience"
          maxLength={80}
        />
      </div>

      {/* Body */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold">Your review</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What did you like or dislike? How's the fit, fabric, and finish?"
          rows={4}
          maxLength={2000}
          className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <p className="mt-1 text-[11px] text-text-muted">{body.length}/2000</p>
      </div>

      {/* Images */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold">
          Add photos (optional, max {MAX_REVIEW_IMAGES})
        </label>
        <p className="mb-2 flex items-center gap-1.5 text-[11px] text-orange-400">
          <AlertCircle className="h-3 w-3" />
          Each image must be under 1 MB
        </p>

        <div className="flex flex-wrap gap-2">
          {images.map((url) => (
            <div key={url} className="relative">
              <img
                src={url}
                alt=""
                className="h-20 w-20 rounded-lg border border-border object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {images.length < MAX_REVIEW_IMAGES && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-text-muted transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <ImagePlus className="h-5 w-5" />
                  <span className="text-[10px] font-semibold">Add</span>
                </>
              )}
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-400">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!user && (
        <p className="text-xs text-text-muted">
          You must be signed in to submit a review.
        </p>
      )}

      <Button type="submit" className="w-full" disabled={submitting || uploading || !user}>
        {submitting ? 'Submitting…' : 'Submit review'}
      </Button>
    </form>
  )
}
