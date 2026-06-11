import { useEffect } from 'react'

interface SEOOptions {
  title: string
  description?: string
  canonical?: string
  ogImage?: string
}

const BASE_URL = 'https://www.sportsexe.in'
const DEFAULT_DESCRIPTION =
  'Shop premium football jerseys — clubs, national teams, retro & World Cup editions. Free shipping across India over ₹2,999.'

function setMeta(selector: string, attr: 'content' | 'href', value: string) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null
  if (!el) {
    if (selector.startsWith('link')) {
      el = document.createElement('link')
      ;(el as HTMLLinkElement).rel = 'canonical'
    } else {
      el = document.createElement('meta')
      const nameMatch = selector.match(/name="([^"]+)"/)
      const propMatch = selector.match(/property="([^"]+)"/)
      if (nameMatch) (el as HTMLMetaElement).name = nameMatch[1]
      if (propMatch) (el as HTMLMetaElement).setAttribute('property', propMatch[1])
    }
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

export function useSEO({ title, description, canonical, ogImage }: SEOOptions) {
  useEffect(() => {
    const fullTitle = title.includes('SPORTSEXE') ? title : `${title} | SPORTSEXE`
    const desc = description ?? DEFAULT_DESCRIPTION
    const url = canonical ?? `${BASE_URL}${window.location.pathname}`
    const image = ogImage ?? `${BASE_URL}/Sportsexe.png`

    document.title = fullTitle
    setMeta('meta[name="description"]', 'content', desc)
    setMeta('link[rel="canonical"]', 'href', url)
    setMeta('meta[property="og:title"]', 'content', fullTitle)
    setMeta('meta[property="og:description"]', 'content', desc)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('meta[property="og:image"]', 'content', image)
    setMeta('meta[name="twitter:title"]', 'content', fullTitle)
    setMeta('meta[name="twitter:description"]', 'content', desc)
    setMeta('meta[name="twitter:image"]', 'content', image)
  }, [title, description, canonical, ogImage])
}
