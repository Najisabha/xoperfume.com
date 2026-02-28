'use client';

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'

interface ImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  onUploadStart?: () => void
  onUploadComplete?: (success?: boolean) => void
  className?: string
}

export function ImageUpload({
  value = [],
  onChange,
  onUploadStart,
  onUploadComplete,
  className
}: ImageUploadProps) {
  const { toast } = useToast()
  const [uploads, setUploads] = useState<Array<{
    file: File;
    preview: string;
    progress: number;
    status: 'pending' | 'uploading' | 'complete' | 'error';
    url?: string;
    isUploading?: boolean; // Add this to track upload state per file
  }>>([])

  // Add uploading state tracker
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newUploads = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'pending' as const
    }))
    setUploads(prev => [...prev, ...newUploads])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    }
  })

  const uploadImage = async (upload: typeof uploads[0]) => {
    // Prevent double uploads
    if (upload.isUploading || isUploading) return

    onUploadStart?.()
    setIsUploading(true)

    // Mark this specific upload as in progress
    setUploads(prev => prev.map(u => 
      u.file === upload.file ? { ...u, isUploading: true, status: 'uploading' } : u
    ))

    try {
      const response = await fetch(`/api/upload?filename=${upload.file.name}`, {
        method: 'POST',
        body: upload.file
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.message || `Upload failed with status: ${response.status}`
        toast({
          title: "Upload Error",
          description: errorMessage,
          variant: "destructive",
        })
        throw new Error(errorMessage)
      }
      
      const data = await response.json()
      const imageUrl = data.url

      // Remove the uploaded item from uploads state
      setUploads(prev => prev.filter(u => u.file !== upload.file))
      
      // Append the new URL to existing value array instead of replacing
      const newUrls = Array.from(new Set([...value, imageUrl])) // Use Set to prevent duplicates
      onChange(newUrls)
      onUploadComplete?.(true)
    } catch (error: any) {
      console.error('Upload error:', error)
      toast({
        title: "Upload Failed",
        description: error.message || "An unexpected error occurred during upload",
        variant: "destructive",
      })
      setUploads(prev => 
        prev.map(u => 
          u.file === upload.file 
            ? { ...u, status: 'error', isUploading: false }
            : u
        )
      )
      onUploadComplete?.(false)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop images here, or click to select files
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supports: JPG, PNG, GIF, WebP
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {value.map((url) => (
          <div key={url} className="relative">
            <img
              src={url}
              alt="Uploaded"
              className="rounded-lg w-full aspect-square object-cover"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange(value.filter(u => u !== url))
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        {uploads.filter(upload => upload.status !== 'complete').map((upload, index) => (
          <div key={index} className="relative">
            <img
              src={upload.preview}
              alt="Preview"
              className={`rounded-lg w-full aspect-square object-cover ${upload.status === 'uploading' ? 'opacity-50' : ''
                  }`}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              {upload.status === 'pending' && (
                <Button
                  type="button"
                  size="sm"
                  className="bg-white text-black hover:bg-gray-100"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    uploadImage(upload);
                  }}
                  disabled={upload.isUploading || isUploading}
                >
                  {upload.isUploading ? 'Uploading...' : 'Upload File'}
                </Button>
              )}
              {upload.status === 'uploading' && (
                <div className="w-4/5 space-y-2">
                  <Progress value={upload.progress} className="h-2" />
                  <p className="text-white text-sm text-center">
                    Uploading... {upload.progress}%
                  </p>
                </div>
              )}
              {upload.status === 'complete' && (
                <div className="bg-green-500/80 text-white px-3 py-1 rounded-full text-sm">
                  Uploaded!
                </div>
              )}
              {upload.status === 'error' && (
                <div className="bg-red-500/80 text-white px-3 py-1 rounded-full text-sm">
                  Upload Failed
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setUploads(prev => prev.filter(u => u !== upload));
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}