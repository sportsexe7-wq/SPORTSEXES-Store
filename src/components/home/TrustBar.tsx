import { PackageCheck, ShieldCheck, Sparkles } from 'lucide-react'

const TRUST_ITEMS = [
  { icon: PackageCheck, label: 'Imported Quality' },
  { icon: ShieldCheck,  label: 'Secure Payments' },
  { icon: Sparkles,     label: 'Premium Fabric' },
]

export function TrustBar() {
  return (
    <section className="border-y border-border bg-surface-elevated py-4 md:py-5">
      <div className="container mx-auto px-4">
        <div className="flex items-start justify-between">
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 text-center">
              <Icon className="h-6 w-6 shrink-0 text-brand md:h-7 md:w-7" />
              <span className="whitespace-nowrap text-[11px] font-semibold md:text-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
