
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { User2, UserCog2Icon } from "lucide-react"

type RoleDialogProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: (role: 'user' | 'admin') => void
  currentRole: 'user' | 'admin'
}

export function RoleDialog({ isOpen, onClose, onConfirm, currentRole }: RoleDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button
            variant={currentRole === 'user' ? "default" : "outline"}
            onClick={() => onConfirm('user')}
          >
            <User2 className="h-4 w-4 mr-2" />
            User
          </Button>
          <Button
            variant={currentRole === 'admin' ? "default" : "outline"}
            onClick={() => onConfirm('admin')}
          >
            <UserCog2Icon className="h-4 w-4 mr-2" />
            Admin
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}