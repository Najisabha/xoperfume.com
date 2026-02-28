import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Contact } from "@/types"

interface ContactDialogProps {
  contact: Contact | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContactDialog({ contact, open, onOpenChange }: ContactDialogProps) {
  if (!contact) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{contact.subject}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-muted-foreground">From:</p>
              <p>{contact.name}</p>
              <p>{contact.email}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-muted-foreground">Date:</p>
              <p>{new Date(contact.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}</p>
              <p>{new Date(contact.createdAt).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit'
              })}</p>
            </div>
          </div>
          <div>
            <p className="mb-2 font-medium text-muted-foreground">Message:</p>
            <p className="whitespace-pre-wrap rounded-lg bg-muted p-4">
              {contact.message}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}