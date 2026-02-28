export interface DashboardData {
  totalRevenue: number
  ordersCount: number
  productsCount: number
  activeUsers: number
  recentOrders: Array<{
    _id: string
    totalAmount: number
    createdAt: string
    userId: {
      name: string
      email: string
    }
  }>
  monthlyData: Array<{
    name: string
    total: number
  }>
  revenueChange: number
  subscribers: Array<{
    _id: string
    email: string
    status: string
    createdAt: string
  }>
  contacts: Array<{
    _id: string
    name: string
    email: string
    subject: string
    message: string
    status: string
    createdAt: string
  }>
}
