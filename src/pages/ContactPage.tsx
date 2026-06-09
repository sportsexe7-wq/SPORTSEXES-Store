import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, MapPin, Phone, Clock } from 'lucide-react'
import { CONTACT_INFO, SOCIAL_LINKS } from '@/constants/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactForm = z.infer<typeof schema>

export function ContactPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactForm>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (_data: ContactForm) => {
    await new Promise((r) => setTimeout(r, 800))
    reset()
    alert('Message sent! We\'ll get back to you within 24 hours.')
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
        <p className="mt-2 text-text-muted">We&apos;d love to hear from you. Drop us a message.</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            {[
              { icon: Mail, label: 'Email', value: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` },
              { icon: Phone, label: 'Phone', value: CONTACT_INFO.phone, href: `tel:${CONTACT_INFO.phone.replace(/\s/g, '')}` },
              { icon: MapPin, label: 'Address', value: CONTACT_INFO.address },
              { icon: Clock, label: 'Hours', value: CONTACT_INFO.hours },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 text-brand" />
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm text-text-muted hover:text-white">{value}</a>
                  ) : (
                    <p className="text-sm text-text-muted">{value}</p>
                  )}
                </div>
              </div>
            ))}
            <div className="pt-4">
              <p className="text-sm font-medium">Follow Us</p>
              <div className="mt-2 flex gap-2">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border px-3 py-1 text-xs font-medium hover:border-brand hover:text-brand"
                  >
                    {s.platform}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <Card className="lg:col-span-3">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" className="mt-1" {...register('name')} />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" className="mt-1" {...register('email')} />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" className="mt-1" {...register('subject')} />
                  {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    className="mt-1 flex min-h-32 w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm"
                    {...register('message')}
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
