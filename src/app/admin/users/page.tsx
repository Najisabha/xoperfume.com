import { UsersTable } from "@/components/admin/users/users-table"

export default function UsersPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
      </div>
      <div className="border rounded-lg p-2">
        <UsersTable />
      </div>
    </div>
  )
}
