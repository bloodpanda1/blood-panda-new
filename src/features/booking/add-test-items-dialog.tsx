import { Button, buttonVariants } from '#/components/ui/button'
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
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '#/components/ui/item'
import { Label } from '#/components/ui/label'
import { ScrollArea } from '#/components/ui/scroll-area'
import { Switch } from '#/components/ui/switch'
import { formatCurrency } from '#/lib/utils'
import type {
  MemberDetailsFormData,
  TestItem,
} from '#/lib/validators/booking-schema'
import { Await, getRouteApi } from '@tanstack/react-router'
import { PackagePlusIcon, TestTube2Icon } from 'lucide-react'
import { useFormContext, useWatch } from 'react-hook-form'

type Props = {
  parentIndex: number
}

function ReviewsSkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-300 dark:bg-gray-700" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-gray-300 dark:bg-gray-700" />
      <div className="h-4 w-5/6 animate-pulse rounded bg-gray-300 dark:bg-gray-700" />
    </div>
  )
}

const routeApi = getRouteApi('/_protected/booking')

export default function AddTestItemsDialog({ parentIndex }: Props) {
  // const loaderData = useLoaderData<Route.ComponentProps['loaderData']>()

  const { deferred } = routeApi.useLoaderData()

  const form = useFormContext<MemberDetailsFormData>()

  // fetched all tests data from loader
  // const { loadAllTests } = loaderData

  const selectedTestItems =
    useWatch({
      control: form.control,
      name: `memberDetails.${parentIndex}.testItems`,
      defaultValue: [],
    }) ?? []

  const handleCheckedChange = (checked: boolean, item: TestItem) => {
    let updatedTestItems: TestItem[] = [...selectedTestItems]

    if (checked) {
      // If checked, add the item if it doesn't already exist
      if (!updatedTestItems.some((selected) => selected.id === item.id)) {
        updatedTestItems.push(item)
      }
    } else {
      // If unchecked, remove the item
      updatedTestItems = updatedTestItems.filter(
        (selected) => selected.id !== item.id,
      )
    }

    // Update the form state
    form.setValue(`memberDetails.${parentIndex}.testItems`, updatedTestItems, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={'w-full'}>
          <PackagePlusIcon className={'size-4'} />
          {selectedTestItems.length > 0
            ? `Added ${selectedTestItems.length} test / package`
            : 'Add test / package'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add test / package</DialogTitle>
          <DialogDescription>
            Select the tests or packages you want to add to your booking. You
            can choose from a wide range of options to customize your health
            checkup.
          </DialogDescription>
        </DialogHeader>

        <Await promise={deferred} fallback={<ReviewsSkeleton />}>
          {(data) => {
            return (
              <ScrollArea className="h-72 w-full rounded-md border">
                <div className={'space-y-2 px-4 py-2'}>
                  {data.map((item) => {
                    const testItem: TestItem = {
                      id: item.id,
                      name: item.name,
                      originalPrice: Number(item.originalPrice) || 0,
                      discountedPrice: Number(item.discountedPrice) || 0,
                      discountAmount: Number(item.discountAmount) || 0,
                      isFastingRequired: item.isFastingRequired,
                      primaryCategory: item.primaryCategoryId,
                      secondaryCategory: item.secondaryCategoryId,
                    }

                    return (
                      <Item key={item.id} variant={'outline'} size={'xs'}>
                        <ItemMedia variant="image">
                          <TestTube2Icon />
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{item.name}</ItemTitle>
                          <ItemDescription>
                            {formatCurrency(String(item.discountedPrice))}{' '}
                            (Original:{' '}
                            <span className={'line-through'}>
                              {formatCurrency(String(item.originalPrice))}
                            </span>
                            )
                          </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                          <div
                            className={buttonVariants({
                              variant: 'ghost',
                              size: 'sm',
                            })}
                          >
                            <Switch
                              id={item.id}
                              checked={selectedTestItems.some(
                                (selectedItem) => selectedItem.id === item.id,
                              )}
                              onCheckedChange={(checked) =>
                                handleCheckedChange(checked, testItem)
                              }
                            />
                            <Label htmlFor={item.id} className={'sr-only'} />
                          </div>
                        </ItemActions>
                      </Item>
                    )
                  })}
                </div>
              </ScrollArea>
            )
          }}
        </Await>

        {/* <Suspense fallback={<ReviewsSkeleton />}>
          <Await
            promise={deferred}
            // errorElement={<div>Could not Test Items 😬</div>}
            children={(resolvedTestItems) => {
              const allTests = resolvedTestItems?.map((test) => ({
                ...test,
                primaryCategory: test.primaryCategory.name,
                secondaryCategory: test.secondaryCategory.name,
                originalPrice: test.originalPrice
                  ? Number(test.originalPrice)
                  : 0,
                discountedPrice: test.discountedPrice
                  ? Number(test.discountedPrice)
                  : 0,
                discountAmount: test.discountAmount
                  ? Number(test.discountAmount)
                  : 0,
              }))
              return (
                <ScrollArea className="h-72 w-full rounded-md border">
                  <div className={'space-y-2 px-4 py-2'}>
                    {allTests?.map((item) => {
                      return (
                        <Item key={item.id} variant={'outline'} size={'xs'}>
                          <ItemMedia variant="image">
                            <TestTube2Icon />
                          </ItemMedia>
                          <ItemContent>
                            <ItemTitle>{item.name}</ItemTitle>
                            <ItemDescription>
                              {formatCurrency(String(item.discountedPrice))}{' '}
                              (Original:{' '}
                              <span className={'line-through'}>
                                {formatCurrency(String(item.originalPrice))}
                              </span>
                              )
                            </ItemDescription>
                          </ItemContent>
                          <ItemActions>
                            <div
                              className={buttonVariants({
                                variant: 'ghost',
                                size: 'sm',
                              })}
                            >
                              <Switch
                                id={item.id}
                                checked={selectedTestItems.some(
                                  (selectedItem) => selectedItem.id === item.id,
                                )}
                                onCheckedChange={(checked) =>
                                  handleCheckedChange(checked, item)
                                }
                              />
                              <Label htmlFor={item.id} className={'sr-only'} />
                            </div>
                          </ItemActions>
                        </Item>
                      )
                    })}
                  </div>
                </ScrollArea>
              )
            }}
          />
        </Suspense> */}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
