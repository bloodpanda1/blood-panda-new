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
import { PlusCircleIcon } from 'lucide-react'

export default function UploadUserPrescriptionDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'sm'} className={'w-full'}>
          <PlusCircleIcon className={'size-4'} /> Upload Prescription
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Prescription</DialogTitle>
          <DialogDescription>
            Upload your prescription here. Click close when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Skeleton className={'h-48 w-full animate-pulse'} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
