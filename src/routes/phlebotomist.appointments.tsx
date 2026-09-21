import { useState, useEffect } from 'react'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '#/components/ui/tabs'
import { Separator } from '#/components/ui/separator'
import { getStaffSession } from '#/lib/auth.functions'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CalendarIcon, MapPinIcon, ClockIcon, UserIcon, ArrowRightIcon, PencilIcon, SettingsIcon } from 'lucide-react'
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

export const Route = createFileRoute('/phlebotomist/appointments')({
  staticData: { showNavbar: false },
  beforeLoad: async ({ location }) => {
    try {
      const user = await getStaffSession()
      if (user.role !== 'PHLEBOTOMIST' && user.role !== 'SUPER_ADMIN') {
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
  component: AppointmentsPage,
})

function AppointmentsPage() {
  const { user } = Route.useRouteContext()
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const [selectedTab, setSelectedTab] = useState('ASSIGNED')
  const [bookingToAssign, setBookingToAssign] = useState<any>(null)
  
  const [showProfile, setShowProfile] = useState(false)
  const [phone, setPhone] = useState((user as any).phone || '')
  const [address, setAddress] = useState((user as any).address || '')
  
  const [scheduleToEdit, setScheduleToEdit] = useState<any>(null)
  const [editDate, setEditDate] = useState('')
  const [editSlot, setEditSlot] = useState('')

  const updateLastActiveMutation = useMutation(trpc.phlebotomist.updateLastActive.mutationOptions())


  const updateProfileMutation = useMutation(trpc.users.updateMyProfile.mutationOptions({
    onSuccess: () => {
      toast.success('Profile updated successfully')
      setShowProfile(false)
      // Soft refresh to reload user data
      window.location.reload()
    },
    onError: (error) => toast.error(error.message)
  }))

  // Update last active time on visit
  useEffect(() => {
    updateLastActiveMutation.mutate()
  }, [])
  const { data: myAssignments = [], isLoading: loadingAssigned } = useQuery(
    trpc.phlebotomist.myAssignments.queryOptions()
  )
  
  const { data: unassigned = [], isLoading: loadingUnassigned } = useQuery(
    trpc.phlebotomist.unassignedBookings.queryOptions()
  )

  const assignMutation = useMutation(
    trpc.phlebotomist.assignToMe.mutationOptions({
      onSuccess: () => {
        toast.success('Booking successfully assigned to you')
        queryClient.invalidateQueries({ queryKey: trpc.phlebotomist.myAssignments.queryKey() })
        queryClient.invalidateQueries({ queryKey: trpc.phlebotomist.unassignedBookings.queryKey() })
        setBookingToAssign(null)
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to assign booking')
        setBookingToAssign(null)
      }
    })
  )

  const markAsPaidMutation = useMutation(
    trpc.phlebotomist.markAsPaid.mutationOptions({
      onSuccess: () => {
        toast.success('Payment status marked as PAID')
        queryClient.invalidateQueries({ queryKey: trpc.phlebotomist.myAssignments.queryKey() })
      },
      onError: (error) => toast.error(error.message)
    })
  )

  const updateSampleStatusMutation = useMutation(
    trpc.admin.updateMemberSampleStatus.mutationOptions({
      onSuccess: () => {
        toast.success('Sample status updated')
        queryClient.invalidateQueries({ queryKey: trpc.phlebotomist.myAssignments.queryKey() })
      },
      onError: (error) => toast.error(error.message)
    })
  )

  const updateScheduleMutation = useMutation(
    trpc.phlebotomist.updateSchedule.mutationOptions({
      onSuccess: () => {
        toast.success('Schedule updated successfully')
        queryClient.invalidateQueries({ queryKey: trpc.phlebotomist.myAssignments.queryKey() })
        setScheduleToEdit(null)
      },
      onError: (error) => toast.error(error.message)
    })
  )

  const { data: statusData, isLoading: loadingStatus } = useQuery(
    trpc.phlebotomist.getStatus.queryOptions()
  )

  const setStatusMutation = useMutation(
    trpc.phlebotomist.setStatus.mutationOptions({
      onSuccess: () => {
        toast.success('Status updated')
        queryClient.invalidateQueries({ queryKey: trpc.phlebotomist.getStatus.queryKey() })
      },
      onError: (error) => toast.error(error.message)
    })
  )

  const handleAssignClick = (booking: any) => {
    setBookingToAssign(booking)
  }

  const confirmAssign = () => {
    if (bookingToAssign) {
      assignMutation.mutate({ bookingId: bookingToAssign.id })
    }
  }

  const handleEditScheduleClick = (schedule: any) => {
    if (!schedule) return
    setScheduleToEdit(schedule)
    
    // Fix date offset issue
    const d = schedule.scheduleDate ? new Date(schedule.scheduleDate) : null
    setEditDate(d ? new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : '')
    
    // Fix slot matching when DB only has '06:00 am'
    const savedSlot = schedule.slot?.toLowerCase() || ''
    const timeSlots = [
      "06:00 am - 07:00 am", "07:00 am - 08:00 am", "08:00 am - 09:00 am",
      "09:00 am - 10:00 am", "10:00 am - 11:00 am", "11:00 am - 12:00 pm",
      "12:00 pm - 01:00 pm", "01:00 pm - 02:00 pm", "02:00 pm - 03:00 pm",
      "03:00 pm - 04:00 pm", "04:00 pm - 05:00 pm", "05:00 pm - 06:00 pm"
    ]
    const matchedSlot = savedSlot ? (timeSlots.find(s => s.startsWith(savedSlot) || savedSlot.startsWith(s.split(' - ')[0])) || savedSlot) : ''
    setEditSlot(matchedSlot)
  }

  const confirmEditSchedule = () => {
    if (scheduleToEdit && editDate && editSlot) {
      updateScheduleMutation.mutate({
        scheduleId: scheduleToEdit.id,
        scheduleDate: new Date(editDate).toISOString(),
        slot: editSlot,
      })
    }
  }

  const renderBookingCard = (booking: any, isUnassigned: boolean) => {
    const schedule = booking.schedules?.[0]
    const address = booking.addresses?.[0]
    
    let totalAmount = 0
    booking.members?.forEach((m: any) => {
      m.testItems?.forEach((t: any) => {
        totalAmount += parseFloat(t.discountedPrice || '0')
      })
    })
    
    return (
      <Card key={booking.id} className="overflow-hidden border shadow-sm">
        <CardHeader className="bg-muted/40 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-semibold">
                #{booking.id.slice(0, 8).toUpperCase()}
              </span>
              <Badge variant={isUnassigned ? "secondary" : "default"}>
                {booking.status}
              </Badge>
              <Badge variant="outline">
                {booking.type === 'COD' ? 'COD' : 'Online'}
              </Badge>
            </div>
            {isUnassigned && (
              <Button onClick={() => handleAssignClick(booking)} className="w-full sm:w-auto h-11 sm:h-9 text-base sm:text-sm">
                Assign to Me <ArrowRightIcon className="ml-2 size-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CalendarIcon className="size-5 text-primary mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Schedule</p>
                  {!isUnassigned && schedule && (
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground" onClick={() => handleEditScheduleClick(schedule)}>
                      <PencilIcon className="size-3" />
                    </Button>
                  )}
                </div>
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                  <p className="text-sm font-medium">Patients & Tests</p>
                  {booking.type === 'COD' && booking.paymentStatus === 'PENDING' && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-red-50/50 p-2 sm:p-0 rounded-md sm:bg-transparent">
                      <span className="text-sm font-bold text-destructive">To Collect: ₹{totalAmount}</span>
                      {!isUnassigned && (
                        <Button variant="outline" onClick={() => markAsPaidMutation.mutate({ bookingId: booking.id })} disabled={markAsPaidMutation.isPending} className="w-full sm:w-auto h-11 sm:h-9 text-base sm:text-sm">
                          Mark as Paid
                        </Button>
                      )}
                    </div>
                  )}
                  {booking.type === 'COD' && booking.paymentStatus === 'PAID' && (
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700 self-start sm:self-auto">PAID ₹{totalAmount}</Badge>
                  )}
                </div>
                {booking.members?.map((member: any) => (
                  <div key={member.id} className="mt-2 p-3 bg-muted/30 rounded-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{member.name} ({member.age}y, {member.gender})</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {member.phone} {member.email ? `• ${member.email}` : ''}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2 sm:mt-0">
                        <Badge variant="outline" className="text-xs">{member.sampleStatus}</Badge>
                        {!isUnassigned && member.sampleStatus === 'BOOKED' && (
                          <Button variant="secondary" className="h-11 sm:h-8 text-base sm:text-xs w-full sm:w-auto mt-2 sm:mt-0" onClick={() => updateSampleStatusMutation.mutate({ id: member.id, status: 'COLLECTED' })} disabled={updateSampleStatusMutation.isPending}>
                            Mark Collected
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3 sm:mt-1.5">
                      {member.testItems?.map((test: any) => (
                        <Badge key={test.id} variant="outline" className="text-xs">
                          {test.name} {test.discountedPrice ? `(₹${test.discountedPrice})` : ''}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
                
                {booking.user && (
                  <div className="mt-4 pt-3 border-t">
                    <p className="text-sm font-medium">Secondary Contact (Account)</p>
                    <p className="text-sm text-muted-foreground mt-1 break-all sm:break-normal">
                      {booking.user.name} • {booking.user.email}
                      {booking.mobileNumber ? ` • ${booking.mobileNumber}` : ''}
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
    <div className="min-h-screen bg-background pb-10">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container flex h-16 items-center px-4 mx-auto max-w-5xl justify-between">
          <h1 className="text-lg font-bold">Phlebotomist Portal</h1>
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

      <main className="container mx-auto max-w-5xl p-4 py-6 sm:py-8">
        <Card className="mb-6 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-slate-500 font-medium">Current Status</span>
                  <div className="flex items-center gap-2 mt-1">
                    {loadingStatus ? (
                      <span className="text-lg font-bold">Loading...</span>
                    ) : (
                      <>
                        <div className={`w-3 h-3 rounded-full ${statusData?.status === 'AVAILABLE' ? 'bg-green-500' : statusData?.status === 'ON_COLLECTION' ? 'bg-blue-500' : 'bg-slate-400'}`} />
                        <span className="text-2xl font-bold">
                          {statusData?.status === 'AVAILABLE' ? 'Available' : statusData?.status === 'ON_COLLECTION' ? 'On-Collection' : 'Off-Duty'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant={statusData?.status === 'AVAILABLE' ? 'default' : 'outline'} 
                  className={statusData?.status === 'AVAILABLE' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                  onClick={() => setStatusMutation.mutate({ status: 'AVAILABLE' })}
                  disabled={setStatusMutation.isPending || statusData?.status === 'ON_COLLECTION'}
                >
                  Set Available
                </Button>
                <Button 
                  variant={statusData?.status === 'OFF_DUTY' ? 'default' : 'outline'}
                  className={statusData?.status === 'OFF_DUTY' ? 'bg-slate-600 hover:bg-slate-700 text-white' : ''}
                  onClick={() => setStatusMutation.mutate({ status: 'OFF_DUTY' })}
                  disabled={setStatusMutation.isPending || statusData?.status === 'ON_COLLECTION'}
                >
                  Set Off-Duty
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Appointments</h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            View your assigned tasks and accept new sample collection requests.
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="mb-6 w-full flex flex-col sm:flex-row h-auto gap-2 sm:gap-0 bg-transparent sm:bg-muted p-0 sm:p-1">
            <TabsTrigger value="ASSIGNED" className="w-full h-12 sm:h-9 border sm:border-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground sm:data-[state=active]:bg-background sm:data-[state=active]:text-foreground text-sm">
              My Assignments ({myAssignments.length})
            </TabsTrigger>
            <TabsTrigger value="AVAILABLE" className="w-full h-12 sm:h-9 border sm:border-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground sm:data-[state=active]:bg-background sm:data-[state=active]:text-foreground text-sm">
              Available to Assign ({unassigned.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ASSIGNED" className="space-y-4">
            {loadingAssigned ? (
              <p>Loading...</p>
            ) : myAssignments.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-card text-muted-foreground">
                You have no assigned appointments.
              </div>
            ) : (
              myAssignments.map((booking: any) => renderBookingCard(booking, false))
            )}
          </TabsContent>
          
          <TabsContent value="AVAILABLE" className="space-y-4">
            {loadingUnassigned ? (
              <p>Loading...</p>
            ) : unassigned.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-card text-muted-foreground">
                No new appointments available right now.
              </div>
            ) : (
              unassigned.map((booking: any) => renderBookingCard(booking, true))
            )}
          </TabsContent>
        </Tabs>
      </main>

      <AlertDialog open={!!bookingToAssign} onOpenChange={(open) => !open && setBookingToAssign(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Assign Booking to Yourself?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to assign booking #{bookingToAssign?.id.slice(0, 8).toUpperCase()} to yourself? 
              You will be responsible for this sample collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAssign} disabled={assignMutation.isPending}>
              {assignMutation.isPending ? 'Assigning...' : 'Yes, Assign to Me'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!scheduleToEdit} onOpenChange={(open) => !open && setScheduleToEdit(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reschedule Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Update the date and time slot for this sample collection. This will be visible to the admin and the customer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Slot</label>
              <select
                value={editSlot}
                onChange={(e) => setEditSlot(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="">Select a slot</option>
                <option value="06:00 am - 07:00 am">06:00 am - 07:00 am</option>
                <option value="07:00 am - 08:00 am">07:00 am - 08:00 am</option>
                <option value="08:00 am - 09:00 am">08:00 am - 09:00 am</option>
                <option value="09:00 am - 10:00 am">09:00 am - 10:00 am</option>
                <option value="10:00 am - 11:00 am">10:00 am - 11:00 am</option>
                <option value="11:00 am - 12:00 pm">11:00 am - 12:00 pm</option>
                <option value="12:00 pm - 01:00 pm">12:00 pm - 01:00 pm</option>
                <option value="01:00 pm - 02:00 pm">01:00 pm - 02:00 pm</option>
                <option value="02:00 pm - 03:00 pm">02:00 pm - 03:00 pm</option>
                <option value="03:00 pm - 04:00 pm">03:00 pm - 04:00 pm</option>
                <option value="04:00 pm - 05:00 pm">04:00 pm - 05:00 pm</option>
                <option value="05:00 pm - 06:00 pm">05:00 pm - 06:00 pm</option>
              </select>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmEditSchedule} disabled={!editDate || !editSlot || updateScheduleMutation.isPending}>
              {updateScheduleMutation.isPending ? 'Saving...' : 'Save Changes'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
