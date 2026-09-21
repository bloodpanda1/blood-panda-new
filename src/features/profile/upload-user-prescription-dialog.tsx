import { useState } from 'react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
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
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Spinner } from '#/components/ui/spinner'
import { useRouter } from '@tanstack/react-router'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Label } from '#/components/ui/label'

export default function UploadUserPrescriptionDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  
  const trpc = useTRPC()
  const router = useRouter()
  
  const { data: config } = useQuery({
    ...trpc.users.getCloudinarySignature.queryOptions(),
    enabled: isOpen
  })
  const { data: members = [] } = useQuery({
    ...trpc.members.list.queryOptions(),
    enabled: isOpen
  })
  const addPrescriptionMutation = useMutation(trpc.users.addPrescription.mutationOptions())
  const [selectedMember, setSelectedMember] = useState<string>('none')
  const [doctorName, setDoctorName] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload')
      return
    }
    if (!config) {
      toast.error('Upload configuration not ready yet')
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', config.apiKey)
    formData.append('timestamp', config.timestamp.toString())
    formData.append('signature', config.signature)

    try {
      // 1. Upload to Cloudinary using signed upload
      const res = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        console.error('Cloudinary Error:', errorData)
        throw new Error(errorData?.error?.message || 'Failed to upload file to Cloudinary')
      }

      const data = await res.json()
      const secureUrl = data.secure_url

      // 2. Save the URL to the user's profile using TRPC mutation
      await addPrescriptionMutation.mutateAsync({ 
        url: secureUrl,
        memberId: selectedMember !== 'none' ? selectedMember : undefined,
        doctorName: doctorName.trim() || undefined
      })

      toast.success('Prescription uploaded successfully!')
      setIsOpen(false)
      setFile(null)
      setSelectedMember('none')
      setDoctorName('')
      
      // Refresh router data
      router.invalidate()
    } catch (error) {
      console.error(error)
      toast.error('Error uploading prescription. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(val) => {
        setIsOpen(val)
        if (!val) {
          setFile(null)
          setDoctorName('')
        }
    }}>
      <DialogTrigger asChild>
        <Button size={'sm'}>
          <PlusCircleIcon className={'size-4 mr-2'} /> Upload Prescription
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Prescription</DialogTitle>
          <DialogDescription>
            Upload your prescription in PDF or image format. Click upload when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid w-full gap-4 py-4">
          <div className="grid items-center gap-1.5">
            <Label>Prescription File</Label>
            <Input
              id="prescription"
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>
          <div className="grid items-center gap-1.5">
            <Label htmlFor="doctorName">Doctor Name (Optional)</Label>
            <Input
              id="doctorName"
              placeholder="E.g. Dr. John Doe"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              disabled={isUploading}
            />
          </div>
          {members.length > 0 && (
            <div className="grid items-center gap-1.5">
              <Label>Assign to Family Member (Optional)</Label>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a family member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-- None --</SelectItem>
                  {members.map((m: any) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isUploading}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleUpload} disabled={isUploading || !file}>
            {isUploading ? <Spinner className="size-4 mr-2" /> : null}
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
