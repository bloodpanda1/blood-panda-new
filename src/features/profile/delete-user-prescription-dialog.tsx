import { useState } from 'react'
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
import { Spinner } from '#/components/ui/spinner'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'

export default function DeleteUserPrescriptionDialog({
  url,
  trigger,
}: {
  url: string
  trigger?: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const deleteMutation = useMutation({
    ...trpc.users.deletePrescription.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.users.getPrescriptions.queryKey() })
      router.invalidate()
      toast.success('Prescription removed from your list')
      setOpen(false)
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to remove prescription')
    },
  })

  const handleDelete = () => {
    deleteMutation.mutate({ url })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size="icon-xs"
            variant="destructive"
            className="size-7 rounded-full shadow-sm hover:scale-105 transition-transform"
            title="Remove prescription from list"
          >
            <Trash2Icon className="size-3.5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remove Prescription</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this prescription from your list? Existing orders linked to this prescription will remain intact for medical reference.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button variant="outline" disabled={deleteMutation.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending && <Spinner className="size-4 mr-2" />}
            Remove Prescription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
