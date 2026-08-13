import { useBookingContext } from '#/contexts/booking-context.lazy'
import AddressStep from './address-step'
import BasicDetailsStep from './member-details-step'
import ReviewStep from './review-step'
import ScheduleStep from './schedule-step'

export default function BookingWizard() {
  const { step } = useBookingContext()

  switch (step) {
    case 1:
      return <BasicDetailsStep />

    case 2:
      return <AddressStep />

    case 3:
      return <ScheduleStep />

    case 4:
      return <ReviewStep />

    default:
      return null
  }
}
