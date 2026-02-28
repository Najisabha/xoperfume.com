"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddressCard } from "./address-card"
import { AddressForm } from "./address-form"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Placeholder } from "@/components/ui/placeholder"
import { Address } from "@/types"


export function AddressBook({ lang, dict }: { lang: string, dict: any }) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const isRtl = lang === 'ar' || lang === 'he'

  useEffect(() => {
    async function fetchAddresses() {
      try {
        const response = await fetch("/api/user/addresses")
        if (!response.ok) throw new Error("Failed to fetch addresses")
        const data = await response.json()
        setAddresses(data)
      } catch (error) {
        toast({
          title: dict?.auth?.error || "Error",
          description: "Failed to load addresses",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAddresses()
  }, [])

  async function onAddAddress(address: Omit<Address, "id">) {
    try {
      const response = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(address),
      })

      if (!response.ok) throw new Error("Failed to add address")

      const data = await response.json()
      setAddresses(data)
      setIsOpen(false)
      toast({
        title: dict?.auth?.success || "Address added",
        description: "Your address has been added successfully.",
      })
    } catch (error) {
      toast({
        title: dict?.auth?.error || "Error",
        description: "Failed to add address",
        variant: "destructive",
      })
    }
  }

  async function onDeleteAddress(id: string) {
    try {
      const response = await fetch(`/api/user/addresses/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete address")

      setAddresses(addresses.filter(address => address._id !== id))
      toast({
        title: dict?.auth?.success || "Address deleted",
        description: "Your address has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: dict?.auth?.error || "Error",
        description: "Failed to delete address",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Placeholder
              key={i}
              className="rounded-lg border p-4"
              lines={3}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Plus className={`${isRtl ? 'ml-2' : 'mr-2'} h-4 w-4`} />
            {dict?.checkout?.new_address || 'Add New Address'}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <AddressForm onSubmit={onAddAddress} lang={lang} dict={dict} />
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {addresses.map((address) => (
          <AddressCard
            key={address._id}
            address={address}
            onDelete={() => onDeleteAddress(address._id as string)}
            lang={lang}
            dict={dict}
          />
        ))}
      </div>
    </div>
  )
} 