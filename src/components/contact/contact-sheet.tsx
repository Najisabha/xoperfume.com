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

export function ContactSheet({ icon }: { icon?: boolean }) {
  const [open, setOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleOptionClick = (action: 'form' | 'phone' | 'email') => {
    if (action === 'form') {
      setShowForm(true)
    } else if (action === 'phone') {
      window.open('https://wa.me/971568101611', '_blank', 'noopener,noreferrer')
      setOpen(false)
    } else if (action === 'email') {
      window.open('mailto:info@xoperfumes.com', '_blank', 'noopener,noreferrer')
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
            <span className="hover:cursor-pointer">Contact</span>
          )}
        </SheetTrigger>
        <SheetContent className="flex w-[90%] flex-col sm:max-w-lg bg-white">
          <SheetHeader>
            <SheetTitle>Got a question?</SheetTitle>
            <SheetDescription>
              Choose how you&apos;d like to get in touch with us
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
                  <div className="font-semibold">Send a Message</div>
                  <div className="text-sm text-muted-foreground">
                    Fill out our contact form
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
                  <div className="font-semibold">Chat with us</div>
                  <div className="text-sm text-muted-foreground">
                    +971 56 810 1611
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
                  <div className="font-semibold">Email us</div>
                  <div className="text-sm text-muted-foreground">
                    info@xoperfumes.com
                  </div>
                </div>
              </Button>
              <div className="mt-4 text-sm text-muted-foreground">
                Business Hours: Monday - Saturday 9am - 5pm (GST)
              </div>
              {/* Instagram Link */}
              <div>
                <Instagram className="h-5 w-5 me-1 inline hover:cursor-pointer" />
                <a
                  href="https://www.instagram.com/graceleonardofficial/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Follow us on Instagram
                </a>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <Button
                variant="ghost"
                className="mb-4"
                onClick={() => setShowForm(false)}
              >
                ← Back to options
              </Button>
              <ContactForm onSuccess={() => setOpen(false)} />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}