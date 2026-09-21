import { Button } from '#/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import { Spinner } from '#/components/ui/spinner'
import { seo } from '#/constants/seo-details'
import { useTRPC } from '#/integrations/trpc/react'
import { signIn, signUp, useSession } from '#/lib/auth-client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { CheckCircleIcon, ExternalLinkIcon, ShieldAlertIcon, MailIcon, KeyIcon, UserIcon as LucideUserIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

export const Route = createFileRoute('/invite-accept')({
  head: () => seo({ path: '/invite-accept' }),
  validateSearch: z.object({
    token: z.string().optional(),
  }),
  component: InviteAcceptPage,
})

function InviteAcceptPage() {
  const { token } = Route.useSearch()
  const router = useRouter()
  const trpc = useTRPC()
  const { data: session, isPending: isSessionLoading } = useSession()
  const [accepted, setAccepted] = useState(false)
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [isSigningUp, setIsSigningUp] = useState(false)

  const { data: invite, isLoading: isInviteLoading, error: inviteError } = useQuery({
    ...trpc.admin.getInvite.queryOptions({ token: token || '' }),
    enabled: !!token,
  })

  const acceptMutation = useMutation({
    ...trpc.admin.acceptInvite.mutationOptions(),
    onSuccess: (data) => {
      setAccepted(true)
      toast.success(`Role updated to ${data.role}!`)
      setTimeout(() => {
        router.navigate({ to: '/admin/dashboard' })
      }, 2000)
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to accept invite')
    }
  })

  useEffect(() => {
    // If we have a valid session, and a valid invite, and they match, and not accepted yet
    if (session?.user && invite && !accepted && !acceptMutation.isPending) {
      if (session.user.email.toLowerCase() === invite.email.toLowerCase()) {
        acceptMutation.mutate({ token: token! })
      }
    }
  }, [session, invite, token, accepted, acceptMutation])

  if (!token) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <ShieldAlertIcon className="mx-auto size-12 text-destructive mb-4" />
            <CardTitle>Invalid Invite</CardTitle>
            <CardDescription>No invitation token was provided.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (isInviteLoading || isSessionLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (inviteError || !invite) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <ShieldAlertIcon className="mx-auto size-12 text-destructive mb-4" />
            <CardTitle>Invalid or Expired Invite</CardTitle>
            <CardDescription>
              {inviteError?.message || 'This invitation link is invalid or has expired.'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (accepted) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CheckCircleIcon className="mx-auto size-16 text-green-500 mb-4" />
            <CardTitle className="text-2xl">Invite Accepted!</CardTitle>
            <CardDescription className="text-base mt-2">
              You have been granted <strong>{invite.role}</strong> access. Redirecting you to the dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // If user is logged in but email doesn't match
  if (session?.user && session.user.email.toLowerCase() !== invite.email.toLowerCase()) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <ShieldAlertIcon className="mx-auto size-12 text-destructive mb-4" />
            <CardTitle>Account Mismatch</CardTitle>
            <CardDescription>
              This invite was sent to <strong>{invite.email}</strong>, but you are logged in as <strong>{session.user.email}</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              variant="outline"
              onClick={() => {
                // Sign out then refresh
                window.location.href = `/invite-accept?token=${token}`
              }}
            >
              Switch Accounts
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If not logged in
  return (
    <div className="flex h-screen w-full items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md border-primary/20 shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-max mb-2">
            <ExternalLinkIcon className="size-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Staff Invitation</CardTitle>
          <CardDescription className="text-base">
            You have been invited to join BloodPanda as a <strong>{invite.role}</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="rounded-lg bg-muted p-4 text-center text-sm">
            Please sign in or create an account with <strong className="text-foreground">{invite.email}</strong> to accept your invitation.
          </div>
          
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault()
            setIsSigningUp(true)
            try {
              const res = await signUp.email({
                email: invite.email,
                password,
                name,
                phone: invite.phone || undefined,
                address: invite.address || undefined,
              })
              if (res.error) {
                toast.error(res.error.message || 'Signup failed')
              }
            } catch (err: any) {
              toast.error(err.message || 'Signup failed')
            } finally {
              setIsSigningUp(false)
            }
          }}>
            <div className="space-y-2 text-left">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <LucideUserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  className="pl-9" 
                  placeholder="John Doe" 
                />
              </div>
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="password">Create Password</Label>
              <div className="relative">
                <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="pl-9" 
                  placeholder="••••••••" 
                  minLength={8}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSigningUp}>
              {isSigningUp ? <Spinner className="size-4 mr-2" /> : <MailIcon className="size-4 mr-2" />}
              Create Account
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button 
            variant="outline"
            className="w-full text-base"
            onClick={async () => {
              await signIn.social({
                provider: 'google',
                callbackURL: `/invite-accept?token=${token}`,
              })
            }}
          >
            Continue with Google
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-4">
            If you sign in with a different email, the invitation will not be accepted.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
