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
import { IconTrash } from '@tabler/icons-react'

export default function DeleteUserPrescriptionDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'icon-xs'} variant={'destructive'}>
          <IconTrash className={'size-4'} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Prescription</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this prescription? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" variant={'destructive'}>
            Delete Prescription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
