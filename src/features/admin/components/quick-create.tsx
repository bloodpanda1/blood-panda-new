import { useState, useRef } from 'react'
import { CirclePlusIcon, SearchIcon, UserPlusIcon, ClipboardPlusIcon, CheckIcon, XIcon, ArrowLeftIcon, FlaskConical, FileTextIcon } from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '#/components/ui/dialog'
import {
  SidebarMenuButton,
} from '#/components/ui/sidebar'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useSession } from '#/lib/auth-client'
import { cn } from '#/lib/utils'

type Step = 'menu' | 'add-patient' | 'create-order-select-patient' | 'create-order-form'

interface PatientProfile {
  id: string
  name: string
  phone: string
  email: string
  gender: string
  age: string
}

const TIME_SLOTS = [
  'Morning (6AM - 10AM)',
  'Afternoon (10AM - 2PM)',
  'Evening (2PM - 6PM)',
]

export function QuickCreateButton() {
  const { data: session } = useSession()
  const role = (session?.user as any)?.role
  const isSuperAdmin = role === 'SUPER_ADMIN'

  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('menu')

  const [patientForm, setPatientForm] = useState({
    name: '', phone: '', email: '', gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER', age: '',
  })

  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null)
  const [patientSearch, setPatientSearch] = useState('')
  const [testSearch, setTestSearch] = useState('')
  const [selectedTests, setSelectedTests] = useState<{ id: string; name: string; discountedPrice: string }[]>([])
  const [orderForm, setOrderForm] = useState({
    address: '', pinCode: '', city: '', preferredDate: '', preferredTime: '', notes: '', prescriptionUrl: '',
  })

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { data: patientResults = [] } = useQuery({
    ...trpc.admin.searchOfflinePatients.queryOptions({ search: patientSearch || undefined }),
    enabled: step === 'create-order-select-patient',
  })

  const { data: testResults = [] } = useQuery({
    ...trpc.admin.searchBloodTests.queryOptions({ search: testSearch || undefined }),
    enabled: step === 'create-order-form',
  })

  const createPatientMutation = useMutation(
    trpc.admin.createOfflinePatient.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Patient "${data.name}" created!`)
        setSelectedPatient(data as any)
        setStep('create-order-form')
        resetPatientForm()
      },
      onError: (err: any) => toast.error(err.message),
    })
  )

  const createOrderMutation = useMutation(
    trpc.admin.createOfflineOrder.mutationOptions({
      onSuccess: () => {
        toast.success('Order created successfully!')
        queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] })
        handleClose()
      },
      onError: (err: any) => toast.error(err.message),
    })
  )

  function handleClose() {
    setOpen(false)
    setTimeout(() => {
      setStep('menu')
      setSelectedPatient(null)
      setPatientSearch('')
      setTestSearch('')
      setSelectedTests([])
      resetPatientForm()
      setOrderForm({ address: '', pinCode: '', city: '', preferredDate: '', preferredTime: '', notes: '', prescriptionUrl: '' })
    }, 300)
  }

  function resetPatientForm() {
    setPatientForm({ name: '', phone: '', email: '', gender: 'MALE', age: '' })
  }

  function handleAddPatient(e: React.FormEvent) {
    e.preventDefault()
    createPatientMutation.mutate(patientForm)
  }

  function handleCreateOrder(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedPatient) return
    if (selectedTests.length === 0) {
      toast.error('Please select at least one test')
      return
    }
    createOrderMutation.mutate({
      patientProfileId: selectedPatient.id,
      patientName: selectedPatient.name,
      patientPhone: selectedPatient.phone,
      patientGender: selectedPatient.gender as any,
      patientAge: selectedPatient.age,
      ...orderForm,
      testIds: selectedTests.map(t => t.id),
    })
  }

  function toggleTest(test: { id: string; name: string; discountedPrice: string }) {
    setSelectedTests(prev =>
      prev.some(t => t.id === test.id)
        ? prev.filter(t => t.id !== test.id)
        : [...prev, test]
    )
  }


  return (
    <>
      <SidebarMenuButton
        tooltip="Quick Create"
        className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
        onClick={() => setOpen(true)}
      >
        <CirclePlusIcon />
        <span>Quick Create</span>
      </SidebarMenuButton>

      <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">

          {step === 'menu' && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CirclePlusIcon className="size-5 text-primary" /> Quick Create
                </DialogTitle>
                <DialogDescription>
                  {isSuperAdmin ? 'What would you like to create?' : 'Super Admin access required.'}
                </DialogDescription>
              </DialogHeader>
              {!isSuperAdmin ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Only Super Admins can use Quick Create.
                </div>
              ) : (
              <div className="grid grid-cols-1 gap-3 pt-2">
                <button
                  onClick={() => setStep('add-patient')}
                  className="flex items-center gap-4 rounded-xl border p-4 text-left hover:bg-muted transition-colors"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                    <UserPlusIcon className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Add Offline Patient</p>
                    <p className="text-xs text-muted-foreground">Create a patient profile not linked to any account</p>
                  </div>
                </button>
                <button
                  onClick={() => setStep('create-order-select-patient')}
                  className="flex items-center gap-4 rounded-xl border p-4 text-left hover:bg-muted transition-colors"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
                    <ClipboardPlusIcon className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Create Order</p>
                    <p className="text-xs text-muted-foreground">Place a new COD order for an offline patient</p>
                  </div>
                </button>
              </div>
              )}
            </>
          )}

          {step === 'add-patient' && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="size-7 shrink-0" onClick={() => setStep('menu')}>
                    <ArrowLeftIcon className="size-4" />
                  </Button>
                  <DialogTitle>Add Offline Patient</DialogTitle>
                </div>
                <DialogDescription>This patient won't be linked to any user account.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddPatient} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 space-y-1">
                    <Label htmlFor="p-name">Full Name *</Label>
                    <Input id="p-name" placeholder="Patient name" value={patientForm.name}
                      onChange={e => setPatientForm(f => ({ ...f, name: e.target.value }))} required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="p-phone">Phone *</Label>
                    <Input id="p-phone" placeholder="10-digit number" value={patientForm.phone}
                      onChange={e => setPatientForm(f => ({ ...f, phone: e.target.value }))} required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="p-age">Age *</Label>
                    <Input id="p-age" placeholder="e.g. 35" value={patientForm.age}
                      onChange={e => setPatientForm(f => ({ ...f, age: e.target.value }))} required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="p-gender">Gender *</Label>
                    <Select value={patientForm.gender} onValueChange={v => setPatientForm(f => ({ ...f, gender: v as any }))}>
                      <SelectTrigger id="p-gender"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="p-email">Email (optional)</Label>
                    <Input id="p-email" type="email" placeholder="patient@email.com" value={patientForm.email}
                      onChange={e => setPatientForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep('menu')}>Cancel</Button>
                  <Button type="submit" className="flex-1" disabled={createPatientMutation.isPending}>
                    {createPatientMutation.isPending ? 'Creating...' : 'Create & Continue to Order'}
                  </Button>
                </div>
              </form>
            </>
          )}

          {step === 'create-order-select-patient' && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="size-7 shrink-0" onClick={() => setStep('menu')}>
                    <ArrowLeftIcon className="size-4" />
                  </Button>
                  <DialogTitle>Select Patient</DialogTitle>
                </div>
                <DialogDescription>Search for an existing offline patient or add a new one.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 pt-2">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Search by name or phone..."
                    value={patientSearch}
                    onChange={e => setPatientSearch(e.target.value)}
                  />
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1 rounded-lg border p-1">
                  {(patientResults as any[]).length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">No offline patients found.</p>
                  ) : (
                    (patientResults as any[]).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => { setSelectedPatient(p); setStep('create-order-form') }}
                        className="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-muted transition-colors"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-sm">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.phone} · {p.age}y · {p.gender}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
                <Separator />
                <Button variant="outline" className="w-full" onClick={() => setStep('add-patient')}>
                  <UserPlusIcon className="size-4 mr-2" /> Add New Offline Patient
                </Button>
              </div>
            </>
          )}

          {step === 'create-order-form' && selectedPatient && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="size-7 shrink-0"
                    onClick={() => setStep('create-order-select-patient')}>
                    <ArrowLeftIcon className="size-4" />
                  </Button>
                  <DialogTitle>Create Order</DialogTitle>
                </div>
                <DialogDescription>For: <strong>{selectedPatient.name}</strong> · {selectedPatient.phone}</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreateOrder} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Blood Tests *</Label>
                  {selectedTests.length > 0 && (
                    <div className="flex flex-wrap gap-1 p-2 rounded-lg border bg-muted/30">
                      {selectedTests.map(t => (
                        <Badge key={t.id} variant="secondary" className="gap-1 text-xs">
                          <FlaskConical className="size-3" /> {t.name}
                          <button type="button" onClick={() => toggleTest(t)} className="ml-1 hover:text-destructive">
                            <XIcon className="size-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="Search tests..."
                      value={testSearch}
                      onChange={e => setTestSearch(e.target.value)}
                    />
                  </div>
                  <div className="max-h-44 overflow-y-auto space-y-0.5 rounded-lg border p-1">
                    {(testResults as any[]).length === 0 ? (
                      <p className="py-3 text-center text-xs text-muted-foreground">No tests found.</p>
                    ) : (
                      (testResults as any[]).map(t => {
                        const isSelected = selectedTests.some(s => s.id === t.id)
                        return (
                          <button
                            type="button"
                            key={t.id}
                            onClick={() => toggleTest(t)}
                            className={cn(
                              'flex w-full items-center justify-between rounded p-2 text-left text-sm transition-colors',
                              isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                            )}
                          >
                            <span className="truncate">{t.name}</span>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              <span className="text-xs text-muted-foreground">Rs.{t.discountedPrice}</span>
                              {isSelected && <CheckIcon className="size-3.5 text-primary" />}
                            </div>
                          </button>
                        )
                      })
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Collection Address</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 space-y-1">
                      <Label htmlFor="o-address" className="text-xs">Address *</Label>
                      <Input id="o-address" placeholder="House No, Street, Area" value={orderForm.address}
                        onChange={e => setOrderForm(f => ({ ...f, address: e.target.value }))} required />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="o-pin" className="text-xs">Pin Code *</Label>
                      <Input id="o-pin" placeholder="560001" value={orderForm.pinCode}
                        onChange={e => setOrderForm(f => ({ ...f, pinCode: e.target.value }))} required />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="o-city" className="text-xs">City</Label>
                      <Input id="o-city" placeholder="Bengaluru" value={orderForm.city}
                        onChange={e => setOrderForm(f => ({ ...f, city: e.target.value }))} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="o-date" className="text-xs">Preferred Date</Label>
                      <Input id="o-date" type="date" value={orderForm.preferredDate}
                        onChange={e => setOrderForm(f => ({ ...f, preferredDate: e.target.value }))} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="o-time" className="text-xs">Preferred Time</Label>
                      <Select value={orderForm.preferredTime}
                        onValueChange={v => setOrderForm(f => ({ ...f, preferredTime: v }))}>
                        <SelectTrigger id="o-time"><SelectValue placeholder="Select slot" /></SelectTrigger>
                        <SelectContent>
                          {TIME_SLOTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <Label htmlFor="o-notes" className="text-xs">Notes (optional)</Label>
                      <Input id="o-notes" placeholder="Special instructions..." value={orderForm.notes}
                        onChange={e => setOrderForm(f => ({ ...f, notes: e.target.value }))} />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <Label className="text-xs">Prescription (optional)</Label>
                      <PrescriptionUploader
                        draftUrl={orderForm.prescriptionUrl}
                        onUpload={(url) => setOrderForm(f => ({ ...f, prescriptionUrl: url }))}
                        onClear={() => setOrderForm(f => ({ ...f, prescriptionUrl: '' }))}
                      />
                    </div>
                  </div>
                </div>

                {selectedTests.length > 0 && (
                  <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2 text-sm">
                    <span className="text-muted-foreground">{selectedTests.length} test(s) selected</span>
                    <span className="font-semibold">
                      Total: Rs.{selectedTests.reduce((s, t) => s + parseFloat(t.discountedPrice || '0'), 0).toFixed(0)}
                    </span>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <Button type="button" variant="outline" className="flex-1"
                    onClick={() => setStep('create-order-select-patient')}>
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={createOrderMutation.isPending || selectedTests.length === 0}>
                    {createOrderMutation.isPending ? 'Creating...' : 'Create Order'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

function PrescriptionUploader({ draftUrl, onUpload, onClear }: { draftUrl: string, onUpload: (url: string) => void, onClear: () => void }) {
  const trpc = useTRPC()
  const { data: config } = useQuery(trpc.users.getCloudinarySignature.queryOptions())
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    if (!config) return toast.error('Upload configuration not ready')
    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', config.apiKey)
    formData.append('timestamp', config.timestamp.toString())
    formData.append('signature', config.signature)

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/auto/upload`, {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      onUpload(data.secure_url)
    } catch (e: any) {
      toast.error('Error uploading prescription')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col justify-center">
      {draftUrl ? (
        <div className="flex items-center justify-between border ring-1 ring-inset ring-emerald-600/20 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg p-2 px-3 shadow-xs mt-1">
          <a href={draftUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline truncate max-w-[200px]">
            <FileTextIcon className="size-4" />
            View Document
          </a>
          <Button variant="ghost" size="icon" className="size-6 text-emerald-700/60 dark:text-emerald-400/60 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-md" onClick={onClear} disabled={isUploading}>
            <XIcon className="size-3.5" />
          </Button>
        </div>
      ) : (
        <div className="flex gap-2 items-center mt-1">
          <Input
            ref={fileInputRef}
            type="file"
            className="flex-1 text-xs cursor-pointer h-9 px-3"
            disabled={isUploading}
            accept="image/*,.pdf"
            onChange={(e) => {
              if (e.target.files?.[0]) handleUpload(e.target.files[0])
            }}
          />
          {isUploading && <span className="text-xs text-muted-foreground animate-pulse">Uploading...</span>}
        </div>
      )}
    </div>
  )
}
