"use client"

import { useState, useRef } from "react"
import { ImageUpload } from "@/components/admin/image-upload"
import { BlobsTable, BlobsTableRef } from "@/components/admin/blobs/blobs-table"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function BlobsPage() {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const tableRef = useRef<BlobsTableRef>(null)
  const router = useRouter()

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">File Management</h1>
      
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Upload New Files</h2>
        <ImageUpload 
          value={uploadedFiles}
          onChange={setUploadedFiles}
          onUploadComplete={(success?: boolean) => {
            if (success) {
              toast({
                title: "Success",
                description: "Files have been uploaded successfully",
              })
              setUploadedFiles([]) // Reset uploaded files
              tableRef.current?.refresh() // Refresh table after state reset
            } else {
              toast({
                title: "Error",
                description: "Failed to upload one or more files",
                variant: "destructive",
              })
            }
          }}
        />
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
        <BlobsTable ref={tableRef} />
      </div>
    </div>
  )
}