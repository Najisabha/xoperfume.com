"use client"

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
import { toast } from "@/components/ui/use-toast"
import { passwordSchema, type PasswordFormData } from "@/lib/validations/password"

export function PasswordForm({ lang, dict }: { lang: string, dict: any }) {
  const t = dict?.profile || {}
  const isRtl = lang === 'ar' || lang === 'he'

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: PasswordFormData) {
    try {
      const response = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      toast({
        title: dict?.auth?.success || "Success",
        description: t.password_success || "Your password has been updated",
      })

      form.reset()
    } catch (error) {
      toast({
        title: dict?.auth?.error || "Error",
        description: error instanceof Error ? error.message : (t.password_error || "Failed to update password"),
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem className={isRtl ? 'text-right' : 'text-left'}>
              <FormLabel>{dict?.auth?.password || 'Current Password'}</FormLabel>
              <FormControl>
                <Input type="password" {...field} className={isRtl ? 'text-right' : 'text-left'} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem className={isRtl ? 'text-right' : 'text-left'}>
              <FormLabel>{t.new_password || 'New Password'}</FormLabel>
              <FormControl>
                <Input type="password" {...field} className={isRtl ? 'text-right' : 'text-left'} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className={isRtl ? 'text-right' : 'text-left'}>
              <FormLabel>{t.confirm_password || 'Confirm New Password'}</FormLabel>
              <FormControl>
                <Input type="password" {...field} className={isRtl ? 'text-right' : 'text-left'} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting ? (t.saving || "Updating...") : (t.save_changes || "Update Password")}
        </Button>
      </form>
    </Form>
  )
} 