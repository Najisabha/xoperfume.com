"use client"

import { useState, useEffect } from "react"
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

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutFormProps {
  finalTotal: number
  appliedPromo: any
  paymentIntentId: string | null
  setPaymentIntentId: (id: string) => void
}

function CheckoutFormContent({ finalTotal, appliedPromo }: CheckoutFormProps) {
  const { data: session } = useSession()
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { state: { items, total }, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      aptSuite: "",
      city: "",
      country: "",
      emirates: "",
      phone: "",
      isDefault: false,
    }
  })

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      aptSuite: "",
      city: "",
      country: "",
      emirates: "",
      phone: "",
      isDefault: false,
    }
  })

  // Separate form for order details (email and child age)
  const orderDetailsForm = useForm({
    resolver: zodResolver(z.object({
      email: z.string().email("Invalid email address"),
      childAges: z.array(z.number().min(0, "Age must be positive").max(18, "Age must be 18 or under"))
    })),
    defaultValues: {
      email: "",
      childAges: [8]
    }
  });

  // Add this new function after the useEffect hooks
  const addAgeField = () => {
    const currentAges = orderDetailsForm.getValues("childAges");
    orderDetailsForm.setValue("childAges", [...currentAges, 8]);
  };

  const removeAgeField = (index: number) => {
    const currentAges = orderDetailsForm.getValues("childAges");
    orderDetailsForm.setValue("childAges", currentAges.filter((_, i) => i !== index));
  };

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
  }, [session]);

  // async function onAddressSubmit(data: AddressFormData) {
  //   if (!session?.user) {
  //     // For guest users, just use the address without saving
  //     form.reset(data)
  //     return
  //   }

  //   try {
  //     const response = await fetch("/api/user/addresses", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(data),
  //     });

  //     if (!response.ok) throw new Error("Failed to save address");

  //     const newAddresses = await response.json();
  //     setAddresses(newAddresses);
  //     setShowNewAddressForm(false);
  //     // Select the newly created address
  //     const newAddress = newAddresses[newAddresses.length - 1];
  //     setSelectedAddressId(newAddress._id);
      
  //     // Update form values with the new address
  //     form.reset(data);
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to save address",
  //       variant: "destructive"
  //     });
  //   }
  // }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
      setIsSubmitting(true);
      
      // Validate order details
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

      // Fixed payment confirmation
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
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === "succeeded") {
        // Create order
        const orderResponse = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            total: finalTotal,
            originalTotal: total,
            shippingAddress,
            childAge: orderDetails.childAges.join(','), // Convert array to comma-separated string
            customerEmail: session?.user?.email || orderDetails.email,
            paymentIntentId: paymentIntent.id,
            promoCode: appliedPromo ? {
              code: appliedPromo.code,
              discount: appliedPromo.calculatedDiscount
            } : null,
            userId: session?.user?.id // Will be undefined for guests
          }),
        });

        if (!orderResponse.ok) throw new Error("Failed to create order");

        const order = await orderResponse.json();
        clearCart();
        router.push(`/orders/${order._id}`);
        toast({
          title: "Order placed successfully",
          description: "Thank you for your purchase!"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as any)?.message || "Failed to process payment",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Details Section */}
      <div className="space-y-4 border rounded-lg p-4">
        <h3 className="font-medium">Order Details</h3>
        <Form {...orderDetailsForm}>
          <div className="space-y-4">
            <FormField
              control={orderDetailsForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Email" 
                      {...field}
                      disabled={!!session?.user} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">
                  Children Ages
                  </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAgeField}
                >
                  Add Another Child
                </Button>
              </div>
              
              {orderDetailsForm.watch("childAges").map((_, index) => (
                <div key={index} className="flex gap-2">
                  <FormField
                    control={orderDetailsForm.control}
                    name={`childAges.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="sr-only">Child {index + 1} Age</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="18"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="self-end mb-6"
                      onClick={() => removeAgeField(index)}
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Form>
      </div>

      {!session?.user && (
        <div className="rounded-md bg-muted p-4 mb-4">
          <p className="text-sm text-primary">
            Sign in to save this address for future purchases
          </p>
        </div>
      )}

      {session?.user && addresses.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Select Shipping Address</h3>
          <RadioGroup
            value={selectedAddressId}
            onValueChange={(value) => {
              setSelectedAddressId(value)
              setShowNewAddressForm(value === "new")
            }}
          >
            {addresses.map((address) => (
              <div key={address._id} className="flex items-center space-x-3">
                <RadioGroupItem value={address._id!} id={address._id} />
                <Card className="flex-1">
                  <CardContent className="p-3">
                    <p className="font-medium">{address.firstName} {address.lastName}</p>
                    <p>{address.address}</p>
                    {address.aptSuite && <p>{address.aptSuite}</p>}
                    <p>{address.city}, {address.country}</p>
                    <p>{address.emirates}</p>
                    <p>{address.phone}</p>
                    {address.isDefault && (
                      <p className="text-sm text-muted-foreground">Default Address</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="new" id="new" />
              <label htmlFor="new" className="text-sm">Use a new address</label>
            </div>
          </RadioGroup>
        </div>
      )}

      {showNewAddressForm && (
        <div className="space-y-4 border rounded-lg p-4">
          <h3 className="font-medium">New Shipping Address</h3>
          <Form {...addressForm}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addressForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First Name" {...field} />
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
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} />
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
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Address" {...field} />
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
                    <FormLabel>Apartment/Suite (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Apt/Suite" {...field} />
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
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
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
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
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
                      <FormLabel>Emirates</FormLabel>
                      <FormControl>
                        <Input placeholder="Emirates" {...field} />
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
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Phone" {...field} />
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

      <div className="mb-6">
        <PaymentElement />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || !stripe || !elements || (!selectedAddressId && !showNewAddressForm)}
      >
        {isSubmitting ? (
          <>
            <Spinner className="mr-2" />
            Processing...
          </>
        ) : (
          'Pay and Place Order'
        )}
      </Button>
    </form>
  )
}

export function CheckoutForm(props: CheckoutFormProps) {
  const [clientSecret, setClientSecret] = useState("")
  const { state: { total } } = useCart()

  useEffect(() => {
    if (!props.paymentIntentId) {
      // Create new payment intent only if one doesn't exist
      fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: props.finalTotal,
          promoCode: props.appliedPromo
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret)
          props.setPaymentIntentId(data.paymentIntentId)
          Cookies.set('temp_payment_intent', data.paymentIntentId, { expires: 1/24 })
        })
    }
  }, []) // Only run once on mount

  // Add cleanup on unmount
  useEffect(() => {
    return () => {
      Cookies.remove('temp_payment_intent')
      Cookies.remove('temp_promo')
    }
  }, [])

  if (!clientSecret) {
    return <Spinner />
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutFormContent {...props} />
    </Elements>
  )
}