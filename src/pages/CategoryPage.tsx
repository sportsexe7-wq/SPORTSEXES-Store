import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ProductCard } from '@/components/product/ProductCard'
import { productService } from '@/services/productService'

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

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'category', slug],
    queryFn: () => productService.getAll(config?.filter),
    enabled: !!slug,
  })

  const title = config?.title ?? slug?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) ?? 'Category'

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="mb-2 text-3xl font-bold">{title}</h1>
      <p className="mb-8 text-text-muted">{products.length} products</p>

      {isLoading ? (
        <p className="text-center text-text-muted">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-text-muted">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
