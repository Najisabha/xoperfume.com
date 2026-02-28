
"use client"

import { useState, useEffect } from "react"
import { Newsletter } from "@/components/admin/newsletter-list"

type Subscriber = {
  _id: string
  email: string
  status: 'active' | 'unsubscribed'
  createdAt: string
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/newsletter')
      if (response.ok) {
        const data = await response.json()
        setSubscribers(data)
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>
      <Newsletter subscribers={subscribers} />
    </div>
  )
}