import { cn } from "@/lib/utils"

interface PlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number
  imageSize?: "sm" | "md" | "lg"
  isLoading?: boolean
}

const imageSizes = {
  sm: "h-24 w-24",
  md: "h-32 w-32",
  lg: "h-48 w-48",
}

export function Placeholder({
  lines = 3,
  imageSize = "md",
  isLoading = true,
  className,
  children,
  ...props
}: PlaceholderProps) {
  if (!isLoading) {
    return <div className={className} {...props}>{children}</div>
  }

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div className={cn("rounded-md bg-muted animate-pulse", imageSizes[imageSize])} />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-4 bg-muted animate-pulse rounded",
              i === 0 ? "w-3/4" : "w-full"
            )}
          />
        ))}
      </div>
    </div>
  )
} 