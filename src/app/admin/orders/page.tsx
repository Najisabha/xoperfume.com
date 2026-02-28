import { AdminOrders } from "@/components/admin/orders/admin-orders"

export default async function AdminOrdersPage() {

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders</h1>
      </div>
      <AdminOrders />
    </div>
  )
}