import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Skeleton } from '#/components/ui/skeleton'
import { Spinner } from '#/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { seo } from '#/constants/seo-details'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  MoreVerticalIcon,
  BanknoteIcon,
  CreditCardIcon,
  ZapIcon,
  UploadCloudIcon,
  XIcon,
  UserIcon,
  ActivityIcon,
  FileTextIcon,
  CalendarIcon,
  UsersIcon,
  MapPinIcon,
  ClockIcon,
  MailIcon,
  ShoppingBagIcon,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { cn } from '#/lib/utils'
import { useState, useRef, useEffect } from 'react'
import { useSession } from '#/lib/auth-client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from '#/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '#/components/ui/dialog'
import { Label } from '#/components/ui/label'

import { z } from 'zod'

const searchSchema = z.object({
  bookingId: z.string().optional()
})

export const Route = createFileRoute('/admin/bookings')({
  validateSearch: searchSchema,
  head: () => seo({ path: '/admin/bookings' }),
  component: RouteComponent,
  pendingComponent: PendingComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
  wrapInSuspense: true,
  codeSplitGroupings: [
    ['component', 'pendingComponent', 'errorComponent', 'notFoundComponent'],
  ],
})

const bookingTypeColors: Record<string, string> = {
  INSTANT_BOOKING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  COD: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  ONLINE_PAYMENT: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/20 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/20',
  CONFIRMED: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20',
  COMPLETED: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20',
  CANCELLED: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20',
}

const sampleStatusColors: Record<string, string> = {
  BOOKED: 'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/20 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/20',
  COLLECTED: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20',
  RECEIVED: 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20 dark:bg-purple-500/10 dark:text-purple-400 dark:ring-purple-500/20',
  ACCESSIONED: 'bg-pink-50 text-pink-700 ring-1 ring-inset ring-pink-600/20 dark:bg-pink-500/10 dark:text-pink-400 dark:ring-pink-500/20',
  PROCESSING: 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-indigo-500/20',
  VERIFIED: 'bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-600/20 dark:bg-teal-500/10 dark:text-teal-400 dark:ring-teal-500/20',
  REPORT_RELEASED: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20',
}

const paymentStatusColors: Record<string, string> = {
  PENDING: 'bg-orange-50 text-orange-600 ring-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/20',
  PAID: 'bg-emerald-50 text-emerald-600 ring-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20',
  FAILED: 'bg-red-50 text-red-600 ring-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20',
  REFUNDED: 'bg-blue-50 text-blue-600 ring-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20',
}

