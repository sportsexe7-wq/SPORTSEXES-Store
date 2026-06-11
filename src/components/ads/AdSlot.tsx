import { useEffect } from 'react'
import { cn } from '@/utils/cn'

const CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

let scriptInjected = false
function loadAdSenseScript() {
  if (scriptInjected || !CLIENT_ID || typeof document === 'undefined') return
  // Skip if a script tag for AdSense is already on the page (index.html injects
  // it for the AdSense site-verification crawler).
  if (document.querySelector('script[src*="adsbygoogle.js"]')) {
    scriptInjected = true
    return
  }
  const s = document.createElement('script')
  s.async = true
  s.crossOrigin = 'anonymous'
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT_ID}`
  s.dataset.adsense = 'true'
  document.head.appendChild(s)
  scriptInjected = true
}

interface AdSlotProps {
  slot: string | undefined
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical'
  layout?: 'in-article' | 'in-feed'
  responsive?: boolean
  className?: string
}

export function AdSlot({
  slot,
  format = 'auto',
  layout,
  responsive = true,
  className,
}: AdSlotProps) {
  useEffect(() => {
    if (!CLIENT_ID || !slot) return
    loadAdSenseScript()
    try {
      ;(window.adsbygoogle = window.adsbygoogle ?? []).push({})
    } catch {
      // AdSense queues pushes — safe to ignore if script not yet ready
    }
  }, [slot])

  if (!CLIENT_ID || !slot) return null

  return (
    <div className={cn('mx-auto w-full max-w-5xl px-4 py-6', className)}>
      <p className="mb-1 text-center text-[10px] uppercase tracking-widest text-text-muted/60">
        Advertisement
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layout ? { 'data-ad-layout': layout } : {})}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  )
}

export const AD_SLOTS = {
  homepage: import.meta.env.VITE_ADSENSE_SLOT_HOMEPAGE as string | undefined,
  shop: import.meta.env.VITE_ADSENSE_SLOT_SHOP as string | undefined,
  category: import.meta.env.VITE_ADSENSE_SLOT_CATEGORY as string | undefined,
}
