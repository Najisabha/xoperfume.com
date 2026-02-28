"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ContactForm } from "@/components/contact-form"
import { Mail, Phone, MessageSquare, Instagram } from "lucide-react"

export function ContactSheet({ icon, label, dict }: { icon?: boolean, label?: string, dict?: any }) {
  const [open, setOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)

  if (!dict) return null
  const c = dict.contact

  const handleOptionClick = (action: 'form' | 'phone' | 'email') => {
    if (action === 'form') {
      setShowForm(true)
    } else if (action === 'phone') {
      window.open('https://wa.me/91111111111', '_blank', 'noopener,noreferrer')
      setOpen(false)
    } else if (action === 'email') {
      window.open('mailto:info@xo-perfumes.com', '_blank', 'noopener,noreferrer')
      setOpen(false)
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          {icon ? (
            <Mail className="h-5 w-5 hover:cursor-pointer" />
          ) : (
            <span className="hover:cursor-pointer">{label || c.trigger_label}</span>
          )}
        </SheetTrigger>
        <SheetContent className="flex w-[90%] flex-col sm:max-w-lg bg-white">
          <SheetHeader>
            <SheetTitle>{c.sheet_title}</SheetTitle>
            <SheetDescription>
              {c.sheet_description}
            </SheetDescription>
          </SheetHeader>
          {!showForm ? (
            <div className="mt-6 grid gap-4">
              <Button
                variant="outline"
                className="flex items-center justify-start gap-2 p-6"
                onClick={() => handleOptionClick('form')}
              >
                <MessageSquare className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">{c.send_message}</div>
                  <div className="text-sm text-muted-foreground">
                    {c.form_subtitle}
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-start gap-2 p-6"
                onClick={() => handleOptionClick('phone')}
              >
                <Phone className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">{c.chat_us}</div>
                  <div className="text-sm text-muted-foreground">
                    + 91111111111
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-start gap-2 p-6"
                onClick={() => handleOptionClick('email')}
              >
                <Mail className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">{c.email_us}</div>
                  <div className="text-sm text-muted-foreground">
                    info@xo-perfumes.com
                  </div>
                </div>
              </Button>
            </div>
          ) : (
            <div className="mt-6">
              <Button
                variant="ghost"
                className="mb-4"
                onClick={() => setShowForm(false)}
              >
                {c.back_options}
              </Button>
              <ContactForm dict={dict} onSuccess={() => setOpen(false)} />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}