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
import { IconTrash } from '@tabler/icons-react'
import { PackagePlusIcon, TestTube2Icon } from 'lucide-react'
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
          <p className={'text-lg font-medium'}>
            No tests or packages selected for this member. Please add at least one test or
            package to proceed with the booking.
          </p>
        ) : (
          <ScrollArea className={'h-72 w-full'}>
            {memberTestItems.map((item) => {
              const isPackage = item.name.toLowerCase().startsWith('package:')
              const isMiniPackage = item.name.toLowerCase().startsWith('mini package:')

              return (
                <div className={'px-4'} key={item.id}>
                  <Item variant={'outline'} size={'xs'}>
                    <ItemMedia variant="image">
                      {isPackage || isMiniPackage ? (
                        <PackagePlusIcon className="size-4 text-primary" />
                      ) : (
                        <TestTube2Icon className="size-4 text-muted-foreground" />
                      )}
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="flex items-center gap-2">
                        <span>{item.name}</span>
                      </ItemTitle>
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
            )
          })}
          </ScrollArea>
        )}
      </CardContent>
      <CardFooter className={'mt-auto'}>
        <AddTestItemsDialog parentIndex={parentIndex} key={parentIndex} />
      </CardFooter>
    </Card>
  )
}
