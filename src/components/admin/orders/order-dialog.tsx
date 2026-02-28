import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { OrderStatus } from "@/components/orders/order-status"
import { formatPrice } from "@/lib/utils"
import { formatDate } from "@/lib/date"
import { toast } from "@/components/ui/use-toast"
import { Order } from "@/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface OrderDialogProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onOrderUpdate: () => void
}

export function OrderDialog({ order, open, onOpenChange, onOrderUpdate }: OrderDialogProps) {
  if (!order) return null

  async function updateOrderStatus(newStatus: string) {
    if (!order?._id || !newStatus) return;

    try {
      const res = await fetch(`/api/orders/${order._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error("Failed to update order")

      onOrderUpdate()
      onOpenChange(false) // Close the dialog after successful update
      toast({
        title: "Success",
        description: "Order status updated",
      })
    } catch (error) {
      console.error('Error updating order:', error)
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order #{order._id || 'Unknown'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-muted-foreground">Order Date:</p>
              <p>{order.createdAt ? formatDate(order.createdAt) : 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Status:</p>
              <OrderStatus status={order.status || 'unknown'} />
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Total Amount:</p>
              <p>{formatPrice(order.totalAmount || 0)}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Payment Status:</p>
              <p className="capitalize">{order.paymentStatus}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Update Status:</p>
              <Select
                value={order.status}
                onValueChange={(value) => updateOrderStatus(value)}
              >
                <SelectTrigger className="mt-1 w-full rounded-md border p-2">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <p className="mb-2 font-medium text-muted-foreground">Products:</p>
            <div className="rounded-lg border p-4 space-y-4">
              {order.products?.map((item, index) => (
                <div key={index} className="flex justify-between py-2 border-b last:border-0">
                  <div className="space-y-1">
                    <p className="font-medium">{item?.product?.name || 'Unknown Product'}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item?.quantity || 0}
                    </p>
                    {item?.selectedVariant?.size && (
                      <p className="text-sm text-muted-foreground">
                        Gold Colour: {item.selectedVariant.size}
                      </p>
                    )}
                    {item.selectedVariant.color && (
                      <p className="text-sm text-muted-foreground">
                        Enamel Colour: {item.selectedVariant.color}
                      </p>
                    )}
                    {item.selectedVariant.caratSize && (
                      <p className="text-sm text-muted-foreground">
                        Stones: {item.selectedVariant.caratSize}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      SKU: {item.selectedVariant.sku}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice((item?.selectedVariant?.price || 0) * (item?.quantity || 1))}</p>
                    <p className="text-sm text-muted-foreground">
                      ({formatPrice(item.selectedVariant.price)} each)
                    </p>
                  </div>
                </div>
              )) || <p>No products found</p>}
              <div className="flex justify-between pt-4 border-t">
                <p className="font-medium">Total</p>
                <p className="font-medium">{formatPrice(order.totalAmount)}</p>
              </div>
            </div>
          </div>

          {order.shippingAddress && (
            <div>
              <p className="mb-2 font-medium text-muted-foreground">Shipping Address:</p>
              <div className="rounded-lg border p-4">
                <p>{`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}</p>
                <p>{order.shippingAddress.address}</p>
                {order.shippingAddress.aptSuite && <p>Apt/Suite: {order.shippingAddress.aptSuite}</p>}
                <p>
                  {[
                    order.shippingAddress.city,
                    order.shippingAddress.emirates,
                    order.shippingAddress.country
                  ].filter(Boolean).join(', ')}
                </p>
                {order.shippingAddress.phone && <p>Phone: {order.shippingAddress.phone}</p>}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}