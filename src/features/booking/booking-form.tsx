import { useFormContext } from 'react-hook-form'

import type { SubmitErrorHandler, SubmitHandler } from 'react-hook-form'

import type { MemberDetailsFormData } from '#/lib/validators/booking-schema'
import { toast } from 'sonner'
import BookingWizard from './booking-wizard'
// import { DevTool } from "@hookform/devtools"
import { Card, CardContent, CardHeader } from '#/components/ui/card'
import { SelectSeparator } from '#/components/ui/select'
import { useBookingContext } from '#/contexts/booking-context.lazy'
import BookingFormSidebar from './booking-form-sidebar'
import WizardHeader from './wizard-header'

export default function BookingForm() {
  const form = useFormContext<MemberDetailsFormData>()
  const { nextStep } = useBookingContext()

  const onError: SubmitErrorHandler<MemberDetailsFormData> = (errors) => {
    // console.log("Form errors:", errors)
    Object.entries(errors).forEach(([key, value]) => {
      console.log(`Error in ${key}:`, value)
      return toast.error(`Error in ${key}: ${value.message || 'Unknown error'}`)
    })
    return
  }

  const handleManualSave = async () => {
    // const result = await flush() // Save immediately
    // console.log("Manual save result:", result)
    // if (result.ok) {
    //   toast.success("Saved!")
    // }
  }

  const onSubmit: SubmitHandler<MemberDetailsFormData> = (data) => {
    toast.promise(form.trigger(), {
      loading: 'Validating form...',
      success: (result) => {
        if (result) {
          nextStep()
        }
        return 'Form is valid! Moving to next step...'
      },
      error: 'Please fix the errors in the form before proceeding.',
    })

    console.log('Form submitted successfully:', data)
  }

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
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <BookingWizard />
        </form>
      </CardContent>

      {/* Side bar */}
      <BookingFormSidebar />
    </Card>
  )
}
