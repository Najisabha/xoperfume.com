import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/admin/overview"
import { RecentSales } from "@/components/admin/recent-sales"
import { getDashboardData } from "@/lib/admin-utils"
import { Users, Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { Newsletter } from "@/components/admin/newsletter-list"
import { Contact } from "@/components/admin/contact-list"
import type { DashboardData } from "@/types/admin"
import { ContactsTable } from "@/components/admin/contacts/contacts-table"

async function AdminDashboard() {
  try {
    const dashboardData = await getDashboardData() as DashboardData
    const stats = [
      {
        title: "Total Revenue",
        value: formatPrice(dashboardData?.totalRevenue),
        description: `${dashboardData?.revenueChange > 0 ? '+' : ''}${dashboardData?.revenueChange?.toFixed(1)}% from last month`,
        icon: <DollarSign className="w-5 h-5" />,
        trend: dashboardData?.revenueChange > 0 ? "up" : "down"
      },
      {
        title: "Orders",
        value: dashboardData?.ordersCount,
        description: "Total orders processed",
        icon: <ShoppingCart className="w-4 h-4 text-muted-foreground" />
      },
      {
        title: "Products",
        value: dashboardData?.productsCount,
        description: "Active products",
        icon: <Package className="w-4 h-4 text-muted-foreground" />
      },
      {
        title: "Active Users",
        value: dashboardData?.activeUsers,
        description: "Registered users",
        icon: <Users className="w-4 h-4 text-muted-foreground" />
      }
    ]

    return (
      <div className="h-full flex-1 space-y-8 p-8 pt-6">
        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
              <p className="text-muted-foreground">
                Here&apos;s what&apos;s happening with your store today
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <Card key={stat.title} className="transition-all hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <div className={`rounded-full p-2 ${
                        stat.trend === "up" ? "bg-green-100" : "bg-red-100"
                      }`}>
                        {stat.icon}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-7">
                <Card className="md:col-span-3">
                  <CardHeader>
                    <CardTitle>Latest Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RecentSales orders={dashboardData?.recentOrders} />
                  </CardContent>
                </Card>

                <Card className="md:col-span-4">
                  <CardHeader>
                    <CardTitle>Revenue Trends</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <Overview data={dashboardData?.monthlyData} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>


            <TabsContent value="newsletter">
              <Card>
                <CardHeader>
                  <CardTitle>Newsletter Subscribers</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Manage your newsletter subscription list
                  </p>
                </CardHeader>
                <CardContent>
                  <Newsletter subscribers={dashboardData?.subscribers} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-red-500">Error loading dashboard data</p>
      </div>
    )
  }
}

export default AdminDashboard