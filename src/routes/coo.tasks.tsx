import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { getStaffSession } from '#/lib/auth.functions'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useTRPC } from '#/integrations/trpc/react'
import { CalendarIcon, MapPinIcon, ClockIcon, UserIcon, SettingsIcon, FileTextIcon, XIcon, UploadCloudIcon, Loader2Icon } from 'lucide-react'
import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Label } from '#/components/ui/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "#/components/ui/alert-dialog"

export const Route = createFileRoute('/coo/tasks')({
  staticData: { showNavbar: false },
  beforeLoad: async ({ location }) => {
    try {
      const user = await getStaffSession()
      if (user.role !== 'COO' && user.role !== 'SUPER_ADMIN') {
        throw new Error('Forbidden')
      }
      return { user }
    } catch (e) {
      throw redirect({
        to: '/',
        search: { redirect: location.href },
      })
    }
  },
  component: CootasksPage,
})

function CootasksPage() {
  const { user } = Route.useRouteContext()
  const trpc = useTRPC()
  const [showProfile, setShowProfile] = useState(false)
  const [phone, setPhone] = useState((user as any).phone || '')
  const [address, setAddress] = useState((user as any).address || '')
  
  const updateProfileMutation = useMutation(trpc.users.updateMyProfile.mutationOptions({
    onSuccess: () => {
      toast.success('Profile updated successfully')
      setShowProfile(false)
      window.location.reload()
    },
    onError: (error) => toast.error(error.message)
  }))

  const { data: myAssignments = [], isLoading: loadingAssigned, refetch } = useQuery(
    trpc.coo.myAssignments.queryOptions()
  )

  const updateMemberMutation = useMutation({
    ...trpc.admin.updateMemberSampleStatus.mutationOptions(),
    onSuccess: () => {
      toast.success('Report status updated successfully')
      refetch()
    },
    onError: (error) => toast.error(error.message)
  })

  const renderBookingCard = (booking: any) => {
    const schedule = booking.schedules?.[0]
    const address = booking.addresses?.[0]
    
    return (
      <Card key={booking.id} className="overflow-hidden border shadow-sm">
        <CardHeader className="bg-muted/40 pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-semibold">
                #{booking.id.slice(0, 8).toUpperCase()}
              </span>
              <Badge variant="default">
                {booking.status}
              </Badge>
              <Badge variant="outline">
                {booking.type === 'COD' ? 'COD' : 'Online'}
              </Badge>
              {booking.type === 'COD' && booking.paymentStatus === 'PAID' && (
                <Badge variant="default" className="bg-green-600 hover:bg-green-700">PAID</Badge>
              )}
              {booking.type === 'COD' && booking.paymentStatus === 'PENDING' && (
                <Badge variant="destructive">UNPAID</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CalendarIcon className="size-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Schedule</p>
                <p className="text-sm text-muted-foreground">
                  {schedule?.scheduleDate ? new Date(schedule.scheduleDate).toLocaleDateString() : 'N/A'}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <ClockIcon className="size-3" />
                  <span>{schedule?.slot || 'No slot selected'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPinIcon className="size-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {address?.location || booking.address || 'N/A'}
                  {address?.pinCode && ` - ${address.pinCode}`}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 md:col-span-2 mt-4 pt-4 border-t">
              <UserIcon className="size-5 text-primary mt-0.5" />
              <div className="w-full">
                <p className="text-sm font-medium">Patients & Tests (Pending Reports)</p>
                {booking.members?.map((member: any) => (
                  <div key={member.id} className="mt-2 p-3 bg-muted/30 rounded-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{member.name} ({member.age}y, {member.gender})</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {member.phone}{member.email ? ` • ${member.email}` : ''}
                        </p>
                      </div>
                      <Badge variant={member.sampleStatus === 'REPORT_RELEASED' ? 'outline' : 'secondary'} className="text-xs self-start sm:self-auto">
                        {member.sampleStatus}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3 sm:mt-1.5">
                      {member.testItems?.map((test: any) => (
                        <Badge key={test.id} variant="outline" className="text-xs">
                          {test.name}{test.discountedPrice ? ` (₹${test.discountedPrice})` : ''}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-border/50">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Upload Test Report</Label>
                      <ReportUploader 
                        draftUrl={member.reportUrl || ''} 
                        onUpload={(url) => {
                          updateMemberMutation.mutate({
                            id: member.id,
                            status: 'REPORT_RELEASED',
                            reportUrl: url
                          })
                        }} 
                        onClear={() => {
                          updateMemberMutation.mutate({
                            id: member.id,
                            reportUrl: ''
                          })
                        }}
                      />
                    </div>
                  </div>
                ))}

                {booking.user && (
                  <div className="mt-4 pt-3 border-t">
                    <p className="text-sm font-medium">Secondary Contact (Account)</p>
                    <p className="text-sm text-muted-foreground mt-1 break-all sm:break-normal">
                      {booking.user.name} • {booking.user.email}
                      {booking.user.phone ? ` • ${booking.user.phone}` : ''}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container flex h-16 items-center px-4 mx-auto max-w-5xl justify-between">
          <h1 className="text-lg font-bold">COO Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowProfile(true)}>
              <SettingsIcon className="size-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/'}>
              Back
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl p-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">My Tasks</h2>
          <p className="text-muted-foreground mt-1">
            View bookings and samples assigned to you by the Super Admin for reporting.
          </p>
        </div>

        <div className="space-y-4">
          {loadingAssigned ? (
            <p>Loading...</p>
          ) : myAssignments.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-card text-muted-foreground">
              You have no tasks assigned to you right now.
            </div>
          ) : (
            myAssignments.map((booking: any) => renderBookingCard(booking))
          )}
        </div>
      </main>

      <AlertDialog open={showProfile} onOpenChange={setShowProfile}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Profile Settings</AlertDialogTitle>
            <AlertDialogDescription>
              Update your contact information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, City, State, ZIP"
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background min-h-[80px]"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => updateProfileMutation.mutate({ phone, address })} 
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function ReportUploader({ draftUrl, onUpload, onClear }: { draftUrl: string, onUpload: (url: string) => void, onClear: () => void }) {
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
      toast.error('Error uploading report')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col h-10 justify-center">
      {draftUrl ? (
        <div className="flex items-center justify-between border ring-1 ring-inset ring-emerald-600/20 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg p-2 px-3 shadow-xs">
          <a href={draftUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline truncate max-w-[150px]">
            <FileTextIcon className="size-4" />
            View Document
          </a>
          <Button variant="ghost" size="icon" className="size-6 text-emerald-700/60 dark:text-emerald-400/60 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-md" onClick={onClear} disabled={isUploading}>
            <XIcon className="size-3.5" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            accept=".pdf,image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={(e) => {
              if (e.target.files?.[0]) handleUpload(e.target.files[0])
            }} 
          />
          <Button 
            variant="outline" 
            className="w-full h-10 text-[11px] font-bold uppercase tracking-wider bg-card hover:bg-muted/50 border-dashed border-2 shadow-none transition-all" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? <Loader2Icon className="mr-2 size-4 animate-spin text-muted-foreground" /> : <UploadCloudIcon className="mr-2 size-4 text-muted-foreground" />}
            {isUploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </div>
      )}
    </div>
  )
}
