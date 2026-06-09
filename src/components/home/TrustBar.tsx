import { Check } from 'lucide-react'
import { TRUST_ITEMS } from '@/constants/categories'

export function TrustBar() {
  return (
    <section className="border-y border-border bg-surface-elevated py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          {TRUST_ITEMS.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm font-medium">
              <Check className="h-4 w-4 text-brand" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
