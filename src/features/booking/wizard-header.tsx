import { Badge } from '#/components/ui/badge'
import { Progress } from '#/components/ui/progress'
import { useBookingContext } from '#/contexts/booking-context.lazy'
import {
  IconCheck,
  IconNumber1,
  IconNumber2,
  IconNumber3,
  IconNumber4,
} from '@tabler/icons-react'

export default function WizardHeader() {
  const { step, bookingStats } = useBookingContext()

  return (
    <div className={'flex items-center justify-center gap-4 py-4'}>
      <Badge
        className={'size-8'}
        variant={
          step === 1 && bookingStats.isFirstStepCompleted
            ? 'default'
            : 'outline'
        }
      >
        {bookingStats.isFirstStepCompleted ? (
          <IconCheck className={'size-6'} />
        ) : (
          <IconNumber1 className={'size-6'} />
        )}
      </Badge>
      <Progress value={bookingStats.firstStepProgress} className="w-full" />
      <Badge
        className={'size-8'}
        variant={
          step === 2 && bookingStats.isSecondStepCompleted
            ? 'default'
            : 'outline'
        }
      >
        {bookingStats.isSecondStepCompleted ? (
          <IconCheck className={'size-6'} />
        ) : (
          <IconNumber2 className={'size-6'} />
        )}
      </Badge>
      <Progress value={bookingStats.secondStepProgress} className="w-full" />
      <Badge
        className={'size-8'}
        variant={
          step === 3 && bookingStats.isThirdStepCompleted
            ? 'default'
            : 'outline'
        }
      >
        {bookingStats.isThirdStepCompleted ? (
          <IconCheck className={'size-6'} />
        ) : (
          <IconNumber3 className={'size-6'} />
        )}
      </Badge>
      <Progress value={bookingStats.thirdStepProgress} className="w-full" />
      <Badge className={'size-8'} variant={step === 4 ? 'default' : 'outline'}>
        <IconNumber4 className={'size-6'} />
      </Badge>
    </div>
  )
}
