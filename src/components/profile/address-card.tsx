import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Address } from "@/types"
import { Trash2 } from "lucide-react"

interface AddressCardProps {
  address: Address
  onDelete: () => void
  lang: string
  dict: any
}

export function AddressCard({ address, onDelete, lang, dict }: AddressCardProps) {
  const isRtl = lang === 'ar' || lang === 'he'
  return (
    <Card dir={isRtl ? 'rtl' : 'ltr'}>
      <CardHeader className={`flex flex-row items-center justify-between pb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">
            {address.isDefault && (dict?.checkout?.default_address || "Default")}
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
      <CardContent className={isRtl ? 'text-right' : 'text-left'}>
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