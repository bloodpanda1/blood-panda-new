import { Skeleton } from '#/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { IconUserEdit } from '@tabler/icons-react'

export default function EditUserProfileDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={'w-full'} variant={'outline'}>
          Edit Profile <IconUserEdit className={'size-4'} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Skeleton className={'h-48 w-full animate-pulse'} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
