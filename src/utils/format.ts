export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: unknown): string {
  if (!date) return '—'
  let d: Date
  if (date instanceof Date) {
    d = date
  } else if (typeof date === 'object' && 'toDate' in (date as object)) {
    d = (date as { toDate(): Date }).toDate()
  } else if (typeof date === 'number') {
    d = new Date(date)
  } else {
    d = new Date(date as string)
  }
  if (isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

export function calculateDiscount(price: number, salePrice?: number): number {
  if (!salePrice || salePrice >= price) return 0
  return Math.round(((price - salePrice) / price) * 100)
}
