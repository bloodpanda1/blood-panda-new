import { useState } from 'react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { IconUserKey } from '@tabler/icons-react'
import { authClient } from '#/lib/auth-client'
import { toast } from 'sonner'
import { Spinner } from '#/components/ui/spinner'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery, useMutation } from '@tanstack/react-query'

export default function ChangeUserPasswordDialog() {
  const trpc = useTRPC()
  const { data: hasPassword, refetch: refetchHasPassword } = useQuery(trpc.users.hasPassword.queryOptions())
  const setPasswordMutation = useMutation(trpc.users.setPassword.mutationOptions())
  const [isOpen, setIsOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setIsSaving(true)
    try {
      if (!hasPassword) {
        await setPasswordMutation.mutateAsync({ newPassword })
      } else {
        const payload: any = { newPassword, revokeOtherSessions: true, currentPassword }
        const { error } = await authClient.changePassword(payload)
        if (error) throw error
      }
      
      toast.success(hasPassword ? 'Password changed successfully!' : 'Password set successfully!')
      setIsOpen(false)
      refetchHasPassword()
      // Reset form
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password. Are you sure your current password is correct?')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open) {
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    }}>
      <DialogTrigger asChild>
        <Button className={'w-full'} variant={'outline'}>
          {hasPassword ? 'Change Password' : 'Add Password'}
          <IconUserKey className={'size-4 ml-2'} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>{hasPassword ? 'Change Password' : 'Set Password'}</DialogTitle>
            <DialogDescription>
              {hasPassword ? 'Update your account password here.' : 'Create a password for your account.'} You will be logged out of other devices.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {hasPassword && (
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input 
                  type="password" 
                  value={currentPassword} 
                  onChange={e => setCurrentPassword(e.target.value)} 
                  required 
                  disabled={isSaving} 
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input 
                type="password" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                required 
                disabled={isSaving} 
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input 
                type="password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                required 
                disabled={isSaving} 
                minLength={8}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSaving}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving || (hasPassword && !currentPassword) || !newPassword || !confirmPassword}>
              {isSaving ? <Spinner className="size-4 mr-2" /> : null}
              {hasPassword ? 'Update Password' : 'Set Password'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
