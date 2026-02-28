"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { profileSchema, type ProfileFormData } from "@/lib/validations/profile"
import { Spinner } from "@/components/ui/spinner"
import { Placeholder } from "@/components/ui/placeholder"
import { Skeleton } from "@/components/ui/skeleton"

export function ProfileForm({ lang, dict }: { lang: string, dict: any }) {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const t = dict?.profile || {}
  const isRtl = lang === 'ar' || lang === 'he'

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })

  useEffect(() => {
    if (!session?.user) return

    async function fetchProfile() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/user/profile")
        if (!response.ok) throw new Error("Failed to fetch profile")
        const data = await response.json()

        form.reset({
          name: data.name,
          email: data.email,
          phone: data.phone || "",
        })
      } catch (error) {
        toast({
          title: dict?.auth?.error || "Error",
          description: t.error_load || "Failed to load profile data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [session?.user, form.reset])

  async function onSubmit(data: ProfileFormData) {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to update profile")

      toast({
        title: dict?.auth?.success || "Success",
        description: t.success_update || "Your profile has been updated",
      })
    } catch (error) {
      toast({
        title: dict?.auth?.error || "Error",
        description: t.error_update || "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  if (session?.user) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className={isRtl ? 'text-right' : 'text-left'}>
                <FormLabel>{dict?.auth?.name || 'Name'}</FormLabel>
                <FormControl>
                  <Input {...field} className={isRtl ? 'text-right' : 'text-left'} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className={isRtl ? 'text-right' : 'text-left'}>
                <FormLabel>{dict?.auth?.email || 'Email'}</FormLabel>
                <FormControl>
                  <Input {...field} type="email" className={isRtl ? 'text-right' : 'text-left'} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className={isRtl ? 'text-right' : 'text-left'}>
                <FormLabel>{t.phone || 'Phone'} <span className="text-muted-foreground text-xs">({t.optional || 'optional'})</span></FormLabel>
                <FormControl>
                  <Input {...field} type="tel" className={isRtl ? 'text-right' : 'text-left'} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                <span>{t.saving || 'Saving...'}</span>
              </div>
            ) : (
              t.save_changes || "Save Changes"
            )}
          </Button>
        </form>
      </Form>
    )
  } else {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Placeholder
            key={i}
            className="space-y-2"
            lines={1}
            imageSize="sm"
          />
        ))}
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }
}