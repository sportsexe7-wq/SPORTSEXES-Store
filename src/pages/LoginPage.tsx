import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MailCheck } from 'lucide-react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useAuth } from '@/contexts/AuthContext'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utils/cn'

const signInSchema = z.object({
  identifier: z.string().min(1, 'Email or mobile required'),
  password: z.string().min(6, 'Min 6 characters'),
})

const signUpSchema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid 10-digit phone required').max(10, 'Valid 10-digit phone required'),
  password: z.string().min(6, 'Min 6 characters'),
})

type SignInForm = z.infer<typeof signInSchema>
type SignUpForm = z.infer<typeof signUpSchema>

const PHONE_RE = /^\d{10}$/

async function resolveEmail(identifier: string): Promise<string> {
  if (!PHONE_RE.test(identifier)) return identifier
  const phone = `+91${identifier}`
  const snap = await getDocs(query(collection(db, 'customers'), where('phone', '==', phone)))
  if (snap.empty) throw new Error('No account found for this mobile number')
  return snap.docs[0].data().email as string
}

export function LoginPage() {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin')
  const [error, setError] = useState('')
  const [verificationSent, setVerificationSent] = useState(false)
  const [resending, setResending] = useState(false)
  const { user, signIn, signUp, resendVerification } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? '/account'

  useEffect(() => {
    if (user?.emailVerified) navigate(redirectTo, { replace: true })
  }, [user, navigate, redirectTo])

  const signInForm = useForm<SignInForm>({ resolver: zodResolver(signInSchema) })
  const signUpForm = useForm<SignUpForm>({ resolver: zodResolver(signUpSchema) })

  const onSignIn = async (data: SignInForm) => {
    try {
      setError('')
      const email = await resolveEmail(data.identifier.trim())
      await signIn(email, data.password)
      navigate(redirectTo)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : ''
      setError(msg || 'Invalid credentials')
    }
  }

  const onSignUp = async (data: SignUpForm) => {
    try {
      setError('')
      await signUp(data.email, data.password, data.name, `+91${data.phone}`)
      setVerificationSent(true)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : ''
      setError(msg.includes('email-already-in-use') ? 'Email already in use' : 'Could not create account')
    }
  }

  const handleResend = async () => {
    setResending(true)
    try { await resendVerification() } finally { setResending(false) }
  }

  if (verificationSent) {
    return (
      <div className="container mx-auto flex min-h-[65vh] items-center justify-center px-4 py-12 md:py-20">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
              <MailCheck className="h-8 w-8 text-brand" />
            </div>
            <h2 className="mt-4 text-xl font-bold">Verify your email</h2>
            <p className="mt-2 text-sm text-text-muted">
              We sent a verification link to your email. Click it to activate your account, then sign in.
            </p>
            <p className="mt-3 rounded-lg bg-surface-muted px-3 py-2 text-xs text-text-muted">
              📬 Can't find it? Check your <span className="font-semibold text-text">Spam / Junk</span> folder.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button onClick={() => { setVerificationSent(false); setTab('signin') }}>
                Go to Sign In
              </Button>
              <Button variant="ghost" size="sm" onClick={handleResend} disabled={resending}>
                {resending ? 'Sending…' : 'Resend verification email'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto flex min-h-[65vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <h1 className="text-2xl font-bold">
            {tab === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {redirectTo === '/checkout'
              ? 'Sign in or create a free account to complete your purchase.'
              : tab === 'signin' ? 'Sign in to your SPORTSEXE account' : 'Join SPORTSEXE today'}
          </p>
          {redirectTo === '/checkout' && (
            <div className="mt-3 rounded-lg border border-brand/30 bg-brand/5 px-3 py-2 text-xs text-text-muted">
              You'll be taken straight back to your cart after signing in.
            </div>
          )}

          <div className="mt-6 flex rounded-xl border border-border bg-surface-elevated p-1">
            {(['signin', 'signup'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setTab(t); setError('') }}
                className={cn(
                  'flex-1 rounded-lg py-2 text-sm font-semibold transition-colors',
                  tab === t ? 'bg-brand text-black' : 'text-text-muted hover:text-text',
                )}
              >
                {t === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {tab === 'signin' ? (
            <form onSubmit={signInForm.handleSubmit(onSignIn)} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="si-identifier">Email or Mobile Number</Label>
                <Input
                  id="si-identifier"
                  type="text"
                  inputMode="email"
                  className="mt-1"
                  placeholder="you@example.com or 9876543210"
                  autoComplete="username"
                  {...signInForm.register('identifier')}
                />
                {signInForm.formState.errors.identifier && (
                  <p className="mt-1 text-xs text-red-500">{signInForm.formState.errors.identifier.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="si-password">Password</Label>
                <Input id="si-password" type="password" className="mt-1" autoComplete="current-password" {...signInForm.register('password')} />
                {signInForm.formState.errors.password && (
                  <p className="mt-1 text-xs text-red-500">{signInForm.formState.errors.password.message}</p>
                )}
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" size="lg" disabled={signInForm.formState.isSubmitting}>
                {signInForm.formState.isSubmitting ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>
          ) : (
            <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="su-name">Full Name</Label>
                <Input id="su-name" type="text" className="mt-1" autoComplete="name" {...signUpForm.register('name')} />
                {signUpForm.formState.errors.name && (
                  <p className="mt-1 text-xs text-red-500">{signUpForm.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="su-email">Email</Label>
                <Input id="su-email" type="email" className="mt-1" autoComplete="email" {...signUpForm.register('email')} />
                {signUpForm.formState.errors.email && (
                  <p className="mt-1 text-xs text-red-500">{signUpForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="su-phone">Phone Number</Label>
                <div className="mt-1 flex">
                  <span className="flex items-center rounded-l-md border border-r-0 border-border bg-surface-muted px-3 text-sm text-text-muted">+91</span>
                  <Input
                    id="su-phone"
                    type="tel"
                    className="rounded-l-none"
                    placeholder="9876543210"
                    maxLength={10}
                    autoComplete="tel"
                    {...signUpForm.register('phone')}
                  />
                </div>
                {signUpForm.formState.errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{signUpForm.formState.errors.phone.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="su-password">Password</Label>
                <Input id="su-password" type="password" className="mt-1" autoComplete="new-password" {...signUpForm.register('password')} />
                {signUpForm.formState.errors.password && (
                  <p className="mt-1 text-xs text-red-500">{signUpForm.formState.errors.password.message}</p>
                )}
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" size="lg" disabled={signUpForm.formState.isSubmitting}>
                {signUpForm.formState.isSubmitting ? 'Creating account…' : 'Create Account'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