function RouteComponent() {
  const { bookingId } = Route.useSearch()
  const trpc = useTRPC()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const limit = 20

  const { data: session } = useSession()
  const userRole = (session?.user as any)?.role || 'USER'

  const { data, isLoading, refetch } = useQuery(
    trpc.admin.bookings.queryOptions({ page, limit })
  )
  const updateStatusMutation = useMutation({
    ...trpc.admin.updateBookingStatus.mutationOptions(),
    onSuccess: () => {
      toast.success('Status updated successfully')
      refetch()
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update status')
    }
  })
  const [drafts, setDrafts] = useState<Record<string, { status: string, reportUrl: string }>>({})
  const [isSaving, setIsSaving] = useState(false)

  const updateMemberMutation = useMutation({
    ...trpc.admin.updateMemberSampleStatus.mutationOptions()
  })

  const updateAssignmentsMutation = useMutation({
    ...trpc.admin.updateBookingAssignments.mutationOptions(),
    onSuccess: () => {
      toast.success('Assignments updated successfully')
      refetch()
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update assignments')
    }
  })

  const [isEditingSchedule, setIsEditingSchedule] = useState(false)
  const [editDate, setEditDate] = useState('')
  const [editTime, setEditTime] = useState('')
  const [activeMemberId, setActiveMemberId] = useState<string>('')
  const [modalTab, setModalTab] = useState<'booking' | 'staff' | 'patients'>('booking')

  const updateScheduleMutation = useMutation({
    ...trpc.admin.updateBookingSchedule.mutationOptions(),
    onSuccess: () => {
      toast.success('Schedule updated successfully')
      setIsEditingSchedule(false)
      refetch()
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update schedule')
    }
  })

  const { data: staffMembers = [] } = useQuery(trpc.admin.staff.queryOptions({}))
  const phlebotomists = staffMembers.filter((s: any) => s.role === 'PHLEBOTOMIST' || s.role === 'SUPER_ADMIN')
  const coos = staffMembers.filter((s: any) => s.role === 'COO' || s.role === 'SUPER_ADMIN')

  const openModal = (booking: any) => {
    setSelectedBooking(booking)
    setIsEditingSchedule(false)
    setModalTab('booking')
    const initialDate = booking.type === 'INSTANT_BOOKING' ? booking.preferredDate : booking.schedules?.[0]?.scheduleDate
    const initialTime = booking.type === 'INSTANT_BOOKING' ? booking.preferredTime : booking.schedules?.[0]?.slot
    setEditDate(initialDate ? new Date(new Date(initialDate).getTime() - new Date(initialDate).getTimezoneOffset() * 60000).toISOString().split('T')[0] : '')
    setEditTime(initialTime || '')
    const initialDrafts: Record<string, { status: string, reportUrl: string }> = {}
    booking.members?.forEach((m: any) => {
      initialDrafts[m.id] = { status: m.sampleStatus ?? 'PENDING', reportUrl: m.reportUrl ?? '' }
    })
    setDrafts(initialDrafts)
    if (booking.members?.length > 0) {
      setActiveMemberId(booking.members[0].id)
    }
  }

  useEffect(() => {
    if (bookingId && data?.bookings) {
      const booking = data.bookings.find((b: any) => b.id === bookingId)
      if (booking && (!selectedBooking || selectedBooking.id !== bookingId)) {
        openModal(booking)
      }
    }
  }, [bookingId, data])

  const handleSave = async () => {
    if (!selectedBooking) return
    setIsSaving(true)
    try {
      const promises = selectedBooking.members.map((member: any) => {
        const draft = drafts[member.id]
        if (!draft) return Promise.resolve()
        if (draft.status !== member.sampleStatus || draft.reportUrl !== (member.reportUrl || '')) {
          return updateMemberMutation.mutateAsync({
            id: member.id,
            status: draft.status as any,
            reportUrl: draft.reportUrl || ''
          })
        }
        return Promise.resolve()
      })
      await Promise.all(promises)
      toast.success('Patients updated successfully')
      refetch()
      setSelectedBooking(null)
      setDrafts({})
    } catch (e: any) {
      toast.error(e.message || 'Failed to update patients')
    } finally {
      setIsSaving(false)
    }
  }

  const canSave = selectedBooking?.members?.every((member: any) => {
    const draft = drafts[member.id]
    if (!draft) return true
    if (draft.status === 'REPORT_RELEASED' && !draft.reportUrl) return false
    return true
  }) ?? true
  
  const updatePaymentStatusMutation = useMutation({
    ...trpc.admin.updateBookingPaymentStatus.mutationOptions(),
    onSuccess: () => {
      toast.success('Payment status updated successfully')
      refetch()
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update payment status')
    }
  })

  const bookings = data?.bookings ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / limit)

  useEffect(() => {
    if (selectedBooking && bookings.length > 0) {
      const updated = bookings.find((b: any) => b.id === selectedBooking.id)
      if (updated) {
        setSelectedBooking(updated)
      }
    }
  }, [bookings])

  const filtered = search
    ? bookings.filter(
        (b: any) =>
          b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
          b.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
          b.id.toLowerCase().includes(search.toLowerCase())
      )
    : bookings

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <Badge variant="outline">{total} total</Badge>
      </div>

      <div className="relative max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email or ID..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Account & Patients</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                  <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((booking: any) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-mono text-xs">{booking.id.slice(0, 8)}…</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">
                        {booking.user?.name ?? 'Guest'} <span className="text-muted-foreground font-normal">({booking.user?.email ?? 'No email'})</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {booking.type === 'INSTANT_BOOKING' ? booking.mobileNumber : booking.user?.phone || 'No phone'}
                      </p>
                      {booking.members && booking.members.length > 0 ? (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          <span className="font-medium">Patients:</span> {booking.members.map((m: any) => m.name).join(', ')}
                        </p>
                      ) : booking.fullName ? (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          <span className="font-medium">Patient:</span> {booking.fullName}
                        </p>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                      <div className="flex flex-col gap-2 items-start">
                        <div className="flex items-center text-[11px] font-medium text-muted-foreground">
                          {booking.type === 'COD' && <BanknoteIcon className="mr-1.5 size-3.5 text-blue-500" />}
                          {booking.type === 'ONLINE_PAYMENT' && <CreditCardIcon className="mr-1.5 size-3.5 text-emerald-500" />}
                          {booking.type === 'INSTANT_BOOKING' && <ZapIcon className="mr-1.5 size-3.5 text-amber-500" />}
                          {booking.type?.replace('_', ' ')}
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ring-1 ring-inset ${paymentStatusColors[booking.paymentStatus ?? 'PENDING']}`}>
                          {booking.paymentStatus ?? 'PENDING'}
                        </span>
                      </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{booking.city ?? booking.address ?? '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openModal(booking)}>
                          Manage Booking
                        </DropdownMenuItem>
                        {userRole === 'SUPER_ADMIN' && (
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Payment Status</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => updatePaymentStatusMutation.mutate({ id: booking.id, status: 'PENDING' })}>Pending</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updatePaymentStatusMutation.mutate({ id: booking.id, status: 'PAID' })}>Paid</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updatePaymentStatusMutation.mutate({ id: booking.id, status: 'FAILED' })}>Failed</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updatePaymentStatusMutation.mutate({ id: booking.id, status: 'REFUNDED' })}>Refunded</DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{total} total bookings</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="size-8" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>
            <ChevronLeftIcon className="size-4" />
          </Button>
          <span>Page {page} of {totalPages || 1}</span>
          <Button variant="outline" size="icon" className="size-8" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>

      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent showCloseButton={false} className="max-w-2xl w-[95vw] sm:w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[85vh] overflow-y-auto rounded-xl sm:rounded-2xl p-0 overflow-hidden border-none shadow-2xl flex flex-col">
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <ActivityIcon className="size-5 text-primary" />
                  Manage Booking
                </DialogTitle>
              </DialogHeader>
              <Badge variant="outline" className="font-mono bg-muted/50 text-xs py-1 hidden sm:inline-flex">
                ID: {selectedBooking?.id?.slice(0, 8)}
              </Badge>
            </div>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-muted">
                <XIcon className="size-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </div>
          {selectedBooking && (() => {
            const canAssignStaff = userRole === 'SUPER_ADMIN' || userRole === 'COO'
            const currentMember = selectedBooking.members?.find((m: any) => m.id === activeMemberId) || selectedBooking.members?.[0]

            return (
              <Tabs value={modalTab} onValueChange={(val: any) => setModalTab(val)} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="border-b bg-muted/20 px-2 sm:px-6 py-2 sm:py-2.5 shrink-0">
                  <TabsList className={cn("grid w-full h-9", canAssignStaff ? "grid-cols-5" : "grid-cols-4")}>
                    <TabsTrigger value="booking" className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-medium">
                      <CalendarIcon className="size-3.5 shrink-0" />
                      <span className="hidden sm:inline">Details</span>
                      <span className="sm:hidden">Info</span>
                    </TabsTrigger>
                    {canAssignStaff && (
                      <TabsTrigger value="staff" className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-medium">
                        <UsersIcon className="size-3.5 shrink-0" />
                        <span>Staff</span>
                      </TabsTrigger>
                    )}
                    <TabsTrigger value="patients" className="flex items-center justify-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-medium">
                      <ActivityIcon className="size-3.5 shrink-0" />
                      <span className="hidden sm:inline">Patients</span>
                      <span className="sm:hidden">Pts</span>
                      {selectedBooking.members?.length > 0 && (
                        <Badge variant="secondary" className="ml-0.5 sm:ml-1 h-4 px-1 sm:px-1.5 text-[9px] sm:text-[10px] font-semibold">
                          {selectedBooking.members.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="flex items-center justify-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-medium">
                      <ShoppingBagIcon className="size-3.5 shrink-0" />
                      <span className="hidden sm:inline">Orders</span>
                      <span className="sm:hidden">Ord</span>
                    </TabsTrigger>
                    <TabsTrigger value="price" className="flex items-center justify-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-medium">
                      <BanknoteIcon className="size-3.5 shrink-0" />
                      <span className="hidden sm:inline">Price</span>
                      <span className="sm:hidden">Pr</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto bg-muted/10">
                  {/* TAB 1: Booking Info */}
                  <TabsContent value="booking" className="p-4 sm:p-6 m-0 flex flex-col gap-4">
                    <div className="bg-card border rounded-xl p-5 flex flex-col gap-4 shadow-xs">
                      <div className="flex items-center justify-between border-b pb-3 border-border/50">
                        <div>
                          <h4 className="font-semibold text-sm">Customer & Service Details</h4>
                          <p className="text-xs text-muted-foreground">General information, address, and scheduled appointment</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[11px] font-mono capitalize">
                            {selectedBooking.type?.replace('_', ' ').toLowerCase()}
                          </Badge>
                          <Badge 
                            variant={selectedBooking.paymentStatus === 'PAID' ? 'default' : 'secondary'}
                            className={cn(
                              "text-[11px] font-semibold",
                              selectedBooking.paymentStatus === 'PAID' && "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                            )}
                          >
                            {selectedBooking.paymentStatus}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                        <div className="space-y-1">
                          <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                            <UserIcon className="size-3 text-muted-foreground" />
                            Customer Name
                          </span>
                          <p className="font-medium text-foreground">
                            {selectedBooking.type === 'INSTANT_BOOKING' ? selectedBooking.fullName : selectedBooking.user?.name || 'N/A'}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                            <MailIcon className="size-3 text-muted-foreground" />
                            Contact Information
                          </span>
                          {selectedBooking.type === 'INSTANT_BOOKING' ? (
                            <p className="font-medium text-foreground">{selectedBooking.mobileNumber || 'N/A'}</p>
                          ) : (
                            <div className="space-y-0.5">
                              <p className="font-medium text-foreground text-xs">{selectedBooking.user?.email || 'N/A'}</p>
                              <p className="text-xs text-muted-foreground">
                                📞 {selectedBooking.user?.phone || 'No phone number'}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="col-span-1 sm:col-span-2 space-y-1">
                          <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                            <MapPinIcon className="size-3 text-muted-foreground" />
                            Collection Address
                          </span>
                          <p className="font-medium text-foreground text-xs leading-relaxed">
                            {selectedBooking.type === 'INSTANT_BOOKING' 
                              ? [selectedBooking.address, selectedBooking.city, selectedBooking.zipcode].filter(Boolean).join(', ') || 'N/A'
                              : selectedBooking.addresses?.length > 0
                                ? [selectedBooking.addresses[0].houseNo, selectedBooking.addresses[0].streetAddress, selectedBooking.addresses[0].location, selectedBooking.addresses[0].city, selectedBooking.addresses[0].pinCode].filter(Boolean).join(', ')
                                : 'N/A'}
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                              <CalendarIcon className="size-3 text-muted-foreground" />
                              Preferred Date
                            </span>
                            {(userRole === 'SUPER_ADMIN' || (userRole === 'PHLEBOTOMIST' && selectedBooking.phlebotomistId === session?.user?.id)) && !isEditingSchedule && (
                              <button onClick={() => {
                                setIsEditingSchedule(true)
                                let d = ''
                                let t = ''
                                if (selectedBooking.type === 'INSTANT_BOOKING') {
                                  if (selectedBooking.preferredDate) {
                                    const pd = new Date(selectedBooking.preferredDate);
                                    d = new Date(pd.getTime() - (pd.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                                  }
                                  t = selectedBooking.preferredTime || ''
                                } else {
                                  if (selectedBooking.schedules?.[0]?.scheduleDate) {
                                    const sd = new Date(selectedBooking.schedules[0].scheduleDate);
                                    d = new Date(sd.getTime() - (sd.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                                  }
                                  t = selectedBooking.schedules?.[0]?.slot || ''
                                }
                                setEditDate(d)
                                
                                const savedSlot = t.toLowerCase()
                                const timeSlots = [
                                  "06:00 am - 07:00 am", "07:00 am - 08:00 am", "08:00 am - 09:00 am",
                                  "09:00 am - 10:00 am", "10:00 am - 11:00 am", "11:00 am - 12:00 pm",
                                  "12:00 pm - 01:00 pm", "01:00 pm - 02:00 pm", "02:00 pm - 03:00 pm",
                                  "03:00 pm - 04:00 pm", "04:00 pm - 05:00 pm", "05:00 pm - 06:00 pm"
                                ]
                                const matchedSlot = savedSlot ? (timeSlots.find(s => s.startsWith(savedSlot) || savedSlot.startsWith(s.split(' - ')[0])) || savedSlot) : ''
                                setEditTime(matchedSlot)
                              }} className="text-[11px] text-primary hover:underline font-medium">Edit</button>
                            )}
                          </div>
                          {isEditingSchedule ? (
                            <Input type="date" className="h-8 text-xs" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                          ) : (
                            <p className="font-medium text-foreground">
                              {selectedBooking.type === 'INSTANT_BOOKING' 
                                ? (selectedBooking.preferredDate ? new Date(selectedBooking.preferredDate).toLocaleDateString() : 'N/A')
                                : (selectedBooking.schedules?.[0]?.scheduleDate ? new Date(selectedBooking.schedules[0].scheduleDate).toLocaleDateString() : 'N/A')}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                            <ClockIcon className="size-3 text-muted-foreground" />
                            Preferred Time Slot
                          </span>
                          {isEditingSchedule ? (
                            <div className="flex gap-2">
                              <select 
                                className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-xs ring-offset-background"
                                value={editTime}
                                onChange={(e) => setEditTime(e.target.value)}
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
                              <Button 
                                size="sm" 
                                className="h-8 px-2.5 text-xs" 
                                onClick={() => {
                                  updateScheduleMutation.mutate({
                                    id: selectedBooking.id,
                                    type: selectedBooking.type,
                                    scheduleId: selectedBooking.schedules?.[0]?.id,
                                    preferredDate: editDate ? new Date(editDate).toISOString() : undefined,
                                    preferredTime: editTime || undefined
                                  })
                                }}
                                disabled={updateScheduleMutation.isPending}
                              >
                                Save
                              </Button>
                            </div>
                          ) : (
                            <p className="font-medium text-foreground">
                              {selectedBooking.type === 'INSTANT_BOOKING' 
                                ? (selectedBooking.preferredTime || 'N/A')
                                : (selectedBooking.schedules?.[0]?.slot || 'N/A')}
                            </p>
                          )}
                        </div>

                        {selectedBooking.testRequirement && (
                          <div className="col-span-1 sm:col-span-2 space-y-1 pt-2 border-t border-border/40">
                            <span className="text-muted-foreground text-xs block">Special Instructions / Requirements</span>
                            <p className="font-medium text-xs bg-muted/30 p-2.5 rounded-lg border border-border/50">{selectedBooking.testRequirement}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* TAB 2: Staff Assignments */}
                  {canAssignStaff && (
                    <TabsContent value="staff" className="p-4 sm:p-6 m-0 flex flex-col gap-4">
                      <div className="bg-card border rounded-xl p-5 flex flex-col gap-5 shadow-xs">
                        <div className="border-b pb-3 border-border/50">
                          <h4 className="font-semibold text-sm">Staff Assignments</h4>
                          <p className="text-xs text-muted-foreground">Assign collection phlebotomist and verification officer for this order</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Phlebotomist (Sample Collector)
                            </Label>
                            <Select 
                              value={selectedBooking.phlebotomistId || 'none'} 
                              onValueChange={(val: any) => {
                                updateAssignmentsMutation.mutate({ id: selectedBooking.id, phlebotomistId: val === 'none' ? null : val })
                                setSelectedBooking({ ...selectedBooking, phlebotomistId: val === 'none' ? null : val })
                              }}
                            >
                              <SelectTrigger className="h-10 px-3 text-xs font-medium rounded-lg border">
                                <SelectValue placeholder="Assign Phlebotomist" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Unassigned</SelectItem>
                                {phlebotomists.map((p: any) => (
                                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <p className="text-[11px] text-muted-foreground">
                              Assigned phlebotomist will be dispatched for doorstep sample collection.
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Reporting COO (Lab Sign-Off)
                            </Label>
                            <Select 
                              value={selectedBooking.cooId || 'none'} 
                              onValueChange={(val: any) => {
                                updateAssignmentsMutation.mutate({ id: selectedBooking.id, cooId: val === 'none' ? null : val })
                                setSelectedBooking({ ...selectedBooking, cooId: val === 'none' ? null : val })
                              }}
                            >
                              <SelectTrigger className="h-10 px-3 text-xs font-medium rounded-lg border">
                                <SelectValue placeholder="Assign COO" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Unassigned</SelectItem>
                                {coos.map((c: any) => (
                                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <p className="text-[11px] text-muted-foreground">
                              COO verifies lab test results before reports are released to the patient.
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  )}

                  {/* TAB 3: Patients & Orders */}
                  <TabsContent value="patients" className="p-4 sm:p-6 m-0 flex flex-col gap-4">
                    {!selectedBooking.members?.length ? (
                      <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground">
                        <UserIcon className="size-8 mx-auto mb-2 opacity-40" />
                        <p className="text-sm">No patients associated with this booking.</p>
                      </div>
                    ) : (
                      <>
                        {selectedBooking.members.length > 1 && (
                          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                            {selectedBooking.members.map((member: any, idx: number) => {
                              const draft = drafts[member.id] || { status: member.sampleStatus ?? 'BOOKED' }
                              const isSelected = (currentMember?.id === member.id)
                              return (
                                <button
                                  key={member.id}
                                  type="button"
                                  onClick={() => setActiveMemberId(member.id)}
                                  className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all shrink-0",
                                    isSelected
                                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                      : "bg-card text-muted-foreground hover:bg-muted border-border hover:text-foreground"
                                  )}
                                >
                                  <span>{member.name || `Patient ${idx + 1}`}</span>
                                  <span className={cn(
                                    "size-2 rounded-full",
                                    draft.status === 'REPORT_RELEASED' ? "bg-emerald-400" :
                                    draft.status === 'COLLECTED' ? "bg-blue-400" :
                                    draft.status === 'PROCESSING' ? "bg-amber-400" : "bg-zinc-400"
                                  )} />
                                </button>
                              )
                            })}
                          </div>
                        )}

                        {currentMember && (() => {
                          const member = currentMember
                          const draft = drafts[member.id] || { status: member.sampleStatus ?? 'BOOKED', reportUrl: member.reportUrl ?? '' }
                          return (
                            <div key={member.id} className="bg-card border rounded-xl p-5 flex flex-col gap-5 shadow-xs">
                              <div className="flex justify-between items-center pb-3 border-b border-border/50">
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center justify-center size-10 rounded-full bg-primary/10">
                                    <UserIcon className="size-5 text-primary" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-base">{member.name}</h4>
                                    <p className="text-xs text-muted-foreground capitalize">
                                      {member.gender ? member.gender.toLowerCase() : 'Unknown'}, {member.age ? `${member.age}y` : ''}
                                    </p>
                                    {member.phone && (
                                      <p className="text-xs text-muted-foreground">📞 {member.phone}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">Sample ID:</span>
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {member.id.slice(0, 8).toUpperCase()}
                                  </Badge>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm border-b pb-4 border-border/50">
                                <div>
                                  <span className="text-muted-foreground block text-xs mb-1">Collector</span>
                                  <span className="font-medium text-xs">{selectedBooking.phlebotomist?.name || 'Unassigned'}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground block text-xs mb-1">Collection Time</span>
                                  <span className="font-medium text-xs">{member.collectedAt ? new Date(member.collectedAt).toLocaleString() : 'N/A'}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground block text-xs mb-1">Lab Received</span>
                                  <span className="font-medium text-xs">{member.labReceivedAt ? new Date(member.labReceivedAt).toLocaleString() : 'N/A'}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground block text-xs mb-1">Report Status</span>
                                  <span className="font-medium text-xs">
                                    {member.reportUrl ? (
                                      <a href={member.reportUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold flex items-center gap-1">
                                        <FileTextIcon className="size-3" /> Available
                                      </a>
                                    ) : 'Pending'}
                                  </span>
                                </div>

                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2.5">
                                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sample Status</Label>
                                  <Select
                                    value={draft.status}
                                    onValueChange={(val: any) => {
                                      setDrafts(prev => ({ ...prev, [member.id]: { ...draft, status: val } }))
                                    }}
                                  >
                                    <SelectTrigger className={`h-10 px-3 text-[11px] font-bold uppercase tracking-wider rounded-lg border-none transition-opacity hover:opacity-80 ${sampleStatusColors[draft.status]}`}>
                                      <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="BOOKED" className="text-xs font-medium">BOOKED</SelectItem>
                                      <SelectItem value="COLLECTED" className="text-xs font-medium">COLLECTED</SelectItem>
                                      <SelectItem value="RECEIVED" className="text-xs font-medium">RECEIVED</SelectItem>
                                      <SelectItem value="ACCESSIONED" className="text-xs font-medium">ACCESSIONED</SelectItem>
                                      <SelectItem value="PROCESSING" className="text-xs font-medium">PROCESSING</SelectItem>
                                      <SelectItem value="VERIFIED" className="text-xs font-medium">VERIFIED</SelectItem>
                                      <SelectItem value="REPORT_RELEASED" className="text-xs font-medium">REPORT RELEASED</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                  <div className="space-y-2.5 mt-4 sm:mt-0">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Test Report</Label>
                                    <ReportUploader 
                                      draftUrl={draft.reportUrl} 
                                      onUpload={(url) => setDrafts(prev => ({ ...prev, [member.id]: { ...draft, reportUrl: url } }))} 
                                      onClear={() => setDrafts(prev => ({ ...prev, [member.id]: { ...draft, reportUrl: '' } }))}
                                    />
                                    {draft.status === 'REPORT_RELEASED' && !draft.reportUrl && (
                                      <p className="text-[10px] text-red-500 font-medium">* Report file is required when status is REPORT RELEASED</p>
                                    )}
                                  </div>
                              </div>
                            </div>
                          )
                        })()}
                      </>
                    )}
                  </TabsContent>

                  {/* TAB 4: Orders */}
                  <TabsContent value="orders" className="p-4 sm:p-6 m-0 flex flex-col gap-4 overflow-y-auto">
                    {selectedBooking.members?.length > 0 ? (
                      <div className="flex flex-col gap-5">
                        {selectedBooking.members.map((member: any) => (
                          <div key={member.id} className="bg-card border rounded-xl p-5 flex flex-col gap-4 shadow-xs">
                            <div className="flex items-center gap-2 border-b pb-3 border-border/50">
                              <UserIcon className="size-4 text-primary" />
                              <div>
                                <h4 className="font-semibold text-sm">{member.name}'s Tests</h4>
                                {member.phone && (
                                  <p className="text-xs text-muted-foreground">📞 {member.phone}</p>
                                )}
                              </div>
                            </div>
                            {member.testItems?.length > 0 ? (
                              <div className="rounded-lg border overflow-x-auto">
                                <table className="w-full text-xs min-w-[250px]">
                                  <thead className="bg-muted/50">
                                    <tr>
                                      <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Test</th>
                                      <th className="text-right px-3 py-2 font-semibold text-muted-foreground">MRP</th>
                                      <th className="text-right px-3 py-2 font-semibold text-muted-foreground">Price</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y">
                                    {member.testItems.map((t: any, idx: number) => (
                                      <tr key={t.id || idx} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-3 py-2 font-medium">{t.name}</td>
                                        <td className="px-3 py-2 text-right text-muted-foreground line-through">
                                          {t.originalPrice ? `₹${t.originalPrice}` : '—'}
                                        </td>
                                        <td className="px-3 py-2 text-right font-semibold text-green-600 dark:text-green-400">
                                          {t.discountedPrice ? `₹${t.discountedPrice}` : '—'}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                  <tfoot className="bg-muted/30 border-t">
                                    <tr>
                                      <td className="px-3 py-2 font-semibold" colSpan={2}>Total</td>
                                      <td className="px-3 py-2 text-right font-bold text-green-600 dark:text-green-400">
                                        ₹{member.testItems.reduce((sum: number, t: any) => sum + parseFloat(t.discountedPrice || '0'), 0).toFixed(0)}
                                      </td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs italic">No tests assigned</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground">
                        <ShoppingBagIcon className="size-8 mx-auto mb-2 opacity-40" />
                        <p className="text-sm">No orders found.</p>
                      </div>
                    )}
                  </TabsContent>

                  {/* TAB 5: Price */}
                  <TabsContent value="price" className="p-4 sm:p-6 m-0 flex flex-col gap-4 overflow-y-auto">
                    <div className="bg-card border rounded-xl p-5 flex flex-col gap-4 shadow-xs">
                      <div className="flex items-center gap-2 border-b pb-3 border-border/50">
                        <BanknoteIcon className="size-4 text-primary" />
                        <h4 className="font-semibold text-sm">Payment & Price Breakdown</h4>
                      </div>
                      
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border">
                          <span className="text-sm font-medium">Payment Mode</span>
                          <span className="text-sm font-bold capitalize">{selectedBooking.type?.replace('_', ' ').toLowerCase() || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border">
                          <span className="text-sm font-medium">Payment Status</span>
                          <Badge 
                            variant={selectedBooking.paymentStatus === 'PAID' ? 'default' : 'secondary'}
                            className={cn(
                              "text-[11px] font-semibold",
                              selectedBooking.paymentStatus === 'PAID' && "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                            )}
                          >
                            {selectedBooking.paymentStatus || 'PENDING'}
                          </Badge>
                        </div>
                        
                        <div className="rounded-lg border overflow-hidden mt-2">
                          <table className="w-full text-xs">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Patient & Test</th>
                                <th className="text-right px-3 py-2 font-semibold text-muted-foreground">Amount</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {selectedBooking.members?.flatMap((m: any) => 
                                m.testItems?.map((t: any, idx: number) => (
                                  <tr key={`${m.id}-${idx}`} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-3 py-2">
                                      <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-wider block mb-0.5">{m.name}</span>
                                      <span className="font-medium">{t.name}</span>
                                    </td>
                                    <td className="px-3 py-2 text-right font-semibold">
                                      ₹{t.discountedPrice || t.originalPrice || '0'}
                                    </td>
                                  </tr>
                                )) || []
                              )}
                            </tbody>
                            <tfoot className="bg-muted/30 border-t">
                              <tr>
                                <td className="px-3 py-3 font-semibold text-sm">Grand Total</td>
                                <td className="px-3 py-3 text-right font-bold text-sm text-green-600 dark:text-green-400">
                                  ₹{selectedBooking.members?.reduce((total: number, m: any) => 
                                    total + (m.testItems?.reduce((sum: number, t: any) => sum + parseFloat(t.discountedPrice || t.originalPrice || '0'), 0) || 0)
                                  , 0).toFixed(0) || '0'}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            )
          })()}
          <div className="sticky bottom-0 z-10 bg-background/80 backdrop-blur-xl border-t px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-end gap-3 mt-auto">
            <Button variant="ghost" onClick={() => setSelectedBooking(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!canSave || isSaving}>
              {isSaving ? <Spinner className="mr-2 size-4" /> : null}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
            {isUploading ? <Spinner className="mr-2 size-4 text-muted-foreground" /> : <UploadCloudIcon className="mr-2 size-4 text-muted-foreground" />}
            {isUploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </div>
      )}
    </div>
  )
}

function PendingComponent() {
  return (
    <div className="mx-auto max-w-(--breakpoint-lg) flex flex-col items-center justify-center h-[calc(100dvh-16rem)]">
      <Spinner className="size-6" />
    </div>
  )
}

function NotFoundComponent() {
  return (
    <div className="mx-auto max-w-(--breakpoint-lg) space-y-8 px-4 py-12">
      <h2 className="text-center text-3xl font-bold">Page Not Found</h2>
    </div>
  )
}

function ErrorComponent({ error }: { error: Error }) {
  const router = useRouter()
  return (
    <div className="error p-6">
      <h2>An error occurred: {error.name}</h2>
      <p>{error.message}</p>
      <Button onClick={() => router.navigate({ to: '/', search: {} })}>Go Home</Button>
    </div>
  )
}

