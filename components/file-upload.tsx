"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface FileUploadProps {
  onFileUploadAction: (imageBlob: Blob) => void
  disabled?: boolean
}

export function FileUpload({ onFileUploadAction, disabled = false }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileUpload = useCallback(
    (file: File | undefined) => {
      if (!file || !file.type.startsWith("image/")) {
        return
      }

      // Convert file to blob and call onFileUpload
      const blob = new Blob([file], { type: file.type })
      onFileUploadAction(blob)
    },
    [onFileUploadAction],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = e.dataTransfer?.files
      handleFileUpload(files?.[0])
    },
    [handleFileUpload],
  )

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      handleFileUpload(files?.[0])
    },
    [handleFileUpload],
  )

  return (
    <div className="relative">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">Drag and drop an X-ray image here, or</p>
        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={disabled}>
          Browse Files
        </Button>
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />
    </div>
  )
}
