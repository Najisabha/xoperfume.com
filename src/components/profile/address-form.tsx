"use client"

import { type Address } from "@/types"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { addressSchema, type AddressFormData } from "@/lib/validations/address"

interface AddressFormProps {
  initialData?: Address
  onSubmit: (data: AddressFormData) => Promise<void>
  onCancel?: () => void
  submitLabel?: string
  lang: string
  dict: any
}

export function AddressForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel,
  lang,
  dict
}: AddressFormProps) {
  const t = dict?.checkout || {}
  const common = dict?.common || {}
  const isRtl = lang === 'ar' || lang === 'he'

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: initialData?.firstName ?? "",
      lastName: initialData?.lastName ?? "",
      address: initialData?.address ?? "",
      aptSuite: initialData?.aptSuite ?? "",
      city: initialData?.city ?? "",
      country: initialData?.country ?? "",
      emirates: initialData?.emirates ?? "",
      phone: initialData?.phone ?? "",
      isDefault: initialData?.isDefault ?? false,
    },
  })

  const labelClass = isRtl ? 'text-right' : 'text-left'
  const inputClass = isRtl ? 'text-right' : 'text-left'

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className={labelClass}>
                <FormLabel>{t.first_name || 'First Name'}</FormLabel>
                <FormControl>
                  <Input {...field} className={inputClass} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className={labelClass}>
                <FormLabel>{t.last_name || 'Last Name'}</FormLabel>
                <FormControl>
                  <Input {...field} className={inputClass} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className={labelClass}>
              <FormLabel>{t.address || 'Address'}</FormLabel>
              <FormControl>
                <Input {...field} className={inputClass} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aptSuite"
          render={({ field }) => (
            <FormItem className={labelClass}>
              <FormLabel>{t.apt_suite || 'Apartment/Suite (Optional)'}</FormLabel>
              <FormControl>
                <Input {...field} className={inputClass} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className={labelClass}>
                <FormLabel>{t.city || 'City'}</FormLabel>
                <FormControl>
                  <Input {...field} className={inputClass} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className={labelClass}>
                <FormLabel>{t.country || 'Country'}</FormLabel>
                <FormControl>
                  <Input {...field} className={inputClass} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="emirates"
            render={({ field }) => (
              <FormItem className={labelClass}>
                <FormLabel>{t.state_province || t.emirates || 'State/Province'}</FormLabel>
                <FormControl>
                  <Input {...field} className={inputClass} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className={labelClass}>
                <FormLabel>{t.phone || 'Phone'}</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" className={inputClass} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className={`flex items-center gap-2 space-x-0 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm font-normal">
                {t.set_as_default || 'Set as default address'}
              </FormLabel>
            </FormItem>
          )}
        />

        <div className={`flex gap-4 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
          <Button
            type="submit"
            className="flex-1"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (dict?.profile?.saving || "Saving...") : (submitLabel || dict?.profile?.save_changes || "Save Address")}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {common.cancel || "Cancel"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}