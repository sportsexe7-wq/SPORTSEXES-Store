import { PackageCheck, ShieldCheck, Sparkles } from 'lucide-react'

const TRUST_ITEMS = [
  { icon: PackageCheck, label: 'Imported Quality' },
  { icon: ShieldCheck,  label: 'Secure Payments' },
  { icon: Sparkles,     label: 'Premium Fabric' },
]

export function TrustBar() {
  return (
    <section className="border-y border-border bg-surface-elevated py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4 md:gap-10">
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs font-semibold md:text-sm">
              <Icon className="h-3.5 w-3.5 shrink-0 text-brand" />
              <span className="whitespace-nowrap">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
