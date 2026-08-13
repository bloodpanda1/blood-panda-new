import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSeparator,
  FieldTitle,
} from '#/components/ui/field'
import { RadioGroup, RadioGroupItem } from '#/components/ui/radio-group'
import type { MemberDetailsFormData } from '#/lib/validators/booking-schema'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import UploadPrescriptionDialog from './upload-prescription-dialog'

type UploadPrescriptionProps = {
  parentIdx: number
}

const uploadPreferences = [
  {
    id: crypto.randomUUID(),
    title: 'Yes',
    description: 'I have a prescription from my doctor.',
    value: 'yes',
  },
  {
    id: crypto.randomUUID(),
    title: 'No',
    description: "I don't have a prescription.",
    value: 'no',
  },
]

export default function UploadPrescription(props: UploadPrescriptionProps) {
  const { parentIdx: idx } = props
  const form = useFormContext<MemberDetailsFormData>()

  const watchAssignedDoctor = useWatch({
    control: form.control,
    name: `memberDetails.${idx}.isAssignedDoctor`,
    compute: (value) => value,
  })

  return (
    <>
      <FieldSeparator className={'col-span-full'} />
      <Card
        className={'col-span-full w-full rounded-none py-0 shadow-none ring-0'}
      >
        <CardHeader>
          <CardTitle>Who is your prescribing doctor?</CardTitle>
          <CardDescription>
            We'll add your doctor's name to the report and share it directly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Controller
            name={`memberDetails.${idx}.assignedDoctor`}
            control={form.control}
            render={({ field, fieldState }) => (
              <RadioGroup
                name={field.name}
                value={field.value}
                onValueChange={(e) => {
                  field.onChange(e)
                  form.setValue(
                    `memberDetails.${idx}.isAssignedDoctor`,
                    !watchAssignedDoctor,
                    {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    },
                  )
                }}
                aria-invalid={fieldState.invalid}
              >
                {uploadPreferences.map((preference) => (
                  <FieldLabel
                    key={preference.id}
                    htmlFor={`form-rhf-radiogroup-${preference.title}`}
                  >
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                      className={'p-2'}
                    >
                      <FieldContent>
                        <FieldTitle>{preference.title}</FieldTitle>
                        <FieldDescription>
                          {preference.description}
                        </FieldDescription>
                      </FieldContent>
                      <RadioGroupItem
                        value={preference.value}
                        id={`form-rhf-radiogroup-${preference.title}`}
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
            )}
          />
        </CardContent>
        {!watchAssignedDoctor ? (
          <CardFooter className={'transition-opacity delay-300 duration-300'}>
            <UploadPrescriptionDialog />
          </CardFooter>
        ) : null}
      </Card>
    </>
  )
}
