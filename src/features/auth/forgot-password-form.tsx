import { ArrowLeftCircle } from 'lucide-react'
import { useState, useTransition } from 'react'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import { authClient } from '#/lib/auth-client'
import { Link } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import { toast } from 'sonner'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    startTransition(() => {
      const promise = authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      }).then((res) => {
        if (res.error) {
          throw new Error(res.error.message || 'Failed to send reset email.')
        }
        setSent(true)
        return res
      })

      toast.promise(promise, {
        loading: 'Sending reset link...',
        success: () => 'Reset link sent! Check your inbox.',
        error: (err) => err.message || 'Failed to send reset email.',
      })
    })
  }

  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="grid p-0 md:grid-cols-2">
        <div className="relative hidden md:block">
          <Image
            src="/login-bg.jpeg"
            alt="Image"
            width={643}
            height={203}
            className="h-full w-full object-cover object-right"
            priority={true}
          />
        </div>

        <form onSubmit={handleSubmit} className="relative p-6 md:p-8">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                size={'icon-sm'}
                className={'absolute top-4 left-4'}
              >
                <Link to="/login" viewTransition>
                  <ArrowLeftCircle />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Back to login</p>
            </TooltipContent>
          </Tooltip>

          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Forgot your password?</h1>
              <p className="text-sm text-balance text-muted-foreground">
                {sent
                  ? 'Check your email for a reset link. It may take a minute.'
                  : "Enter your email and we'll send you a reset link."}
              </p>
            </div>

            {!sent && (
              <>
                <Field>
                  <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <FieldDescription>
                    We&apos;ll send a password reset link to this address.
                  </FieldDescription>
                </Field>

                <Field>
                  <Button type="submit" disabled={isPending || !email}>
                    {isPending ? 'Sending...' : 'Send reset link'}
                  </Button>
                </Field>
              </>
            )}

            <FieldDescription className="text-center">
              Remember it?{' '}
              <Link to="/login" viewTransition>
                Sign in
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
