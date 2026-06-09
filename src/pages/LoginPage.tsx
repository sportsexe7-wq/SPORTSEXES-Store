import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utils/cn'

const signInSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Min 6 characters'),
})

const signUpSchema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Min 6 characters'),
})

type SignInForm = z.infer<typeof signInSchema>
type SignUpForm = z.infer<typeof signUpSchema>

export function LoginPage() {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin')
  const [error, setError] = useState('')
  const { user, signIn, signUp } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/account', { replace: true })
  }, [user, navigate])

  const signInForm = useForm<SignInForm>({ resolver: zodResolver(signInSchema) })
  const signUpForm = useForm<SignUpForm>({ resolver: zodResolver(signUpSchema) })

  const onSignIn = async (data: SignInForm) => {
    try {
      setError('')
      await signIn(data.email, data.password)
      navigate('/account')
    } catch {
      setError('Invalid email or password')
    }
  }

  const onSignUp = async (data: SignUpForm) => {
    try {
      setError('')
      await signUp(data.email, data.password, data.name)
      navigate('/account')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : ''
      setError(msg.includes('email-already-in-use') ? 'Email already in use' : 'Could not create account')
    }
  }

  return (
    <div className="container mx-auto flex min-h-[65vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <h1 className="text-2xl font-bold">
            {tab === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {tab === 'signin' ? 'Sign in to your SPORTSEXE account' : 'Join SPORTSEXE today'}
          </p>

          {/* Tab toggle */}
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
                <Label htmlFor="si-email">Email</Label>
                <Input id="si-email" type="email" className="mt-1" autoComplete="email" {...signInForm.register('email')} />
                {signInForm.formState.errors.email && (
                  <p className="mt-1 text-xs text-red-500">{signInForm.formState.errors.email.message}</p>
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
