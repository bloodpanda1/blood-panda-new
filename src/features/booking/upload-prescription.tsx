import { Button } from '#/components/ui/button'
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
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import UploadPrescriptionDialog from './upload-prescription-dialog'

type UploadPrescriptionProps = {
  parentIdx: number
}

const uploadPreferences = [
  {
    id: 'pref-yes',
    title: 'Yes',
    description: 'I have a prescription from my doctor.',
    value: 'yes',
  },
  {
    id: 'pref-no',
    title: 'No',
    description: "I don't have a prescription.",
    value: 'no',
  },
]

export default function UploadPrescription(props: UploadPrescriptionProps) {
  const { parentIdx: idx } = props
  const form = useFormContext<MemberDetailsFormData>()

  const assignedDoctor = useWatch({
    control: form.control,
    name: `memberDetails.${idx}.assignedDoctor`,
    defaultValue: 'no',
  })

  const prescriptionUrl = useWatch({
    control: form.control,
    name: `memberDetails.${idx}.prescriptionUrl`,
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
            defaultValue="no"
            render={({ field, fieldState }) => (
              <RadioGroup
                name={field.name}
                value={field.value || 'no'}
                onValueChange={(val) => {
                  field.onChange(val)
                  form.setValue(
                    `memberDetails.${idx}.isAssignedDoctor`,
                    val === 'yes',
                    {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    },
                  )
                  if (val === 'no') {
                    form.setValue(
                      `memberDetails.${idx}.prescriptionUrl`,
                      undefined,
                      {
                        shouldDirty: true,
                      },
                    )
                  }
                }}
                aria-invalid={fieldState.invalid}
              >
                {uploadPreferences.map((preference) => (
                  <FieldLabel
                    key={preference.id}
                    htmlFor={`form-rhf-radiogroup-${idx}-${preference.value}`}
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
                        id={`form-rhf-radiogroup-${idx}-${preference.value}`}
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
            )}
          />
        </CardContent>
        {assignedDoctor === 'yes' ? (
          <CardFooter className={'flex flex-col items-start gap-4 pt-2'}>
            <div className="w-full max-w-md space-y-2">
              <Label htmlFor={`doctorName-${idx}`}>Doctor Name (Optional)</Label>
              <Controller
                name={`memberDetails.${idx}.doctorName`}
                control={form.control}
                render={({ field }) => (
                  <Input 
                    id={`doctorName-${idx}`} 
                    placeholder="E.g. Dr. John Doe" 
                    {...field} 
                    value={field.value || ''} 
                  />
                )}
              />
            </div>
            {prescriptionUrl ? (
              <div className="flex items-center gap-3 rounded-lg border p-2.5 bg-muted/20 w-full max-w-md">
                <a
                  href={prescriptionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="size-12 rounded border overflow-hidden shrink-0 bg-background flex items-center justify-center hover:opacity-80 transition-opacity"
                  title="Click to preview prescription"
                >
                  {prescriptionUrl.endsWith('.pdf') ? (
                    <span className="text-xs font-bold text-primary">PDF</span>
                  ) : (
                    <img
                      src={prescriptionUrl}
                      alt="Prescription"
                      className="size-full object-cover"
                    />
                  )}
                </a>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                    ✓ Prescription Attached
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    Ready for phlebotomist and lab review
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <UploadPrescriptionDialog parentIdx={idx} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      form.setValue(`memberDetails.${idx}.prescriptionUrl`, undefined, {
                        shouldDirty: true,
                        shouldTouch: true,
                      })
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <UploadPrescriptionDialog parentIdx={idx} />
                <p className="text-[11px] text-muted-foreground">
                  Select from your saved account prescriptions or upload a new file.
                </p>
              </div>
            )}
          </CardFooter>
        ) : null}
      </Card>
    </>
  )
}
