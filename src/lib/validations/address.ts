import * as z from "zod"

export const addressSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  aptSuite: z.string().optional(),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  emirates: z.string().min(1, "Emirates is required"),
  phone: z.string().min(1, "Phone number is required"),
  isDefault: z.boolean().default(false).optional(),
})

export type AddressFormData = z.infer<typeof addressSchema>