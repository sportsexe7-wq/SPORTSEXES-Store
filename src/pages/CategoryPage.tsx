import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Trophy } from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'
import { productService } from '@/services/productService'
import { COUNTRY_ACHIEVEMENTS } from '@/constants/countryAchievements'

const CATEGORY_MAP: Record<string, { title: string; filter: Parameters<typeof productService.getAll>[0] }> = {
  clubs: { title: 'Club Jerseys', filter: { category: 'Clubs' } },
  countries: { title: 'National Team Jerseys', filter: { category: 'Countries' } },
  retro: { title: 'Retro Collection', filter: { retroEdition: true } },
  'world-cup': { title: 'World Cup Collection', filter: { category: 'World Cup' } },
  'training-kits': { title: 'Training Kits', filter: { category: 'Training Kits' } },
  'player-edition': { title: 'Player Edition', filter: { playerEdition: true } },
  argentina: { title: 'Argentina', filter: { country: 'Argentina' } },
  brazil: { title: 'Brazil', filter: { country: 'Brazil' } },
  spain: { title: 'Spain', filter: { country: 'Spain' } },
  germany: { title: 'Germany', filter: { country: 'Germany' } },
  portugal: { title: 'Portugal', filter: { country: 'Portugal' } },
  france: { title: 'France', filter: { country: 'France' } },
  italy: { title: 'Italy', filter: { country: 'Italy' } },
  england: { title: 'England', filter: { country: 'England' } },
  netherlands: { title: 'Netherlands', filter: { country: 'Netherlands' } },
  belgium: { title: 'Belgium', filter: { country: 'Belgium' } },
  croatia: { title: 'Croatia', filter: { country: 'Croatia' } },
  morocco: { title: 'Morocco', filter: { country: 'Morocco' } },
  colombia: { title: 'Colombia', filter: { country: 'Colombia' } },
  uruguay: { title: 'Uruguay', filter: { country: 'Uruguay' } },
  mexico: { title: 'Mexico', filter: { country: 'Mexico' } },
  usa: { title: 'USA', filter: { country: 'USA' } },
}

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const config = slug ? CATEGORY_MAP[slug] : undefined
  const achievements = slug ? COUNTRY_ACHIEVEMENTS[slug] : undefined

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'category', slug],
    queryFn: () => productService.getAll(config?.filter),
    enabled: !!slug,
  })

  const title = config?.title ?? slug?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) ?? 'Category'

  return (
    <div>
      {/* Country achievements banner */}
      {achievements && (
        <div className="border-b border-border bg-surface-elevated">
          <div className="container mx-auto px-4 py-8 md:py-10">
            {/* Header */}
            <div className="mb-6 flex items-center gap-4">
              <span className="text-5xl">{achievements.flag}</span>
              <div>
                <h1 className="text-2xl font-black md:text-3xl">{title}</h1>
                <p className="text-sm text-text-muted">
                  {achievements.nickname} · {achievements.confederation} · FIFA #{achievements.rank}
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
                {achievements.stats.map((s) => (
                  <div key={s.label} className="rounded-xl border border-border bg-surface p-4 text-center">
                    <p className="text-xl font-black text-brand">{s.value}</p>
                    <p className="mt-0.5 text-xs text-text-muted">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Highlights */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="h-4 w-4 text-brand" />
                  <h2 className="text-sm font-bold uppercase tracking-wider">Key Achievements</h2>
                </div>
                <div className="space-y-2">
                  {achievements.highlights.map((h) => (
                    <div key={`${h.year}-${h.title}`} className="flex items-center gap-3">
                      <span className="shrink-0 rounded-md bg-brand/10 px-2 py-0.5 text-xs font-bold text-brand">
                        {h.year}
                      </span>
                      <span className="text-sm font-medium">{h.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products */}
      <div className="container mx-auto px-4 py-8 md:py-10">
        {!achievements && <h1 className="mb-2 text-3xl font-bold">{title}</h1>}
        <p className="mb-6 text-text-muted">{products.length} jerseys available</p>

        {isLoading ? (
          <p className="text-center text-text-muted">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-text-muted">No jerseys found in this category.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
