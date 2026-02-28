
"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/lib/date"
import { Badge } from "@/components/ui/badge"
import { ISession } from "@/types"


export function SessionsTable() {
  const [sessions, setSessions] = useState<ISession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions')
      if (response.ok) {
        const data = await response.json()
        setSessions(data)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Device</TableHead>
          <TableHead>IP Address</TableHead>
          <TableHead>Last Accessed</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((session) => (
          <TableRow key={session._id}>
            <TableCell>
              <div>
                <div className="font-medium">{session.userName}</div>
                <div className="text-sm text-muted-foreground">{session.userEmail}</div>
              </div>
            </TableCell>
            <TableCell>{session.deviceName}</TableCell>
            <TableCell>{session.ipAddress}</TableCell>
            <TableCell>{formatDate(session?.lastAccessed as any)}</TableCell>
            <TableCell>{formatDate(session?.createdAt as any)}</TableCell>
            <TableCell>
              <Badge variant={session.isActive ? "success" : "destructive"}>
                {session.isActive ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}