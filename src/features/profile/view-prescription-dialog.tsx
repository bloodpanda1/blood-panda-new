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
import { IconEyeOff } from '@tabler/icons-react'

export default function ViewPrescriptionDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon-xs">
          <IconEyeOff className={'size-4'} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>View Prescription</DialogTitle>
          <DialogDescription>
            See the details of your prescription here. Click close when
            you&apos;re done.
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
