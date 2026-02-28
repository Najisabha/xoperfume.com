import { cn } from "@/lib/utils"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  container?: boolean // Add option to wrap in centered container
}

const sizeClasses = {
  sm: "size-6 border-2",
  md: "size-8 border-2",
  lg: "size-12 border-3",
}

export function Spinner({ 
  size = "md", 
  className, 
  container = true, // Default to true for centered container
  ...props 
}: SpinnerProps) {
  const spinner = (
    <div
      className={cn(
        "animate-spin rounded-full",
        "border border-t-transparent",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )

  if (container) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        {spinner}
      </div>
    )
  }

  return spinner
}