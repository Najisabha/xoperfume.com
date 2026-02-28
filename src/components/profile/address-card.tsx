import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Address } from "@/types"
import { Trash2 } from "lucide-react"

interface AddressCardProps {
  address: Address
  onDelete: () => void
}

export function AddressCard({ address, onDelete }: AddressCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">
            {address.isDefault && "Default"}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 text-sm">
          <p className="font-medium">{address.firstName} {address.lastName}</p>
          <p>{address.address}</p>
          {address.aptSuite && <p>{address.aptSuite}</p>}
          <p>{address.city}, {address.country}</p>
          <p>{address.emirates}</p>
          <p>{address.phone}</p>
        </div>
      </CardContent>
    </Card>
  )
}