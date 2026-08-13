import { Button } from '#/components/ui/button'
import { Card, CardContent, CardFooter } from '#/components/ui/card'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '#/components/ui/item'
import { ScrollArea } from '#/components/ui/scroll-area'
import { Separator } from '#/components/ui/separator'
import { formatCurrency } from '#/lib/utils'
import type { MemberDetailsFormData } from '#/lib/validators/booking-schema'
import { IconTrash } from '@tabler/icons-react'
import { TestTube2Icon } from 'lucide-react'
import { useFormContext, useWatch } from 'react-hook-form'
import AddTestItemsDialog from './add-test-items-dialog'

type MembersTestItemsProps = {
  parentIndex: number
}

export default function MembersTestItems({
  parentIndex,
}: MembersTestItemsProps) {
  const form = useFormContext<MemberDetailsFormData>()

  const memberTestItems =
    useWatch({
      control: form.control,
      name: `memberDetails.${parentIndex}.testItems`,
      defaultValue: [],
    }) ?? []

  return (
    <Card>
      <CardContent className={'space-y-6'}>
        {memberTestItems.length <= 0 ? (
          <p className={'text-base font-medium'}>
            No member details found. Please add member details to proceed with
            the booking.
          </p>
        ) : memberTestItems.length === 0 ? (
          <p className={'text-lg font-medium'}>
            No tests or packages selected. Please add at least one test or
            package to proceed with the booking.
          </p>
        ) : (
          <ScrollArea className={'h-72 w-full'}>
            {memberTestItems.map((item) => (
              <div className={'px-4'} key={item.id}>
                <Item variant={'outline'} size={'xs'}>
                  <ItemMedia variant="image">
                    <TestTube2Icon />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{item.name}</ItemTitle>
                    <ItemDescription>
                      {formatCurrency(String(item.discountedPrice) || '0')}{' '}
                      (Original:{' '}
                      <span className={'line-through'}>
                        {formatCurrency(String(item.originalPrice) || '0')}
                      </span>
                      )
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button
                      type="button"
                      size={'icon-xs'}
                      onClick={() => {
                        const updatedTestItems = memberTestItems.filter(
                          (i) => i.id !== item.id,
                        )

                        form.setValue(
                          `memberDetails.${parentIndex}.testItems`,
                          updatedTestItems,
                          {
                            shouldValidate: true,
                            shouldDirty: true,
                            shouldTouch: true,
                          },
                        )
                      }}
                    >
                      <IconTrash className={'size-4'} />
                    </Button>
                  </ItemActions>
                </Item>
                <Separator className={'my-2'} />
              </div>
            ))}
          </ScrollArea>
        )}
      </CardContent>
      <CardFooter className={'mt-auto'}>
        <AddTestItemsDialog parentIndex={parentIndex} key={parentIndex} />
      </CardFooter>
    </Card>
  )
}
