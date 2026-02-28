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

export function AuthSheet({ icon }: { icon?: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {icon ? (
          <User className="h-5 w-5 hover:cursor-pointer" />
        ) : (
          <span className="hover:cursor-pointer">My Account</span>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-[90%] flex-col bg-white sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-center">Welcome to XO Perfumes</SheetTitle>
        </SheetHeader>
        <Tabs defaultValue="signin" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <SignInForm onSuccess={() => setOpen(false)} />
          </TabsContent>
          <TabsContent value="signup">
            <SignUpForm onSuccess={() => setOpen(false)} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}