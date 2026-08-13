import { IconTestPipe } from '@tabler/icons-react'
import { ArrowRightCircleIcon } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Link } from '@tanstack/react-router'

export default function EmptyCartState() {
  return (
    <Empty className="border-2 border-dashed max-w-2xl mx-auto">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconTestPipe />
        </EmptyMedia>
        <EmptyTitle>Add some items to your cart to get started!</EmptyTitle>
        <EmptyDescription>
          Your cart is empty. Add some items to get started!
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        {/* <Button>Create Booking</Button>
        <Button variant="outline">Import Project</Button> */}
        <Link
          to="/tests"
          viewTransition
          className={buttonVariants({ variant: 'secondary' })}
        >
          Goto Tests
          <ArrowRightCircleIcon className="size-4" />
        </Link>
      </EmptyContent>
    </Empty>
  )
}
