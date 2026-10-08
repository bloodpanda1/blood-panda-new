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
import { HomeIcon, BuildingIcon, MapPinIcon, CheckIcon, PencilIcon, SearchIcon, Loader2 } from 'lucide-react'
import { cn } from '#/lib/utils'
import UpdateAddressDialog from '#/features/profile/update-address-dialog'
import { useState, useRef, useEffect } from 'react'
import { Button } from '#/components/ui/button'

const addressTypeIcon: Record<string, typeof HomeIcon> = {
  HOME: HomeIcon,
  OFFICE: BuildingIcon,
  OTHER: MapPinIcon,
}

const formatLocation = (f: any) => {
  const p = f.properties;
  const parts = [p.name, p.street, p.locality, p.district, p.city, p.state].filter(Boolean);
  const uniqueParts = parts.filter((item, pos) => parts.indexOf(item) === pos);
  
  const searchStr = [p.city, p.county, p.district, p.state, p.name].join(' ').toLowerCase();
  const isBangalore = searchStr.includes('bangalore') || searchStr.includes('bengaluru');
  
  return {
    id: p.osm_id + (p.osm_type || Math.random().toString()),
    locality: uniqueParts.join(', '),
    pincode: p.postcode || '',
    state: p.state || '',
    isBangalore
  }
}

