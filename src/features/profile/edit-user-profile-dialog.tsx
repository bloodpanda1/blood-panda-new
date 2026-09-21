import { useState, useEffect } from 'react'
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
import { IconUserEdit } from '@tabler/icons-react'
import { authClient } from '#/lib/auth-client'
import { toast } from 'sonner'
import { Spinner } from '#/components/ui/spinner'
import { useRouter } from '@tanstack/react-router'

export default function EditUserProfileDialog() {
  const { data: session, isPending } = authClient.useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name)
    }
  }, [session, isOpen])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Name cannot be empty')
      return
    }

    setIsSaving(true)
    try {
      const { error } = await authClient.updateUser({
        name: name.trim()
      })
      if (error) throw error
      toast.success('Profile updated successfully!')
      setIsOpen(false)
      router.invalidate() // Refresh router data
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={'w-full'} variant={'outline'}>
          Edit Profile <IconUserEdit className={'size-4 ml-2'} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              {isPending ? (
                <Spinner className="size-4" />
              ) : (
                <Input value={name} onChange={e => setName(e.target.value)} required disabled={isSaving} />
              )}
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={session?.user?.email || ''} disabled className="bg-muted opacity-70" />
              <p className="text-xs text-muted-foreground">Email cannot be changed directly.</p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSaving}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving || isPending || !name.trim()}>
              {isSaving ? <Spinner className="size-4 mr-2" /> : null}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
