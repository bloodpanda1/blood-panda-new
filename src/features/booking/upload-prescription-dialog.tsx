import { AspectRatio } from '#/components/ui/aspect-ratio'
import { Button } from '#/components/ui/button'
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
import { PlusCircleIcon } from 'lucide-react'

export default function UploadPrescriptionDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" size={'xs'} variant={'outline'}>
          <PlusCircleIcon className={'size-4'} />
          Add your Prescription
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload your prescription</DialogTitle>
          <DialogDescription>
            Please upload your prescription in PDF or image format. Make sure
            the file size is less than 5MB. We will review your prescription and
            contact you if we need any additional information.
          </DialogDescription>
        </DialogHeader>
        <div>
          <AspectRatio ratio={16 / 9} className="w-full rounded-lg bg-muted">
            <img
              src="https://avatar.vercel.sh/shadcn1"
              alt="Photo"
              className="h-full w-full animate-pulse rounded-lg object-cover grayscale dark:brightness-20"
            />
          </AspectRatio>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button">Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
