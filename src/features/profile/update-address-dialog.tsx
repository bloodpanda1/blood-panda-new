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
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Spinner } from '#/components/ui/spinner'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MapPinPlusIcon, PencilIcon, PlusIcon } from 'lucide-react'
import { toast } from 'sonner'

export interface AddressData {
  id?: string
  type: 'HOME' | 'OFFICE' | 'OTHER'
  location: string
  houseNo: string
  landmark?: string | null
  pinCode: string
  city?: string | null
  state?: string | null
}

export default function UpdateAddressDialog({
  address,
  trigger,
}: {
  address?: AddressData
  trigger?: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const isEditing = !!address?.id

  const [type, setType] = useState<'HOME' | 'OFFICE' | 'OTHER'>(address?.type || 'HOME')
  const [houseNo, setHouseNo] = useState(address?.houseNo || '')
  const [location, setLocation] = useState(address?.location || '')
  const [landmark, setLandmark] = useState(address?.landmark || '')
  const [pinCode, setPinCode] = useState(address?.pinCode || '')
  const [city, setCity] = useState(address?.city || 'Bengaluru')
  const [state, setState] = useState(address?.state || 'Karnataka')

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const resetForm = () => {
    if (address) {
      setType(address.type || 'HOME')
      setHouseNo(address.houseNo || '')
      setLocation(address.location || '')
      setLandmark(address.landmark || '')
      setPinCode(address.pinCode || '')
      setCity(address.city || 'Bengaluru')
      setState(address.state || 'Karnataka')
    } else {
      setType('HOME')
      setHouseNo('')
      setLocation('')
      setLandmark('')
      setPinCode('')
      setCity('Bengaluru')
      setState('Karnataka')
    }
  }

  const createMutation = useMutation({
    ...trpc.addresses.create.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.addresses.list.queryKey() })
      toast.success('Address saved successfully!')
      setOpen(false)
      resetForm()
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to save address')
    },
  })

  const updateMutation = useMutation({
    ...trpc.addresses.update.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.addresses.list.queryKey() })
      toast.success('Address updated successfully!')
      setOpen(false)
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update address')
    },
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!houseNo.trim()) {
      toast.error('Please enter flat / house / door number')
      return
    }
    if (!location.trim()) {
      toast.error('Please enter street or area location')
      return
    }
    if (!pinCode.trim() || pinCode.trim().length < 6) {
      toast.error('Please enter a valid 6-digit pin code')
      return
    }

    if (isEditing && address?.id) {
      updateMutation.mutate({
        id: address.id,
        type,
        houseNo,
        location,
        landmark: landmark || undefined,
        pinCode,
        city: city || undefined,
        state: state || undefined,
      })
    } else {
      createMutation.mutate({
        type,
        houseNo,
        location,
        landmark: landmark || undefined,
        pinCode,
        city: city || undefined,
        state: state || undefined,
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val)
        if (val) resetForm()
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={isEditing ? 'outline' : 'default'} size={isEditing ? 'sm' : 'default'} className="gap-1.5">
            {isEditing ? (
              <>
                <PencilIcon className="size-3.5" />
                Edit
              </>
            ) : (
              <>
                <PlusIcon className="size-4" />
                Add Address
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPinPlusIcon className="size-5 text-primary" />
              {isEditing ? 'Edit Saved Address' : 'Add New Address'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Update your delivery and home sample collection address.'
                : 'Save an address for hassle-free sample collection.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <Label htmlFor="address-type">Address Type</Label>
              <Select value={type} onValueChange={(val: any) => setType(val)}>
                <SelectTrigger id="address-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOME">Home</SelectItem>
                  <SelectItem value="OFFICE">Office</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="house-no">House / Flat / Door No. *</Label>
              <Input
                id="house-no"
                placeholder="e.g. Flat 302, Green Valley Apts"
                value={houseNo}
                onChange={(e) => setHouseNo(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="location">Street / Colony / Area *</Label>
              <Input
                id="location"
                placeholder="e.g. 12th Main, Indiranagar"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="landmark">Landmark (Optional)</Label>
              <Input
                id="landmark"
                placeholder="e.g. Near Metro Station / Behind Supermarket"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="pincode">Pin Code *</Label>
                <Input
                  id="pincode"
                  placeholder="560001"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Bengaluru"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner className="size-4 mr-2" />}
              {isEditing ? 'Save Changes' : 'Add Address'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
