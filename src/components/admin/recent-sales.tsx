import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatPrice } from "@/lib/utils"

interface RecentSalesProps {
  orders: Array<any & { userId: { name: string; email: string } }>
}

export function RecentSales({ orders }: RecentSalesProps) {
  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div 
          key={order._id} 
          className="flex items-center rounded-lg p-2 transition-colors hover:bg-muted/50"
        >
          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-primary/10">
              {order.userId?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1 flex-1">
            <p className="text-sm font-medium leading-none">{order.userId?.name || 'Guest User'}</p>
            <p className="text-sm text-muted-foreground">{order.userId?.email || 'N/A'}</p>
          </div>
          <div className="ml-auto font-medium">
            <span className="text-green-600 dark:text-green-400">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}