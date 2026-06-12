import { Link } from 'react-router-dom'
import { Home, ShoppingBag, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSEO } from '@/hooks/useSEO'

export function NotFoundPage() {
  useSEO({
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist. Browse jerseys and collections on SPORTSEXE.',
  })

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center px-4 py-16 md:py-24">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-8xl font-black tracking-tighter text-brand md:text-9xl">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          This page missed the goal
        </h1>
        <p className="mt-4 text-lg text-text-muted">
          The link may be broken, or the page may have been moved. Head back to the pitch and
          keep shopping.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/">
              <Home className="h-4 w-4" /> Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/shop">
              <ShoppingBag className="h-4 w-4" /> Browse Shop
            </Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => window.history.back()}
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Go back
        </button>
      </div>
    </div>
  )
}
