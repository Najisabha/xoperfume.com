"use client"

import { ContactsTable } from "@/components/admin/contacts/contacts-table"

export default function ContactsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Contact Messages</h1>
      <div className="rounded-md border">
        <ContactsTable />
      </div>
    </div>
  )
}