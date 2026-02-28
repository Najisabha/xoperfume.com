import { Order } from "./models/order"
import { User } from "./models/user"
import { Product } from "./models/product"
import { SessionService } from "./services/session.service"
import connectDB from "./db"
import { Newsletter } from './models/newsletter'
import { Contact } from './models/contact'
import { serializeDocument } from "./utils/serialize"

export async function getDashboardData() {
  await connectDB()

  // Get monthly revenue data for the past 6 months
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const today = new Date()
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1)

  const orders = await Order.find({
    createdAt: { $gte: sixMonthsAgo }
  }).populate('userId', 'name email')

  // Organize monthly data
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const monthOrders = orders.filter(order =>
      order.createdAt.getMonth() === month.getMonth() &&
      order.createdAt.getFullYear() === month.getFullYear()
    )
    return {
      name: monthNames[month.getMonth()],
      total: monthOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    }
  }).reverse()

  // Get current statistics
  const [products] = await Promise.all([
    Product.find().countDocuments(),
    User.find().countDocuments()
  ])

  const activeSessions = await SessionService.getSessionsWithUser()

  // Get most recent orders
  const recentOrders = orders
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5)

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
  const currentMonthRevenue = monthlyData[monthlyData.length - 1].total
  const previousMonthRevenue = monthlyData[monthlyData.length - 2].total
  const revenueChange = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100

  const subscribers = await Newsletter.find({ status: 'active' }).sort({ createdAt: -1 }).lean();
  const contacts = await Contact.find().sort({ createdAt: -1 }).lean();

  const dashboardData = {
    totalRevenue,
    ordersCount: orders.length,
    productsCount: products,
    activeUsers: activeSessions.length,
    recentOrders,
    monthlyData,
    revenueChange,
    subscribers,
    contacts,
  }

  return serializeDocument(dashboardData)
}