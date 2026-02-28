"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronUp, ChevronDown } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { DashboardData } from "@/types/admin"

interface NewsletterProps {
  subscribers: DashboardData['subscribers']
}

export function Newsletter({ subscribers }: NewsletterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<"email" | "createdAt">("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "unsubscribed">("all")

  const handleSort = (field: "email" | "createdAt") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredAndSortedSubscribers = useMemo(() => {
    return subscribers
      .filter(sub => {
        const matchesSearch = sub.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === "all" || sub.status === statusFilter
        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        if (sortField === "email") {
          return sortDirection === "asc" 
            ? a.email.localeCompare(b.email)
            : b.email.localeCompare(a.email)
        }
        
        // Sort by date
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA
      })
  }, [subscribers, searchQuery, sortField, sortDirection, statusFilter])

  if (!subscribers) return <div>No subscribers found</div>

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subscribers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <select
          className="w-[180px] rounded-md border p-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="all">All Subscribers</option>
          <option value="active">Active</option>
          <option value="unsubscribed">Unsubscribed</option>
        </select>
      </div>

      <div className="text-sm text-muted-foreground">
        Total Subscribers: {filteredAndSortedSubscribers.length}
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("email")}
                  className="flex items-center space-x-1"
                >
                  Email
                  {sortField === "email" && (
                    sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("createdAt")}
                  className="flex items-center space-x-1"
                >
                  Subscribed Date
                  {sortField === "createdAt" && (
                    sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedSubscribers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  No subscribers found
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedSubscribers.map((sub) => (
                <TableRow key={sub._id}>
                  <TableCell>{sub.email}</TableCell>
                  <TableCell>{formatDate(sub.createdAt)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      sub.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {sub.status.toUpperCase()}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}