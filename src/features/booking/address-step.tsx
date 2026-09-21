import { Map, MapControls } from '#/components/map'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Switch } from '#/components/ui/switch'
import type { BookingFormData } from '#/lib/validators/booking-schema'
import { Controller, useFormContext } from 'react-hook-form'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { Badge } from '#/components/ui/badge'
import { HomeIcon, BuildingIcon, MapPinIcon } from 'lucide-react'
import { cn } from '#/lib/utils'

const addressTypeIcon: Record<string, typeof HomeIcon> = {
  HOME: HomeIcon,
  OFFICE: BuildingIcon,
  OTHER: MapPinIcon,
}

export default function AddressStep() {
  const form = useFormContext<BookingFormData>()
  const trpc = useTRPC()
  const { data: addresses = [], isLoading } = useQuery(trpc.addresses.list.queryOptions())

  return (
    <FieldGroup className="gap-3">
      <Card className={'rounded-none shadow-none ring-0'}>
        <CardHeader>
          <CardTitle>Where shall we collect your sample?</CardTitle>
        </CardHeader>
        <CardContent className={'space-y-4'}>
          {addresses.length > 0 && (
            <div className="space-y-3 pb-2">
              <span className="text-sm font-semibold">Saved Addresses</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr: any) => {
                  const Icon = addressTypeIcon[addr.type] || MapPinIcon
                  // Check if this address matches current form values
                  const isSelected = 
                    form.watch('address.houseNo') === addr.houseNo &&
                    form.watch('address.pincode') === addr.pinCode

                  return (
                    <div
                      key={addr.id}
                      onClick={() => {
                        form.setValue('address.location', addr.location || '', { shouldValidate: true, shouldDirty: true })
                        form.setValue('address.houseNo', addr.houseNo || '', { shouldValidate: true, shouldDirty: true })
                        form.setValue('address.pincode', addr.pinCode || '', { shouldValidate: true, shouldDirty: true })
                        form.setValue('address.landmark', addr.landmark || '', { shouldValidate: true, shouldDirty: true })
                        form.setValue('address.addressType', addr.type === 'HOME' || addr.type === 'OFFICE' || addr.type === 'OTHER' ? addr.type : 'OTHER', { shouldValidate: true, shouldDirty: true })
                        form.setValue('address.isChecked', addr.type !== 'HOME', { shouldValidate: true, shouldDirty: true })
                      }}
                      className={cn(
                        "cursor-pointer rounded-lg border p-4 shadow-sm transition-all hover:border-primary/50",
                        isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "bg-card"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Icon className="size-3.5" />
                        </div>
                        <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                          {addr.type}
                        </Badge>
                      </div>
                      <div className="text-xs space-y-1 text-muted-foreground">
                        <p className="font-semibold text-foreground">{addr.houseNo}</p>
                        <p className="line-clamp-2">{addr.location}</p>
                        {addr.landmark && <p>Landmark: {addr.landmark}</p>}
                        <p>{addr.pinCode}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          <Controller
            name="address.location"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                aria-invalid={fieldState.invalid}
              >
                <FieldLabel htmlFor="location">Location</FieldLabel>
                <Input
                  id="location"
                  placeholder="Enter location"
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Card className="h-80 overflow-hidden p-0">
            <Map center={[77.5946, 12.9716]} zoom={11}>
              <MapControls />
            </Map>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Controller
              name="address.houseNo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className="col-span-full lg:col-span-2"
                  data-invalid={fieldState.invalid}
                  aria-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor="house-flat-floor-no">
                    House / Flat / Floor No.
                  </FieldLabel>
                  <Input
                    id="house-flat-floor-no"
                    placeholder="Enter house / flat / floor no."
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="address.pincode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className="col-span-full lg:col-span-1"
                  data-invalid={fieldState.invalid}
                  aria-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor="pincode">Pincode</FieldLabel>
                  <Input
                    id="pincode"
                    placeholder="Enter pincode"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <Controller
            name="address.landmark"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                aria-invalid={fieldState.invalid}
              >
                <FieldLabel htmlFor="landmark-directions">
                  Landmark / Directions to reach (Optional)
                </FieldLabel>
                <Input
                  id="landmark-directions"
                  placeholder="Near nowhere, 123, road"
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <FieldSeparator />

          <Controller
            name="address.isChecked"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="address-type">Address Type</FieldLabel>
                  <FieldDescription>Select your address type</FieldDescription>
                </FieldContent>

                <div className="flex items-center gap-2">
                  <span>Home</span>
                  <Switch
                    id="address-type"
                    className="w-10"
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked)
                      form.setValue(
                        'address.addressType',
                        !checked ? 'HOME' : 'OTHER',
                        {
                          shouldValidate: true,
                          shouldDirty: true,
                          shouldTouch: true,
                        },
                      )
                    }}
                    aria-invalid={fieldState.invalid}
                  />
                  <span>Other</span>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </CardContent>
      </Card>
    </FieldGroup>
  )
}
