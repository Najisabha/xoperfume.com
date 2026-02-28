"use client"

import { useState, useEffect, useMemo } from "react"
import { formatPrice } from "@/lib/utils"
import { formatDate } from "@/lib/date"
import { OrderStatus } from "@/components/orders/order-status"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { OrderDialog } from "./order-dialog"
import { Order } from "@/types"
import { ChevronUp, ChevronDown, Search } from "lucide-react"

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/orders")
      if (!res.ok) throw new Error('Failed to fetch orders')
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Unable to load orders. Please try again later.')
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredAndSortedOrders = useMemo(() => {
    return orders
      .filter(order => {
        const matchesSearch = searchQuery === "" ||
          order._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.products?.some(item =>
            item?.product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
          )

        const matchesStatus = statusFilter === "all" || order.status === statusFilter
        const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter

        return matchesSearch && matchesStatus && matchesPayment
      })
      .sort((a, b) => {
        const aValue = a[sortField as keyof Order]
        const bValue = b[sortField as keyof Order]

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }

        if (aValue instanceof Date && bValue instanceof Date) {
          return sortDirection === "asc"
            ? aValue.getTime() - bValue.getTime()
            : bValue.getTime() - aValue.getTime()
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue
        }

        return 0
      })
  }, [orders, searchQuery, statusFilter, paymentFilter, sortField, sortDirection])

  if (error) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div>Loading orders...</div>
        </div>
      ) : filteredAndSortedOrders.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <p>No orders found</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("createdAt")}
                    className="flex items-center space-x-1"
                  >
                    Date
                    {sortField === "createdAt" && (
                      sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>Products</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("status")}
                    className="flex items-center space-x-1"
                  >
                    Status
                    {sortField === "status" && (
                      sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("totalAmount")}
                    className="flex items-center space-x-1"
                  >
                    Total
                    {sortField === "totalAmount" && (
                      sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedOrders.map((order) => (
                <TableRow
                  key={order._id || crypto.randomUUID()}
                  className="cursor-pointer"
                  onClick={() => {
                    if (order) {
                      setSelectedOrder(order)
                      setDialogOpen(true)
                    }
                  }}
                >
                  <TableCell>{order._id?.slice(0, 6) || 'N/A'}</TableCell>
                  <TableCell>{order.createdAt ? formatDate(order.createdAt) : 'N/A'}</TableCell>
                  <TableCell>
                    {order.products?.map((item, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        {item?.product?.name || 'Unknown Product'} ({item?.quantity || 0})
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <OrderStatus status={order.status || 'unknown'} />
                  </TableCell>
                  <TableCell>
                    <span className={`capitalize ${order.paymentStatus === 'paid' ? 'text-green-600' :
                        order.paymentStatus === 'failed' ? 'text-red-600' :
                          'text-yellow-600'
                      }`}>
                      {order.paymentStatus || 'unknown'}
                    </span>
                  </TableCell>
                  <TableCell>{formatPrice(order.totalAmount || 0)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <OrderDialog
        order={selectedOrder}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onOrderUpdate={fetchOrders}
      />
    </div>
  )
}