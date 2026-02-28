"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUp, ArrowDown, Plus, X } from "lucide-react"

interface ImageUrlsManagerProps {
  urls: string[]
  onChange: (urls: string[]) => void
  error?: string
}

export function ImageUrlsManager({ urls, onChange, error }: ImageUrlsManagerProps) {
  const addNewUrl = () => {
    onChange([...urls, ""])
  }

  const removeUrl = (index: number) => {
    const newUrls = [...urls]
    newUrls.splice(index, 1)
    onChange(newUrls)
  }

  const moveUrl = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || 
        (direction === "down" && index === urls.length - 1)) return

    const newUrls = [...urls]
    const newIndex = direction === "up" ? index - 1 : index + 1
    const [movedUrl] = newUrls.splice(index, 1)
    newUrls.splice(newIndex, 0, movedUrl)
    onChange(newUrls)
  }

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls]
    newUrls[index] = value
    onChange(newUrls)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Image URLs</label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={addNewUrl}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add URL
        </Button>
      </div>

      <div className="space-y-2">
        {urls.map((url, index) => (
          <div key={index} className="flex items-center gap-2 group">
            <div className="flex flex-col">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => moveUrl(index, "up")}
                disabled={index === 0}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => moveUrl(index, "down")}
                disabled={index === urls.length - 1}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
            <Input
              value={url}
              onChange={(e) => updateUrl(index, e.target.value)}
              placeholder={`Image URL ${index + 1}`}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeUrl(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}

      {urls.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No image URLs added. Click (Add URL) to add one.
        </p>
      )}
    </div>
  )
}
