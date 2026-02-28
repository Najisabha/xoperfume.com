"use client"

import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { addressSchema, type AddressFormData } from "@/lib/validations/address"
import { toast } from "@/components/ui/use-toast"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { type Address } from "@/types"
import { useSession } from "next-auth/react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null);

// Ref interface for Stripe elements
interface StripeContextRef {
  stripe: any;
  elements: any;
}

// Inner Component to capture stripe/elements
const StripeCardSection = forwardRef<StripeContextRef, {}>((props, ref) => {
  const stripe = useStripe()
  const elements = useElements()

  useImperativeHandle(ref, () => ({
    stripe,
    elements
  }))

  return <PaymentElement />
})
StripeCardSection.displayName = "StripeCardSection"

// Minimal wrapper for Stripe
const StripeWrapper = forwardRef<StripeContextRef, { clientSecret: string }>(({ clientSecret }, ref) => {
  if (!clientSecret) return <Spinner />
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripeCardSection ref={ref} />
    </Elements>
  )
})
StripeWrapper.displayName = "StripeWrapper"

export interface CheckoutFormProps {
  finalTotal: number
  appliedPromo: any
  paymentIntentId: string | null
  setPaymentIntentId: (id: string) => void
  lang?: string
  dict?: any
}

export function CheckoutForm({ finalTotal, appliedPromo, paymentIntentId, setPaymentIntentId, lang, dict }: CheckoutFormProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { state: { items, total }, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  // Default to cash to prevent calling /payments on mount
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('cash')
  const [clientSecret, setClientSecret] = useState("")

  const stripeRef = useRef<StripeContextRef>(null)

  const t = dict?.checkout || {}
  const isRtl = lang === 'ar' || lang === 'he'

  // Fetch Payment Intent only when 'card' is selected
  useEffect(() => {
    if (paymentMethod === 'card' && !paymentIntentId && !clientSecret) {
      fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalTotal,
          promoCode: appliedPromo
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret)
          setPaymentIntentId(data.paymentIntentId)
          Cookies.set('temp_payment_intent', data.paymentIntentId, { expires: 1 / 24 })
        })
        .catch(console.error)
    } else if (paymentIntentId && !clientSecret) {
      // If we have an intent in cookie but no clientSecret (reloaded page),
      // we might need to recreate or fetch the secret. For simplicity, we just refetch if card is chosen
    }
  }, [paymentMethod, paymentIntentId, clientSecret, finalTotal, appliedPromo, setPaymentIntentId])

  useEffect(() => {
    return () => {
      Cookies.remove('temp_payment_intent')
      Cookies.remove('temp_promo')
    }
  }, [])

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: "", lastName: "", address: "", aptSuite: "",
      city: "", country: "", emirates: "", phone: "", isDefault: false,
    }
  })

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: "", lastName: "", address: "", aptSuite: "",
      city: "", country: "", emirates: "", phone: "", isDefault: false,
    }
  })

  const orderDetailsForm = useForm({
    resolver: zodResolver(z.object({
      email: z.string().email("Invalid email address"),
    })),
    defaultValues: {
      email: "",
    }
  })


  useEffect(() => {
    if (session?.user) {
      fetch("/api/user/addresses")
        .then(res => res.json())
        .then(data => {
          setAddresses(data)
          if (data.length > 0) {
            const defaultAddress = data.find((addr: Address) => addr.isDefault) || data[0]
            setSelectedAddressId(defaultAddress._id!)
          } else {
            setShowNewAddressForm(true)
          }
        })
        .catch(console.error)
    } else {
      setShowNewAddressForm(true)
    }
  }, [session])

  useEffect(() => {
    if (session?.user?.email) {
      orderDetailsForm.setValue('email', session.user.email);
    }
  }, [session, orderDetailsForm])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (paymentMethod === 'card' && !stripeRef.current?.stripe) return;

    try {
      setIsSubmitting(true);

      const orderDetails = orderDetailsForm.getValues();
      const isOrderDetailsValid = await orderDetailsForm.trigger();
      if (!isOrderDetailsValid) {
        throw new Error("Please fill in all required fields correctly");
      }

      let shippingAddress: AddressFormData;

      if (!session?.user || showNewAddressForm) {
        const formData = addressForm.getValues();
        const isValid = await addressForm.trigger();
        if (!isValid) {
          throw new Error("Please fill in all address fields correctly");
        }
        shippingAddress = formData;
      } else if (selectedAddressId) {
        const selectedAddress = addresses.find(addr => addr._id?.toString() === selectedAddressId);
        if (!selectedAddress) {
          throw new Error("Please select a valid address");
        }

        shippingAddress = {
          firstName: selectedAddress.firstName,
          lastName: selectedAddress.lastName,
          address: selectedAddress.address,
          aptSuite: selectedAddress.aptSuite,
          city: selectedAddress.city || "",
          country: selectedAddress.country || "",
          emirates: selectedAddress.emirates || "",
          phone: selectedAddress.phone || "",
        };
      } else {
        throw new Error("Please select an address or create a new one");
      }

      let finalPaymentIntentId = "CASH";

      if (paymentMethod === 'card') {
        const { stripe, elements } = stripeRef.current!;
        const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/orders/success`,
            payment_method_data: {
              billing_details: {
                address: {
                  city: shippingAddress.city,
                  country: shippingAddress.country,
                  line1: shippingAddress.address,
                  line2: shippingAddress.aptSuite,
                }
              }
            }
          },
          redirect: "if_required",
        });

        if (stripeError) {
          if (stripeError.type === "card_error" || stripeError.type === "validation_error") {
            setIsSubmitting(false);
            return;
          }
          throw new Error(stripeError.message);
        }

        if (paymentIntent && paymentIntent.status === "succeeded") {
          finalPaymentIntentId = paymentIntent.id;
        } else {
          setIsSubmitting(false);
          return;
        }
      }

      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          total: finalTotal,
          originalTotal: total,
          shippingAddress,
          customerEmail: session?.user?.email || orderDetails.email,
          paymentIntentId: finalPaymentIntentId,
          promoCode: appliedPromo ? {
            code: appliedPromo.code,
            discount: appliedPromo.calculatedDiscount
          } : null,
          userId: session?.user?.id
        }),
      });

      if (!orderResponse.ok) throw new Error("Failed to create order");

      const order = await orderResponse.json();
      clearCart();
      router.push(`/${lang || 'en'}/orders/success?id=${order._id}`);
      // Removed generic toast to prioritize the thank you page
    } catch (error) {
      toast({
        title: t.error || "Error",
        description: (error as any)?.message || "Failed to process payment",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4 border rounded-lg p-4">
        <h3 className="font-medium">{t.order_details || 'Order Details'}</h3>
        <Form {...orderDetailsForm}>
          <div className="space-y-4">
            <FormField
              control={orderDetailsForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.email || 'Email'}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      disabled={!!session?.user}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </div>

      {!session?.user && (
        <div className="rounded-md bg-muted p-4 mb-4">
          <p className="text-sm text-primary">
            {t.sign_in_save || 'Sign in to save this address for future purchases'}
          </p>
        </div>
      )}

      {session?.user && addresses.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">{t.select_address || 'Select Shipping Address'}</h3>
          <RadioGroup
            value={selectedAddressId}
            onValueChange={(value) => {
              setSelectedAddressId(value)
              setShowNewAddressForm(value === "new")
            }}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {addresses.map((address) => (
              <div key={address._id} className="flex items-center space-x-3">
                <RadioGroupItem value={address._id!} id={address._id} className={isRtl ? 'ml-3 space-x-0' : ''} />
                <Card className="flex-1">
                  <CardContent className="p-3">
                    <p className="font-medium">{address.firstName} {address.lastName}</p>
                    <p>{address.address}</p>
                    {address.aptSuite && <p>{address.aptSuite}</p>}
                    <p>{address.city}, {address.country}</p>
                    <p>{address.emirates}</p>
                    <p>{address.phone}</p>
                    {address.isDefault && (
                      <p className="text-sm text-muted-foreground">{t.default_address || 'Default Address'}</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="new" id="new" className={isRtl ? 'ml-3' : ''} />
              <label htmlFor="new" className="text-sm">{t.use_new_address || 'Use a new address'}</label>
            </div>
          </RadioGroup>
        </div>
      )}

      {showNewAddressForm && (
        <div className="space-y-4 border rounded-lg p-4">
          <h3 className="font-medium">{t.new_address || 'New Shipping Address'}</h3>
          <Form {...addressForm}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addressForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.first_name || 'First Name'}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addressForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.last_name || 'Last Name'}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={addressForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.address || 'Address'}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addressForm.control}
                name="aptSuite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.apt_suite || 'Apartment/Suite (Optional)'}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addressForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.city || 'City'}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addressForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.country || 'Country'}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addressForm.control}
                  name="emirates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.state_province || t.emirates || 'State / Province'}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addressForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.phone || 'Phone'}</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Form>
        </div>
      )}

      <div className="space-y-4 border rounded-lg p-4">
        <h3 className="font-medium">{t.payment_method || 'Payment Method'}</h3>
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value: 'card' | 'cash') => setPaymentMethod(value)}
          className="flex flex-col space-y-2"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="card" id="pm-card" className={isRtl ? 'ml-3 space-x-0' : ''} />
            <label htmlFor="pm-card" className="font-medium">{t.credit_card || 'Credit Card'}</label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="cash" id="pm-cash" className={isRtl ? 'ml-3 space-x-0' : ''} />
            <label htmlFor="pm-cash" className="font-medium">{t.cash || 'Cash on Delivery'}</label>
          </div>
        </RadioGroup>
      </div>

      <div className={`mb-6 ${paymentMethod === 'cash' ? 'hidden' : ''}`}>
        {paymentMethod === 'card' && clientSecret && (
          <StripeWrapper clientSecret={clientSecret} ref={stripeRef} />
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || (paymentMethod === 'card' && (!stripeRef.current?.stripe)) || (!selectedAddressId && !showNewAddressForm)}
      >
        {isSubmitting ? (
          <>
            <Spinner className="mr-2" />
            {t.processing || 'Processing...'}
          </>
        ) : (
          paymentMethod === 'card' ? (t.pay_card || 'Pay and Place Order') : (t.pay_cash || 'Place Order with Cash')
        )}
      </Button>
    </form>
  )
}