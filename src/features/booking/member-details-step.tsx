import { MinusCircleIcon, PlusCircleIcon, UserIcon, CheckIcon } from 'lucide-react'
import { useState } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useCart } from '#/stores/useCart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '#/components/ui/dialog'
import { toast } from 'sonner'
import type { MemberDetailsFormData } from '#/lib/validators/booking-schema'
import { Separator } from '#/components/ui/separator'
import MembersTestItems from './members-test-items'
import UploadPrescription from './upload-prescription'
import { cn } from '#/lib/utils'

export default function BasicDetailsStep() {
  const form = useFormContext<MemberDetailsFormData>()
  const trpc = useTRPC()
  const { data: savedMembers, isLoading: isMembersLoading, refetch } = useQuery(trpc.members.list.queryOptions())
  const createMutation = useMutation(trpc.members.create.mutationOptions())

  const routeApi = getRouteApi('/_protected/booking')
  const { deferred } = routeApi.useLoaderData()
  const { items: cartItems } = useCart()

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'memberDetails',
  })

  // State for adding a new member inline
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const defaultFormData = { name: '', email: '', phone: '', gender: 'MALE', age: '' }
  const [newMemberData, setNewMemberData] = useState(defaultFormData)

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault()
    toast.promise(createMutation.mutateAsync(newMemberData as any), {
      loading: 'Adding family member...',
      success: (createdMember) => {
        setIsCreateOpen(false)
        setNewMemberData(defaultFormData)
        refetch()
        // Automatically select them for this booking!
        toggleMemberSelection(createdMember)
        return 'Added successfully!'
      },
      error: (err) => err.message || 'Failed to add member'
    })
  }

  // Check if a member is currently selected in the form
  const isMemberSelected = (memberId: string) => {
    return fields.some((f: any) => f.memberId === memberId || f.id === memberId)
  }

  // Toggle member selection
  const toggleMemberSelection = async (member: any) => {
    const existingIndex = fields.findIndex((f: any) => f.memberId === member.id || f.id === member.id)
    if (existingIndex >= 0) {
      remove(existingIndex)
    } else {
      let tests: any[] = []
      try {
        tests = (await Promise.resolve(deferred)) || []
      } catch (err) {
        console.error('Failed to load deferred tests', err)
      }

      const preselectedTests = cartItems
        .map((cartItem) => {
          const found = tests.find(
            (t: any) =>
              t.id === cartItem.id ||
              t.name?.toLowerCase() === cartItem.name?.toLowerCase()
          )
          if (found) {
            return {
              id: found.id,
              name: found.name,
              originalPrice: Number(found.originalPrice) || Number(cartItem.price) || 0,
              discountedPrice: Number(found.discountedPrice) || Number(cartItem.price) || 0,
              discountAmount: Number(found.discountAmount) || 0,
              isFastingRequired: Boolean(found.isFastingRequired),
              primaryCategory: found.primaryCategoryId || null,
              secondaryCategory: found.secondaryCategoryId || null,
            }
          }
          return {
            id: cartItem.id,
            name: cartItem.name,
            originalPrice: Number(cartItem.price) || 0,
            discountedPrice: Number(cartItem.price) || 0,
            discountAmount: 0,
            isFastingRequired: false,
            primaryCategory: null,
            secondaryCategory: null,
          }
        })
        .filter(Boolean)

      append({
        id: member.id,
        memberId: member.id,
        name: member.name,
        email: member.email || '',
        phone: member.phone || '',
        gender: member.gender || 'OTHER',
        age: String(member.age || '0'),
        testItems: preselectedTests.length > 0 ? preselectedTests : undefined,
        isAssignedDoctor: false,
        assignedDoctor: 'no',
      })
    }
  }

  // Fallback for manual add if no members exist and they don't want to save?
  // The requirement says "add them in checkout itself which will be added in the user's family-members list."
  // So they MUST add them to their list first to proceed.

  return (
    <FieldGroup className={'gap-6'}>
      
      {/* SELECTION SECTION */}
      <Card className="rounded-none shadow-none ring-0 border bg-muted/20">
        <CardHeader>
          <CardTitle>Select Family Members for Testing</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Choose who is getting tested from your saved family members, or add a new one.
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          
          {isMembersLoading ? (
            <div className="text-sm text-muted-foreground p-4">Loading your family members...</div>
          ) : (
            savedMembers?.map((member) => (
              <div 
                key={member.id} 
                onClick={() => toggleMemberSelection(member)}
                className={cn(
                  "relative flex flex-col p-4 border rounded-md cursor-pointer transition-all hover:border-primary",
                  isMemberSelected(member.id) ? "border-primary bg-primary/5 ring-1 ring-primary" : "bg-card"
                )}
              >
                {isMemberSelected(member.id) && (
                  <div className="absolute top-3 right-3 text-primary">
                    <CheckIcon className="size-5" />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-1">
                  <UserIcon className="size-4 text-muted-foreground" />
                  <span className="font-medium">{member.name}</span>
                </div>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <p>{member.age} yrs • {member.gender}</p>
                  <p className="truncate">{member.email}</p>
                </div>
              </div>
            ))
          )}

          {/* ADD NEW MEMBER DIALOG INLINE */}
          <Dialog open={isCreateOpen} onOpenChange={(open) => {
            setIsCreateOpen(open)
            if (!open) setNewMemberData(defaultFormData)
          }}>
            <DialogTrigger asChild>
              <div className="flex flex-col items-center justify-center p-4 border border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors h-full min-h-[100px]">
                <PlusCircleIcon className="size-6 text-muted-foreground mb-2" />
                <span className="text-sm font-medium">Add New Member</span>
              </div>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreateMember}>
                <DialogHeader>
                  <DialogTitle>Add Family Member</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={newMemberData.name} onChange={e => setNewMemberData({...newMemberData, name: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={newMemberData.email} onChange={e => setNewMemberData({...newMemberData, email: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={newMemberData.phone} onChange={e => setNewMemberData({...newMemberData, phone: e.target.value})} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select value={newMemberData.gender} onValueChange={(val) => setNewMemberData({...newMemberData, gender: val})}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Age</Label>
                      <Input type="number" value={newMemberData.age} onChange={e => setNewMemberData({...newMemberData, age: e.target.value})} required />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createMutation.isPending}>Save & Select</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

        </CardContent>
      </Card>

      {/* DETAILS SECTION */}
      {fields.length === 0 ? (
        <Card className="rounded-none shadow-none ring-0 border-dashed">
          <CardContent className="flex items-center justify-center py-12 text-muted-foreground">
            Please select at least one family member above to continue.
          </CardContent>
        </Card>
      ) : (
        <Card className={'rounded-none shadow-none ring-0 bg-transparent'}>
          <CardHeader className="px-0">
            <CardTitle>Test Details</CardTitle>
          </CardHeader>
          <CardContent className={'px-0 space-y-6'}>
            {fields.map((row: any, idx) => {
              return (
                <Card
                  key={row.id}
                  className={'rounded-md overflow-hidden'}
                >
                  <div className="bg-primary/5 px-6 py-4 border-b flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{row.name}</h3>
                      <p className="text-sm text-muted-foreground">{row.age} yrs • {row.gender} • {row.phone}</p>
                    </div>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => remove(idx)}
                    >
                      <MinusCircleIcon className="size-4 mr-2" /> Remove
                    </Button>
                  </div>
                  
                  <CardContent className="p-6">
                    <MembersTestItems parentIndex={idx} />
  
                    <div className="mt-6">
                      <UploadPrescription parentIdx={idx} />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </CardContent>
        </Card>
      )}

    </FieldGroup>
  )
}
