import { FilterProvider } from "@/contexts/filter-context"

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <FilterProvider>{children}</FilterProvider>
}
