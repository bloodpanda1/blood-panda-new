import { Badge } from '#/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'
import { Skeleton } from '#/components/ui/skeleton'
import { Spinner } from '#/components/ui/spinner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '#/components/ui/dialog'
import { Label } from '#/components/ui/label'
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
import { useSession } from '#/lib/auth-client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { SearchIcon, ShieldIcon, UserIcon, AlertCircle, EditIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import InviteAdminDialog from '#/features/admin/invite-admin-dialog'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

export const Route = createFileRoute('/admin/staff')({
  head: () => seo({ path: '/admin/staff' }),
  component: RouteComponent,
  pendingComponent: PendingComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
  wrapInSuspense: true,
  codeSplitGroupings: [
    ['component', 'pendingComponent', 'errorComponent', 'notFoundComponent'],
  ],
})

const roleColors: Record<string, string> = {
  SUPER_ADMIN: 'bg-red-100 text-red-800',
  COO: 'bg-purple-100 text-purple-800',
  PHLEBOTOMIST: 'bg-green-100 text-green-800',
  USER: 'bg-gray-100 text-gray-800'
}

function RouteComponent() {
  const trpc = useTRPC()
  const { data: session } = useSession()
  const userRole = (session?.user as any)?.role
  const currentUserId = session?.user?.id

  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)

  const { data: staffMembers = [], isLoading, refetch } = useQuery({
    ...trpc.admin.staff.queryOptions({ search: debouncedSearch }),
    enabled: userRole === 'SUPER_ADMIN',
  })

  const { data: pendingInvites = [] } = useQuery({
    ...trpc.admin.pendingInvites.queryOptions(),
    enabled: userRole === 'SUPER_ADMIN',
  })

  const [editingStaff, setEditingStaff] = useState<any>(null)
  const [editForm, setEditForm] = useState({ name: '', phone: '', address: '', role: '' })

  const updateStaffMutation = useMutation({
    ...trpc.admin.updateStaffMember.mutationOptions(),
    onSuccess: () => {
      toast.success('Staff member updated successfully')
      setEditingStaff(null)
      refetch()
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update staff member')
    }
  })

  const openEditModal = (member: any) => {
    setEditingStaff(member)
    setEditForm({
      name: member.name || '',
      phone: member.phone || '',
      address: member.address || '',
      role: member.role || 'USER'
    })
  }

  const handleUpdate = () => {
    if (!editingStaff) return
    updateStaffMutation.mutate({
      id: editingStaff.id,
      name: editForm.name,
      phone: editForm.phone,
      address: editForm.address,
      role: editForm.role as any
    })
  }

  // Only SUPER_ADMIN can view this page
  if (userRole !== 'SUPER_ADMIN') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <ShieldIcon className="size-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-muted-foreground mt-2">
          Only Super Admins can manage staff members.
        </p>
      </div>
    )
  }



  const phlebotomists = staffMembers.filter((m: any) => m.role === 'PHLEBOTOMIST')
  const totalPhlebotomists = phlebotomists.length
  
  const activePhlebotomists = phlebotomists.filter((m: any) => {
    if (m.computedStatus === 'ON_COLLECTION') return false
    if (!m.lastActiveAt) return false
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    return new Date(m.lastActiveAt) >= twoHoursAgo
  }).length

  const onCollectionPhlebotomists = phlebotomists.filter((m: any) => m.computedStatus === 'ON_COLLECTION').length

  const totalCoos = staffMembers.filter((m: any) => m.role === 'COO').length
  const totalAdmins = staffMembers.filter((m: any) => m.role === 'SUPER_ADMIN').length

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <InviteAdminDialog />
        </div>

        {pendingInvites.length > 0 && (
          <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-200">
            <AlertCircle className="size-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle>Pending Invitations</AlertTitle>
            <AlertDescription>
              There {pendingInvites.length === 1 ? 'is' : 'are'} {pendingInvites.length} pending staff invitation{pendingInvites.length === 1 ? '' : 's'} waiting to be accepted.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Phlebotomists</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-500">{activePhlebotomists} <span className="text-sm">Active</span></span>
                    <span className="text-sm text-muted-foreground">/ {totalPhlebotomists} Total</span>
                  </div>
                  {onCollectionPhlebotomists > 0 && (
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-500">
                      {onCollectionPhlebotomists} On Collection
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">COOs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-12" /> : totalCoos}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Super Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-12" /> : totalAdmins}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="relative max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search all users by name or email..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Staff Member</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : staffMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No staff members found.
                </TableCell>
              </TableRow>
            ) : (
              staffMembers.map((member: any) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                        <UserIcon className="size-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {member.phone || '-'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {member.address || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={roleColors[member.role] ?? 'bg-gray-100 text-gray-800'}>
                      {member.role.replace('_', ' ')}
                    </Badge>
                    {member.role === 'PHLEBOTOMIST' && member.computedStatus === 'ON_COLLECTION' && (
                      <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800">
                        ON COLLECTION
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(member.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      disabled={currentUserId === member.id}
                      onClick={() => openEditModal(member)}
                    >
                      <EditIcon className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingStaff} onOpenChange={(open) => !open && setEditingStaff(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={editForm.role}
                onValueChange={(val: any) => setEditForm({ ...editForm, role: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUPER_ADMIN">SUPER ADMIN</SelectItem>
                  <SelectItem value="COO">COO</SelectItem>
                  <SelectItem value="PHLEBOTOMIST">PHLEBOTOMIST</SelectItem>
                  <SelectItem value="USER">USER</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdate} disabled={updateStaffMutation.isPending}>
              {updateStaffMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

