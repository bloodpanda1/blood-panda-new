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
import { Skeleton } from '#/components/ui/skeleton'
import { Spinner } from '#/components/ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CheckCircle2Icon,
  FileTextIcon,
  PlusCircleIcon,
  UploadCloudIcon,
} from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { toast } from 'sonner'

export default function UploadPrescriptionDialog({
  parentIdx,
}: {
  parentIdx: number
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedSavedUrl, setSelectedSavedUrl] = useState<string | null>(null)

  const form = useFormContext()
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  // Get user's saved prescriptions
  const { data: savedPrescriptions = [], isLoading: isLoadingSaved } = useQuery({
    ...trpc.users.getPrescriptions.queryOptions(),
    enabled: isOpen,
  })

  // Get Cloudinary config for uploading new prescriptions
  const { data: config } = useQuery({
    ...trpc.users.getCloudinarySignature.queryOptions(),
    enabled: isOpen,
  })

  const addPrescriptionMutation = useMutation({
    ...trpc.users.addPrescription.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.users.getPrescriptions.queryKey(),
      })
    },
  })

  // Check if currently attached
  const existingUrl = form.watch(`memberDetails.${parentIdx}.prescriptionUrl`)

  const [activeTab, setActiveTab] = useState<string>(
    savedPrescriptions.length > 0 ? 'saved' : 'upload'
  )

  const handleOpenChange = (val: boolean) => {
    setIsOpen(val)
    if (val) {
      setSelectedSavedUrl(existingUrl || null)
      setFile(null)
      if (savedPrescriptions.length > 0) {
        setActiveTab('saved')
      } else {
        setActiveTab('upload')
      }
    }
  }

  const handleSelectSaved = () => {
    if (!selectedSavedUrl) {
      toast.error('Please select a saved prescription')
      return
    }

    form.setValue(
      `memberDetails.${parentIdx}.prescriptionUrl`,
      selectedSavedUrl,
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      }
    )

    toast.success('Prescription attached to member!')
    setIsOpen(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleUploadNew = async () => {
    if (!file) {
      toast.error('Please select a file to upload')
      return
    }
    if (!config) {
      toast.error('Upload service not initialized yet')
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', config.apiKey)
    formData.append('timestamp', config.timestamp.toString())
    formData.append('signature', config.signature)

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        console.error('Cloudinary Error:', errorData)
        throw new Error(
          errorData?.error?.message || 'Failed to upload file to Cloudinary'
        )
      }

      const data = await res.json()
      const uploadedUrl = data.secure_url

      // Attach to current member form
      form.setValue(`memberDetails.${parentIdx}.prescriptionUrl`, uploadedUrl, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })

      // Also save to user account prescriptions
      const doctorName = form.getValues(`memberDetails.${parentIdx}.doctorName`)
      addPrescriptionMutation.mutate({ url: uploadedUrl, doctorName: doctorName || undefined })

      toast.success('Prescription uploaded and attached successfully!')
      setIsOpen(false)
      setFile(null)
    } catch (error) {
      console.error(error)
      toast.error('Error uploading prescription. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="xs"
          variant={existingUrl ? 'default' : 'outline'}
        >
          <PlusCircleIcon className="size-4" />
          {existingUrl ? 'Change Prescription' : 'Add your Prescription'}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Attach Prescription</DialogTitle>
          <DialogDescription>
            Choose from your previously uploaded prescriptions or upload a new doctor prescription.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="saved">
              Saved Prescriptions ({savedPrescriptions.length})
            </TabsTrigger>
            <TabsTrigger value="upload">Upload New</TabsTrigger>
          </TabsList>

          {/* Tab 1: Saved Prescriptions */}
          <TabsContent value="saved" className="space-y-4 pt-3">
            {isLoadingSaved ? (
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square w-full rounded-md" />
                ))}
              </div>
            ) : savedPrescriptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                <FileTextIcon className="size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No saved prescriptions found in your account.
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveTab('upload')}
                >
                  <UploadCloudIcon className="size-4 mr-1.5" />
                  Upload a new one
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto p-1">
                {savedPrescriptions.map((presc: any, idx: number) => {
                  const url = presc.url
                  const isSelected = selectedSavedUrl === url

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSavedUrl(url)}
                      className={`group relative aspect-square rounded-lg border-2 overflow-hidden text-left transition-all flex flex-col ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary/30 shadow-md'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex-1 w-full relative overflow-hidden">
                        {url.endsWith('.pdf') ? (
                          <div className="flex h-full flex-col items-center justify-center bg-muted/40 p-2 text-center">
                            <FileTextIcon className="size-6 text-primary mb-1" />
                            <span className="text-xs font-medium">PDF Document</span>
                            <span className="text-[10px] text-muted-foreground">
                              Prescription {idx + 1}
                            </span>
                          </div>
                        ) : (
                          <img
                            src={url}
                            alt={`Prescription ${idx + 1}`}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      {(presc.memberName || presc.doctorName) && (
                        <div className="bg-muted p-1 text-center text-[10px] font-medium border-t w-full">
                          {presc.memberName && <div className="truncate">{presc.memberName}</div>}
                          {presc.doctorName && <div className="truncate text-muted-foreground mt-0.5 text-[9px]">Dr. {presc.doctorName.replace(/^Dr\.\s*/i, '')}</div>}
                        </div>
                      )}

                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 rounded-full bg-primary text-primary-foreground p-0.5 shadow-sm">
                          <CheckCircle2Icon className="size-4" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={handleSelectSaved}
                disabled={!selectedSavedUrl || savedPrescriptions.length === 0}
              >
                Attach Selected Prescription
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* Tab 2: Upload New */}
          <TabsContent value="upload" className="space-y-4 pt-3">
            <div className="grid w-full items-center gap-2">
              <p className="text-xs text-muted-foreground">
                Upload in PDF or JPG/PNG image format (max 5MB).
              </p>
              <Input
                id="prescription-file"
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </div>

            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isUploading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={handleUploadNew}
                disabled={isUploading || !file}
              >
                {isUploading && <Spinner className="size-4 mr-2" />}
                {isUploading ? 'Uploading...' : 'Upload & Attach'}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
