import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardContent } from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { useTRPC } from '#/integrations/trpc/react'
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '#/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Spinner } from '#/components/ui/spinner'
import { Label } from '#/components/ui/label'
import { useQuery, useMutation } from '@tanstack/react-query'

export const Route = createFileRoute('/_protected/family-members')({
  component: RouteComponent,
})

function RouteComponent() {
  const trpc = useTRPC()
  const {
    data: members,
    isLoading,
    refetch,
  } = useQuery(trpc.members.list.queryOptions())
  const createMutation = useMutation(trpc.members.create.mutationOptions())
  const updateMutation = useMutation(trpc.members.update.mutationOptions())
  const deleteMutation = useMutation(trpc.members.delete.mutationOptions())

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<any>(null)

  const defaultFormData = {
    name: '',
    email: '',
    phone: '',
    gender: 'MALE',
    age: '',
  }
  const [formData, setFormData] = useState(defaultFormData)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    toast.promise(createMutation.mutateAsync(formData as any), {
      loading: 'Adding family member...',
      success: () => {
        setIsCreateOpen(false)
        setFormData(defaultFormData)
        refetch()
        return 'Added successfully!'
      },
      error: (err) => err.message || 'Failed to add member',
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMember) return
    toast.promise(
      updateMutation.mutateAsync({ id: editingMember.id, ...formData } as any),
      {
        loading: 'Updating family member...',
        success: () => {
          setEditingMember(null)
          setFormData(defaultFormData)
          refetch()
          return 'Updated successfully!'
        },
        error: (err) => err.message || 'Failed to update member',
      },
    )
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this family member?')) return
    toast.promise(deleteMutation.mutateAsync({ id }), {
      loading: 'Deleting...',
      success: () => {
        refetch()
        return 'Deleted successfully!'
      },
      error: (err) => err.message || 'Failed to delete',
    })
  }

  const openEdit = (member: any) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      gender: member.gender,
      age: member.age,
    })
  }

  return (
    <main className="mx-auto max-w-(--breakpoint-xl) space-y-8 px-4 py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Family Members</h1>

        <Dialog
          open={isCreateOpen}
          onOpenChange={(open) => {
            setIsCreateOpen(open)
            if (!open) setFormData(defaultFormData)
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusIcon className="mr-2 size-4" /> Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Add Family Member</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(val) =>
                        setFormData({ ...formData, gender: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input
                      type="number"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createMutation.isPending}>
                  Save
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Spinner className="size-8" />
        </div>
      ) : !members || members.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            No family members added yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members?.map((member: any) => (
            <Card key={member.id}>
              <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-center text-lg">
                  {member.name}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => openEdit(member)}
                    >
                      <PencilIcon className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(member.id)}
                    >
                      <TrashIcon className="size-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p>Email: {member.email}</p>
                <p>Phone: {member.phone}</p>
                <p>Gender: {member.gender}</p>
                <p>Age: {member.age}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={!!editingMember}
        onOpenChange={(open) => !open && setEditingMember(null)}
      >
        <DialogContent>
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle>Edit Family Member</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(val) =>
                      setFormData({ ...formData, gender: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={updateMutation.isPending}>
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}