export default function AddressStep() {
  const form = useFormContext<BookingFormData>()
  const trpc = useTRPC()
  const { data: addresses = [], isLoading } = useQuery(trpc.addresses.list.queryOptions())

  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  
  const [locations, setLocations] = useState<any[]>([])
  const [isLoadingLocations, setIsLoadingLocations] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (searchQuery.length < 3) {
      setLocations([])
      setIsLoadingLocations(false)
      return
    }
    
    setIsLoadingLocations(true)
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&lat=12.9716&lon=77.5946&limit=5`)
        const data = await res.json()
        setLocations((data.features || []).map(formatLocation))
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoadingLocations(false)
      }
    }, 400)
    
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const hasLocation = !!form.watch('address.location')

  return (
    <FieldGroup className="gap-3">
      <Card className={'rounded-none shadow-none ring-0 overflow-visible'}>
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
                        "relative cursor-pointer rounded-xl border p-4 transition-all duration-200 shadow-sm hover:shadow-md",
                        isSelected 
                          ? "border-primary border-2 bg-primary/10 shadow-primary/20 scale-[1.02]" 
                          : "border-border/50 bg-card hover:border-primary/50"
                      )}
                    >
                      {isSelected && (
                        <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground rounded-full p-1 shadow-md">
                          <CheckIcon className="size-4 stroke-[3]" />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <Icon className="size-3.5" />
                          </div>
                          <Badge variant="outline" className="text-[10px] uppercase font-semibold bg-background">
                            {addr.type}
                          </Badge>
                        </div>
                        
                        <div onClick={(e) => e.stopPropagation()}>
                          <UpdateAddressDialog 
                            address={{
                              id: addr.id,
                              type: addr.type,
                              houseNo: addr.houseNo,
                              location: addr.location,
                              landmark: addr.landmark,
                              pinCode: addr.pinCode,
                              city: addr.city,
                              state: addr.state,
                            }}
                            trigger={
                              <div className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer">
                                <PencilIcon className="size-4" />
                              </div>
                            }
                          />
                        </div>
                      </div>
                      <div className="text-xs space-y-1 text-muted-foreground mt-3">
                        <p className="font-semibold text-foreground text-sm">{addr.houseNo}</p>
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
          <div className="space-y-8 mt-6">
            
            {/* 1. LOCATION SEARCH OR SUMMARY */}
            <div className="space-y-5">
              {!hasLocation ? (
                <Field>
                  <FieldLabel>
                    Locality / Area <span className="text-destructive">*</span>
                  </FieldLabel>
                  <div className="relative" ref={searchRef}>
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search area, building or locality"
                      className="pl-9 pr-9 h-11 shadow-sm"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setIsSearching(true)
                      }}
                      onFocus={() => setIsSearching(true)}
                    />
                    
                    {isLoadingLocations && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground animate-spin" />
                    )}
                    
                    {isSearching && searchQuery.length > 2 && (
                      <div className="absolute z-50 w-full mt-2 bg-popover border rounded-xl shadow-lg flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="max-h-60 overflow-auto">
                          {isLoadingLocations ? (
                            <div className="p-4 space-y-3">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3 animate-pulse">
                                  <div className="size-4 bg-muted rounded-full shrink-0"></div>
                                  <div className="space-y-2 flex-1">
                                    <div className="h-3 bg-muted rounded w-3/4"></div>
                                    <div className="h-2 bg-muted rounded w-1/2"></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : locations.length > 0 ? locations.map(loc => (
                            <div 
                              key={loc.id}
                              className={cn(
                                "px-4 py-3 border-b last:border-0 transition-colors flex items-center gap-3",
                                loc.isBangalore ? "hover:bg-muted cursor-pointer" : "bg-destructive/5 cursor-not-allowed opacity-90"
                              )}
                              onClick={() => {
                                if (!loc.isBangalore) {
                                  form.setError('address.location', { type: 'manual', message: 'We currently only serve locations within Bangalore.' })
                                  return
                                }
                                form.clearErrors('address.location')
                                form.setValue('address.location', loc.locality, { shouldValidate: true, shouldDirty: true })
                                form.setValue('address.pincode', loc.pincode, { shouldValidate: true, shouldDirty: true })
                                setIsSearching(false)
                                setSearchQuery('')
                              }}
                            >
                              <MapPinIcon className={cn("size-4 shrink-0", loc.isBangalore ? "text-muted-foreground" : "text-destructive/70")} />
                              <div className="flex-1">
                                <p className={cn("text-sm font-medium", !loc.isBangalore && "text-destructive/90")}>{loc.locality}</p>
                                <div className="flex items-center justify-between mt-0.5">
                                  {loc.pincode && <p className="text-xs text-muted-foreground">{loc.state} · {loc.pincode}</p>}
                                  {!loc.isBangalore && <span className="text-[10px] font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded uppercase ml-2">Out of Service Area</span>}
                                </div>
                              </div>
                            </div>
                          )) : (
                            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                              No locations found
                            </div>
                          )}
                        </div>
                        <div 
                          className="px-4 py-3 hover:bg-muted cursor-pointer flex items-center gap-3 transition-colors bg-muted/50 border-t shrink-0"
                          onClick={() => {
                            form.clearErrors('address.location')
                            form.setValue('address.location', searchQuery, { shouldValidate: true, shouldDirty: true })
                            form.setValue('address.pincode', '', { shouldValidate: true, shouldDirty: true })
                            setIsSearching(false)
                          }}
                        >
                          <MapPinIcon className="size-4 text-muted-foreground shrink-0" />
                          <div>
                            <p className="text-sm font-medium line-clamp-1">Use "{searchQuery}"</p>
                            <p className="text-xs text-muted-foreground">I will provide my pincode manually</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Keep the controller here to register the field properly and show validation errors if empty when submitting */}
                  <Controller
                    name="address.location"
                    control={form.control}
                    render={({ fieldState }) => (
                      fieldState.invalid && fieldState.isTouched ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : <span className="hidden" />
                    )}
                  />
                </Field>
              ) : (
                <div className="p-4 bg-muted/30 border border-primary/20 rounded-xl flex items-center justify-between shadow-sm relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                  <div className="flex gap-3 items-start pl-2">
                    <MapPinIcon className="size-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground text-[15px]">{form.watch('address.location')}</p>
                      {form.watch('address.pincode') && <p className="text-sm text-muted-foreground font-medium">{form.watch('address.pincode')}</p>}
                    </div>
                  </div>
                  <Button 
                    type="button"
                    variant="ghost" 
                    className="text-primary hover:bg-primary/10 hover:text-primary px-3 h-9"
                    size="sm" 
                    onClick={() => {
                      form.setValue('address.location', '', { shouldValidate: true, shouldDirty: true })
                      form.setValue('address.pincode', '', { shouldValidate: true, shouldDirty: true })
                      setSearchQuery('')
                    }}
                  >
                    Change
                  </Button>
                </div>
              )}
            </div>

            {/* 2. ADDRESS DETAILS */}
            {hasLocation && (
              <div className="space-y-5 pt-2 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="grid grid-cols-1 gap-5">
                  <Controller
                    name="address.houseNo"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid && fieldState.isTouched}
                        aria-invalid={fieldState.invalid && fieldState.isTouched}
                      >
                        <FieldLabel htmlFor="house-flat-floor-no">
                          House / Flat / Floor No. <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          id="house-flat-floor-no"
                          placeholder="e.g. Flat 302, Green Valley Apts"
                          className="h-11 shadow-sm"
                          {...field}
                          aria-invalid={fieldState.invalid && fieldState.isTouched}
                        />
                        {fieldState.invalid && fieldState.isTouched && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {/* If user picked a custom location without pincode, we ask them manually here */}
                  {!form.watch('address.pincode') && (
                    <Controller
                      name="address.pincode"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid && fieldState.isTouched}
                          aria-invalid={fieldState.invalid && fieldState.isTouched}
                        >
                          <FieldLabel htmlFor="pincode">
                            Pincode <span className="text-destructive">*</span>
                          </FieldLabel>
                          <Input
                            id="pincode"
                            placeholder="e.g. 560001"
                            maxLength={6}
                            className="h-11 shadow-sm"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            aria-invalid={fieldState.invalid && fieldState.isTouched}
                          />
                          {fieldState.invalid && fieldState.isTouched && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  )}

                  <Controller
                    name="address.landmark"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid && fieldState.isTouched}
                        aria-invalid={fieldState.invalid && fieldState.isTouched}
                      >
                        <FieldLabel htmlFor="landmark-directions">
                          Landmark / Directions to reach (Optional)
                        </FieldLabel>
                        <Input
                          id="landmark-directions"
                          placeholder="e.g. Near Metro Station / Behind Supermarket"
                          className="h-11 shadow-sm"
                          {...field}
                          aria-invalid={fieldState.invalid && fieldState.isTouched}
                        />
                        {fieldState.invalid && fieldState.isTouched && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                {/* 3. ADDRESS TYPE */}
                <div className="space-y-5 pt-4">
                  <h3 className="text-[15px] font-semibold text-foreground/80 mb-1">Address Type</h3>
                  <Controller
                    name="address.addressType"
                    control={form.control}
                    render={({ field }) => (
                      <div className="flex gap-3">
                        {[
                          { id: 'HOME', label: 'Home', icon: HomeIcon },
                          { id: 'OFFICE', label: 'Work', icon: BuildingIcon },
                          { id: 'OTHER', label: 'Other', icon: MapPinIcon },
                        ].map((type) => {
                          const Icon = type.icon;
                          const isSelected = field.value === type.id;
                          return (
                            <div
                              key={type.id}
                              onClick={() => {
                                 field.onChange(type.id);
                                 form.setValue('address.isChecked', type.id !== 'HOME', { shouldValidate: true, shouldDirty: true });
                              }}
                              className={cn(
                                "flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-4 rounded-lg border cursor-pointer transition-all duration-200",
                                isSelected 
                                  ? "bg-primary/10 border-primary text-primary font-medium shadow-sm ring-1 ring-primary/20 scale-[1.02]" 
                                  : "bg-card border-border/60 text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:border-border"
                              )}
                            >
                              <Icon className="size-4" />
                              <span>{type.label}</span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  />
                  {form.watch('address.addressType') === 'OTHER' && (
                    <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <Field>
                        <FieldLabel htmlFor="other-label">Address Label (Optional)</FieldLabel>
                        <Input id="other-label" placeholder="e.g. Friend's House" className="h-11 shadow-sm" />
                      </Field>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </FieldGroup>
  )
}
