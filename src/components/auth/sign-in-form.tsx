"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

interface SignInFormProps {
  onSuccess?: () => void // for sheet only
  callbackUrl?: string
  dict: any
}

export function SignInForm({ onSuccess, callbackUrl, dict }: SignInFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      setError(null)

      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: callbackUrl,
      })
      if (result?.ok) {
        // Update session info after successful login
        await fetch('/api/user/sessions/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userAgent: navigator.userAgent,
            ipAddress: ""
          })
        })

        toast({
          title: dict.auth.success,
          description: dict.auth.success_signin,
        })

        router.refresh()
        onSuccess?.()
        if (callbackUrl) {
          router.push(callbackUrl)
        }
      } else {
        setError(dict.auth.invalid_credentials)
        toast({
          title: dict.auth.error,
          description: dict.auth.invalid_credentials,
          variant: "destructive",
        })
      }
    } catch (error) {
      setError(dict.auth.error_general)
      toast({
        title: dict.auth.error,
        description: dict.auth.error_general,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dict.auth.email}</FormLabel>
              <FormControl>
                <Input placeholder={dict.auth.email_placeholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dict.auth.password}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <div className="text-sm text-red-500">
            {error}
          </div>
        )}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? dict.auth.signing_in : dict.auth.sign_in}
        </Button>
      </form>
    </Form>
  )
}