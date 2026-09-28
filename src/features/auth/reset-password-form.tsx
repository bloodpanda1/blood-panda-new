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
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import { toast } from 'sonner'

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [isPending, startTransition] = useTransition()
  const navigate = useNavigate()

  // Better Auth appends ?token=... to the redirectTo URL
  const search = useSearch({ strict: false }) as { token?: string }
  const token = search?.token

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (password !== confirm) {
      toast.error('Passwords do not match.')
      return
    }

    if (!token) {
      toast.error('Invalid or missing reset token. Please request a new link.')
      return
    }

    startTransition(() => {
      const promise = authClient.resetPassword({
        newPassword: password,
        token,
      }).then((res) => {
        if (res.error) {
          throw new Error(res.error.message || 'Failed to reset password.')
        }
        setTimeout(() => {
          navigate({ to: '/login', viewTransition: true })
        }, 1500)
        return res
      })

      toast.promise(promise, {
        loading: 'Resetting password...',
        success: () => 'Password reset! Redirecting to login...',
        error: (err) => err.message || 'Failed to reset password.',
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
              <h1 className="text-2xl font-bold">Set a new password</h1>
              <p className="text-sm text-balance text-muted-foreground">
                Enter your new password below.
              </p>
            </div>

            {!token ? (
              <FieldDescription className="text-center text-destructive">
                This link is invalid or has expired.{' '}
                <Link to="/forgot-password" viewTransition>
                  Request a new one
                </Link>
              </FieldDescription>
            ) : (
              <>
                <Field>
                  <FieldLabel htmlFor="new-password">New password</FieldLabel>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Min. 8 characters"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <FieldDescription>Must be at least 8 characters long.</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirm-password">Confirm password</FieldLabel>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Repeat your new password"
                    required
                    minLength={8}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                </Field>

                <Field>
                  <Button
                    type="submit"
                    disabled={isPending || !password || !confirm}
                  >
                    {isPending ? 'Resetting...' : 'Reset password'}
                  </Button>
                </Field>
              </>
            )}
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
