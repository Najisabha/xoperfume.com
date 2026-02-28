import { cn } from "@/lib/utils"

interface OrderStatusProps {
  status: string
  className?: string
  dict?: any
}

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
} as const

type StatusType = keyof typeof statusStyles

export function OrderStatus({ status, className, dict }: OrderStatusProps) {
  const statusKey = status.toLowerCase() as StatusType
  const baseStyles = "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"

  const statusDict = dict?.checkout?.status || {}
  const localizedStatus = statusDict[statusKey] || status

  return (
    <span className={cn(baseStyles, statusStyles[statusKey], className)}>
      {localizedStatus}
    </span>
  )
}