import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CONTACT_INFO, SOCIAL_LINKS } from '@/constants/navigation'

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-elevated">
      {/* Newsletter CTA */}
      <div className="border-b border-border bg-brand/5">
        <div className="container mx-auto px-4 py-12 text-center">
          <h3 className="text-2xl font-bold md:text-3xl">Keep Coming Back for More</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
            Join our newsletter for exclusive drops, VIP early access, and match-day deals.
          </p>
          <form className="mx-auto mt-6 flex max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
            <Input type="email" placeholder="your@email.com" className="flex-1 bg-surface" />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-black tracking-tighter">
              SPORT<span className="text-brand">SEXE</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              Premium imported football jerseys — clubs, nationals, retro &amp; World Cup editions delivered across India.
            </p>
            <div className="mt-4 flex gap-2">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-xs font-bold transition-colors hover:border-brand hover:text-brand"
                  title={social.platform}
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><Link to="/shop" className="hover:text-text">Shop</Link></li>
              <li><Link to="/#shop-by-category" className="hover:text-text">Shop by Country</Link></li>
              <li><Link to="/vip" className="hover:text-text">Join VIP</Link></li>
              <li><Link to="/about" className="hover:text-text">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Support</h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><Link to="/contact" className="hover:text-text">Contact</Link></li>
              <li><Link to="/shipping" className="hover:text-text">Shipping</Link></li>
              <li><Link to="/returns" className="hover:text-text">Returns</Link></li>
              <li><Link to="/privacy" className="hover:text-text">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-3 text-sm text-text-muted">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-text">
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="hover:text-text">
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>{CONTACT_INFO.address}</span>
              </li>
            </ul>
            <p className="mt-3 text-xs text-text-muted">{CONTACT_INFO.hours}</p>
          </div>
        </div>

        <Separator className="my-8" />
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} SPORTSEXE. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:text-text">Terms</Link>
            <Link to="/privacy" className="hover:text-text">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
