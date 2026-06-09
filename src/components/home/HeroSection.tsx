import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, Play, Banknote, Shield } from 'lucide-react'
import { HERO_SLIDES } from '@/constants/heroSlides'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

export function HeroSection() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  const activeSlide = HERO_SLIDES[selectedIndex]

  return (
    <section className="relative overflow-hidden bg-surface">
      <div ref={emblaRef}>
        <div className="flex">
          {HERO_SLIDES.map((slide) => (
            <div key={slide.id} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative min-h-[70vh] md:min-h-[85vh]">
                {/* Background media */}
                {slide.type === 'product-video' ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={slide.poster}
                    className="absolute inset-0 h-full w-full object-cover"
                  >
                    <source src={slide.video} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={slide.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/25" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/20" />

                {/* Slide content */}
                <div className="container relative mx-auto flex min-h-[70vh] items-center px-4 md:min-h-[85vh]">
                  <AnimatePresence mode="wait">
                    <SlideContent slide={slide} />
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={scrollPrev}
        className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-sm transition-colors hover:bg-black/60 md:left-6"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-sm transition-colors hover:bg-black/60 md:right-6"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots + label */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <p className="text-xs font-medium uppercase tracking-widest text-white/50">
          {slideLabel(activeSlide.type)}
        </p>
        <div className="flex gap-2">
          {HERO_SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === selectedIndex ? 'w-8 bg-brand' : 'w-4 bg-white/40 hover:bg-white/60',
              )}
              aria-label={`Go to ${slideLabel(slide.type)}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function slideLabel(type: (typeof HERO_SLIDES)[number]['type']): string {
  const labels = {
    'wear-the-game': 'Wear the Game',
    review: 'Customer Review',
    'product-video': 'Our Products',
    'world-cup': 'World Cup Edition',
    'partial-cod': 'Partial CoD',
  }
  return labels[type]
}

function SlideContent({ slide }: { slide: (typeof HERO_SLIDES)[number] }) {
  return (
    <motion.div
      key={slide.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45 }}
      className="max-w-2xl"
    >
      {slide.type === 'wear-the-game' && (
        <>
          <span className="inline-block rounded-full border border-brand/30 bg-brand/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
            Premium Football Jerseys
          </span>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Wear the Game.
            <br />
            <span className="text-brand">Own the Moment.</span>
          </h1>
          <p className="mt-4 max-w-lg text-base text-white/75 md:text-lg">
            Imported-quality football jerseys. National teams, clubs, retro classics
            and World Cup editions — delivered across India.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/shop">Shop Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/#shop-by-category">Shop by Country</Link>
            </Button>
          </div>
        </>
      )}

      {slide.type === 'review' && slide.review && (
        <>
          <span className="inline-block rounded-full border border-brand/30 bg-brand/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
            Customer Review
          </span>
          <div className="mt-4 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-5 w-5',
                  i < slide.review.rating ? 'fill-brand text-brand' : 'text-white/20',
                )}
              />
            ))}
          </div>
          <blockquote className="mt-6 text-2xl font-semibold leading-snug md:text-3xl lg:text-4xl">
            &ldquo;{slide.review.text}&rdquo;
          </blockquote>
          <p className="mt-6 text-white/70">
            <span className="font-semibold text-white">{slide.review.name}</span>
            {' · '}{slide.review.location} · {slide.review.product}
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/shop">Shop Best Sellers</Link>
          </Button>
        </>
      )}

      {slide.type === 'product-video' && (
        <>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
            <Play className="h-3.5 w-3.5" />
            See Our Quality
          </span>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl">
            Feel the Fabric.
            <br />
            <span className="text-brand">Live the Match.</span>
          </h2>
          <p className="mt-4 max-w-lg text-base text-white/75 md:text-lg">
            Premium stitching, breathable fabric and authentic prints — every jersey
            is inspected before it ships to you.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/shop">Explore Jerseys</Link>
          </Button>
        </>
      )}

      {slide.type === 'world-cup' && (
        <>
          <span className="inline-block rounded-full border border-brand/30 bg-brand/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
            World Cup 2026 Edition
          </span>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl">
            The Biggest Stage.
            <br />
            <span className="text-brand">The Best Kits.</span>
          </h2>
          <p className="mt-4 max-w-lg text-base text-white/75 md:text-lg">
            Argentina, France, Brazil, Spain and more — national team jerseys built
            for the world&apos;s greatest tournament.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/category/world-cup">Shop World Cup</Link>
          </Button>
        </>
      )}

      {slide.type === 'partial-cod' && (
        <>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
            <Banknote className="h-3.5 w-3.5" />
            Partial Cash on Delivery
          </span>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl">
            Pay 30% Now.
            <br />
            <span className="text-brand">Rest on Delivery.</span>
          </h2>
          <p className="mt-4 max-w-lg text-base text-white/75 md:text-lg">
            Order with confidence — pay a small advance online and settle the balance
            when your jersey arrives at your door.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-brand" />
              Secure checkout
            </span>
            <span className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-brand" />
              Available on orders ₹1,999+
            </span>
          </div>
          <Button asChild size="lg" className="mt-8">
            <Link to="/shop">Order with Partial CoD</Link>
          </Button>
        </>
      )}
    </motion.div>
  )
}
