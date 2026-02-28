
import { SessionsTable } from "@/components/admin/sessions/sessions-table"

export default function AdminSessionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Sessions</h1>
      <div className="rounded-md border">
        <SessionsTable />
      </div>
    </div>
  )
}