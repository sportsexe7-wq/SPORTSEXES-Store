import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, Play, Crown, Clock, Flag, ShoppingBag } from 'lucide-react'
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
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi, onSelect])

  return (
    <section className="relative overflow-hidden">
      <div ref={emblaRef}>
        <div className="flex">
          {HERO_SLIDES.map((slide) => (
            <div key={slide.id} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative min-h-[32vh] md:min-h-[38vh]">
                {slide.type === 'product-video' ? (
                  <video autoPlay muted loop playsInline poster={slide.poster}
                    className="absolute inset-0 h-full w-full object-cover">
                    <source src={slide.video} type="video/mp4" />
                  </video>
                ) : (
                  <img src={slide.image} alt="" className="absolute inset-0 h-full w-full object-cover object-top" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                <div className="container relative mx-auto flex min-h-[38vh] items-center px-4 md:min-h-[44vh]">
                  <AnimatePresence mode="wait">
                    <SlideContent key={slide.id} slide={slide} />
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button type="button" onClick={scrollPrev} aria-label="Previous"
        className="absolute left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 backdrop-blur-sm transition-colors hover:bg-black/55 md:left-5">
        <ChevronLeft className="h-4 w-4 text-white" />
      </button>
      <button type="button" onClick={scrollNext} aria-label="Next"
        className="absolute right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 backdrop-blur-sm transition-colors hover:bg-black/55 md:right-5">
        <ChevronRight className="h-4 w-4 text-white" />
      </button>

      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {HERO_SLIDES.map((slide, i) => (
          <button key={slide.id} type="button" onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={cn(
              'h-1 rounded-full transition-all duration-300',
              i === selectedIndex ? 'w-6 bg-brand' : 'w-3 bg-white/40 hover:bg-white/60',
            )}
          />
        ))}
      </div>
    </section>
  )
}

function SlideContent({ slide }: { slide: (typeof HERO_SLIDES)[number] }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ duration: 0.4 }}
      className="max-w-xl"
    >
      {slide.type === 'wear-the-game' && (
        <div className="space-y-3">
          <span className="inline-block rounded-full border border-white/25 bg-white/10 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-white">
            Premium Football Jerseys
          </span>
          <h1 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
            Wear the Game.{' '}
            <span className="text-brand">Own the Moment.</span>
          </h1>
          <p className="text-sm text-white/75 md:text-base">
            Clubs, nationals &amp; retro — delivered across India.
          </p>
          <div className="flex gap-2 pt-1">
            <Button asChild size="sm"><Link to="/shop">Shop Now</Link></Button>
            <Button asChild size="sm" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
              <Link to="/#shop-by-category">By Country</Link>
            </Button>
          </div>
        </div>
      )}

      {slide.type === 'review' && slide.review && (
        <div className="space-y-3">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={cn('h-4 w-4', i < slide.review.rating ? 'fill-brand text-brand' : 'text-white/30')} />
            ))}
          </div>
          <blockquote className="text-lg font-semibold leading-snug text-white md:text-xl lg:text-2xl">
            &ldquo;{slide.review.text}&rdquo;
          </blockquote>
          <p className="text-sm text-white/60">
            <span className="font-semibold text-white">{slide.review.name}</span>
            {' · '}{slide.review.location}{' · '}{slide.review.product}
          </p>
          <Button asChild size="sm" className="mt-1"><Link to="/shop">Shop Best Sellers</Link></Button>
        </div>
      )}

      {slide.type === 'product-video' && (
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-white">
            <Play className="h-3 w-3" /> See Our Quality
          </span>
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
            Feel the Fabric.{' '}
            <span className="text-brand">Live the Match.</span>
          </h2>
          <p className="text-sm text-white/75 md:text-base">
            Premium stitching &amp; authentic prints — inspected before every shipment.
          </p>
          <Button asChild size="sm" className="mt-1"><Link to="/shop">Explore Jerseys</Link></Button>
        </div>
      )}

      {slide.type === 'world-cup' && (
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-white">
            <Crown className="h-3 w-3" /> World Cup 2026
          </span>
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
            The Biggest Stage.{' '}
            <span className="text-brand">The Best Kits.</span>
          </h2>
          <p className="text-sm text-white/75 md:text-base">
            Argentina, France, Brazil &amp; more — shop now before they sell out.
          </p>
          <Button asChild size="sm" className="mt-1"><Link to="/category/world-cup">Shop World Cup</Link></Button>
        </div>
      )}

      {slide.type === 'world-cup-flags' && (
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-white">
            <Flag className="h-3 w-3" /> World Cup Flags
          </span>
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
            Rep Your Nation.{' '}
            <span className="text-brand">Fly the Flag.</span>
          </h2>
          <p className="text-sm text-white/75 md:text-base">
            Official-style World Cup nation flags — perfect for match days &amp; fan zones.
          </p>
          <Button asChild size="sm" className="mt-1"><Link to="/shop?q=flag">Shop Flags</Link></Button>
        </div>
      )}

      {slide.type === 'accessories' && (
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-white">
            <ShoppingBag className="h-3 w-3" /> Now Available
          </span>
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
            More Than Jerseys.{' '}
            <span className="text-brand">Complete Your Kit.</span>
          </h2>
          <p className="text-sm text-white/75 md:text-base">
            Long socks, shin guards, IPL jerseys &amp; fan flags — everything a fan needs.
          </p>
          <div className="flex gap-2 pt-1">
            <Button asChild size="sm"><Link to="/category/accessories">Shop Accessories</Link></Button>
            <Button asChild size="sm" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
              <Link to="/category/ipl">IPL Jerseys</Link>
            </Button>
          </div>
        </div>
      )}

      {slide.type === 'retro-collection' && (
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-white">
            <Clock className="h-3 w-3" /> Retro Collection
          </span>
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
            Relive the Classics.{' '}
            <span className="text-brand">Own the History.</span>
          </h2>
          <p className="text-sm text-white/75 md:text-base">
            Iconic kits from the 80s, 90s &amp; 2000s — limited stock, authentic feel.
          </p>
          <Button asChild size="sm" className="mt-1"><Link to="/category/retro">Shop Retro</Link></Button>
        </div>
      )}
    </motion.div>
  )
}
