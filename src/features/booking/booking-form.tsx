import { useFormContext } from 'react-hook-form'

import type { MemberDetailsFormData } from '#/lib/validators/booking-schema'
import BookingWizard from './booking-wizard'
import { Card, CardContent, CardHeader } from '#/components/ui/card'
import { SelectSeparator } from '#/components/ui/select'
import BookingFormSidebar from './booking-form-sidebar'
import WizardHeader from './wizard-header'

export default function BookingForm() {
  return (
    <Card
      className={'grid gap-4 rounded-none shadow-none ring-0 lg:grid-cols-3'}
    >
      <CardHeader className={'col-span-full'}>
        <WizardHeader />
      </CardHeader>
      <SelectSeparator className={'col-span-full'} />
      <CardContent
        className={'col-span-full grid h-fit content-start px-0 lg:col-span-2'}
      >
        {/* No <form> wrapper — all navigation driven by sidebar buttons (type="button") to prevent accidental submission */}
        <BookingWizard />
      </CardContent>

      {/* Side bar */}
      <BookingFormSidebar />
    </Card>
  )
}
