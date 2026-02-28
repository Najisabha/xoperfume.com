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
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Plus } from "lucide-react"
import { Color } from "@/types"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { DeleteAlert } from "../products/delete-alert"

export function ColorsClient() {
    const [colors, setColors] = useState<Color[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [currentColor, setCurrentColor] = useState<Partial<Color> | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        fetchColors()
    }, [])

    const fetchColors = async () => {
        try {
            const response = await fetch('/api/colors')
            if (response.ok) {
                const data = await response.json()
                setColors(data)
            }
        } catch (error) {
            console.error('Error fetching colors:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentColor?.name || !currentColor?.hex) return

        const method = currentColor._id ? 'PUT' : 'POST'
        const url = currentColor._id ? `/api/colors/${currentColor._id}` : '/api/colors'

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentColor),
            })

            if (response.ok) {
                toast({
                    title: `Color ${currentColor._id ? 'updated' : 'created'} successfully`,
                })
                fetchColors()
                setIsDialogOpen(false)
                setCurrentColor(null)
            } else {
                const error = await response.json()
                toast({
                    title: "Error",
                    description: error.error || "Something went wrong",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error('Error saving color:', error)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/colors/${id}`, {
                method: 'DELETE',
            })
            if (response.ok) {
                toast({
                    title: "Color deleted successfully",
                })
                setColors(colors.filter(c => c._id !== id))
            }
        } catch (error) {
            console.error('Error deleting color:', error)
        }
        setDeleteId(null)
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Colors</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setCurrentColor({ name: '', hex: '#000000' })}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Color
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{currentColor?._id ? 'Edit Color' : 'Add New Color'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Color Name</Label>
                                <Input
                                    id="name"
                                    value={currentColor?.name || ''}
                                    onChange={(e) => setCurrentColor({ ...currentColor, name: e.target.value })}
                                    placeholder="e.g. Ruby Red"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hex">Hex Code</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="hex"
                                        type="color"
                                        className="w-12 h-10 p-1"
                                        value={currentColor?.hex || '#000000'}
                                        onChange={(e) => setCurrentColor({ ...currentColor, hex: e.target.value })}
                                        required
                                    />
                                    <Input
                                        value={currentColor?.hex || ''}
                                        onChange={(e) => setCurrentColor({ ...currentColor, hex: e.target.value })}
                                        placeholder="#FFFFFF"
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Preview</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Hex Code</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {colors.map((color) => (
                            <TableRow key={color._id}>
                                <TableCell>
                                    <div
                                        className="w-8 h-8 rounded-full border"
                                        style={{ backgroundColor: color.hex }}
                                    />
                                </TableCell>
                                <TableCell>{color.name}</TableCell>
                                <TableCell><code>{color.hex}</code></TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setCurrentColor(color)
                                                setIsDialogOpen(true)
                                            }}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setDeleteId(color._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <DeleteAlert
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={() => deleteId && handleDelete(deleteId)}
            />
        </div>
    )
}
