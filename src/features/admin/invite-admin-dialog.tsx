import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { CopyIcon, SendIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function InviteAdminDialog() {
  const trpc = useTRPC()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [role, setRole] = useState<'SUPER_ADMIN' | 'COO' | 'PHLEBOTOMIST'>('COO')
  const [inviteUrl, setInviteUrl] = useState('')

  const inviteMutation = useMutation({
    ...trpc.admin.createInvite.mutationOptions(),
    onSuccess: (data) => {
      const url = `${window.location.origin}/invite-accept?token=${data.token}`
      setInviteUrl(url)
      toast.success('Invite link generated!')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create invite')
    },
  })

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl)
    toast.success('Link copied to clipboard')
  }

  const handleOpenChange = (val: boolean) => {
    setOpen(val)
    if (!val) {
      setEmail('')
      setPhone('')
      setAddress('')
      setRole('COO')
      setInviteUrl('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <SendIcon className="size-4 mr-2" />
          Invite Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Staff Member</DialogTitle>
          <DialogDescription>
            Generate an invitation link for a new staff member. They will need to sign in with this link to activate their role.
          </DialogDescription>
        </DialogHeader>

        {!inviteUrl ? (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">Email Address</label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@bloodpanda.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="phone" className="text-sm font-medium">Phone Number (Optional)</label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="address" className="text-sm font-medium">Address (Optional)</label>
              <Input
                id="address"
                type="text"
                placeholder="123 Main St, City"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={role} onValueChange={(val: any) => setRole(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  <SelectItem value="COO">COO</SelectItem>
                  <SelectItem value="PHLEBOTOMIST">Phlebotomist</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="mt-2"
              disabled={!email || inviteMutation.isPending}
              onClick={() => inviteMutation.mutate({ email, role, phone: phone || undefined, address: address || undefined })}
            >
              {inviteMutation.isPending ? 'Generating...' : 'Generate Link'}
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="rounded-md bg-muted p-4 space-y-3 border">
              <p className="text-sm font-medium">Invitation link generated successfully!</p>
              <div className="flex gap-2">
                <Input value={inviteUrl} readOnly className="font-mono text-xs" />
                <Button size="icon" variant="outline" onClick={handleCopy}>
                  <CopyIcon className="size-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Send this link to {email}. It will expire in 7 days.
              </p>
            </div>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
