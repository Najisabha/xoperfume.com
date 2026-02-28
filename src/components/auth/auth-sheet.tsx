"use client"

import { useState } from "react"
import { User } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SignInForm } from "./sign-in-form"
import { SignUpForm } from "./sign-up-form"

export function AuthSheet({ icon, label, dict }: { icon?: boolean, label?: string, dict: any }) {
  const [open, setOpen] = useState(false)

  if (!dict) return null

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {icon ? (
          <User className="h-5 w-5 -me-0.5 hover:cursor-pointer" />
        ) : (
          <span className="hover:cursor-pointer">{label || dict.header.my_account}</span>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-[90%] flex-col bg-white sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-center">{dict.auth.welcome}</SheetTitle>
        </SheetHeader>
        <Tabs defaultValue="signin" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">{dict.auth.sign_in}</TabsTrigger>
            <TabsTrigger value="signup">{dict.auth.sign_up}</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <SignInForm onSuccess={() => setOpen(false)} dict={dict} />
          </TabsContent>
          <TabsContent value="signup">
            <SignUpForm onSuccess={() => setOpen(false)} dict={dict} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}