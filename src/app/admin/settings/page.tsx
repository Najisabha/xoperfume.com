"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
    const { toast } = useToast()

    const [loading, setLoading] = useState(true)
    const [headerAd, setHeaderAd] = useState({ en: "", ar: "", he: "" })

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/settings?key=header_ad")
                const data = await res.json()
                if (data && data.value) {
                    setHeaderAd(data.value)
                }
            } catch (error) {
                console.error("Failed to fetch settings", error)
            } finally {
                setLoading(false)
            }
        }
        fetchSettings()
    }, [])

    const handleSave = async () => {
        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: "header_ad",
                    value: headerAd
                })
            })
            if (res.ok) {
                toast({
                    title: "Settings saved",
                    description: "Header ad texts have been updated successfully.",
                })
            } else {
                throw new Error("Failed to save settings")
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save settings.",
                variant: "destructive"
            })
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Header Moving Ad Text</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>English Text</Label>
                        <Input
                            value={headerAd.en}
                            onChange={(e) => setHeaderAd({ ...headerAd, en: e.target.value })}
                            placeholder="e.g. A gift today, an heirloom tomorrow"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Arabic Text</Label>
                        <Input
                            value={headerAd.ar}
                            onChange={(e) => setHeaderAd({ ...headerAd, ar: e.target.value })}
                            placeholder="e.g. هدية اليوم، إرث الغد"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Hebrew Text</Label>
                        <Input
                            value={headerAd.he}
                            onChange={(e) => setHeaderAd({ ...headerAd, he: e.target.value })}
                            placeholder="e.g. מתנה היום, ירושה מחר"
                        />
                    </div>
                    <Button onClick={handleSave} className="mt-4">Save Header Ad Text</Button>
                </CardContent>
            </Card>
        </div>
    )
}
