"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Github, Mail } from "lucide-react"
import { CameraView } from "@/components/camera-view"
import { MedicalDeviceCard } from "@/components/medical-device-card"
import { ThemeToggle } from "@/components/theme-toggle"

import { useDevicesServicePostApiClassify } from "../openapi/queries"
import { FileUpload } from "@/components/file-upload"

export default function MedicalDeviceScanner() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  // React Query mutation - let it handle all state
  const classifyMutation = useDevicesServicePostApiClassify({
    retry: 1,
  })

  const { isPending, error, data: results, mutateAsync, reset } = classifyMutation

  const handleImageCapture = async (imageBlob: Blob) => {
    // Show local preview immediately
    const imageUrl = URL.createObjectURL(imageBlob)
    setCapturedImage(imageUrl)

    // Build multipart form data
    const formData = new FormData()
    formData.append("image", imageBlob, "capture.jpg")

    // Let React Query handle the error state
    await mutateAsync({
      requestBody: formData as unknown as { [k: string]: unknown },
    })
  }

  const handleReset = () => {
    // Clean up object URL if it exists
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage)
    }
    setCapturedImage(null)
    reset()
  }


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex justify-end mb-2">
            <ThemeToggle />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Pacer ID</h1>
          <p className="text-muted-foreground">Identify device from X-ray images</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Camera */}
          <div className="space-y-4">
            {/* Camera Section */}
            <div>
              {!capturedImage && (
                <p className="text-sm text-muted-foreground mb-3">
                  Position your X-ray image in the camera view and tap capture
                </p>
              )}
              <CameraView
                onImageCaptureAction={handleImageCapture}
                disabled={isPending}
                capturedImage={capturedImage}
                onClear={handleReset}
              />
            </div>

            {/* File Upload Section */}
            {!capturedImage && (
              <FileUpload
                onFileUploadAction={handleImageCapture}
                disabled={isPending}
              />
            )}

            {/* Instructions */}
            {!results && !isPending && !capturedImage && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">How to Use</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                      1
                    </span>
                    <span>Allow camera access when prompted</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                      2
                    </span>
                    <span>Position your X-ray image clearly in the camera view or upload a file</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                      3
                    </span>
                    <span>Tap the capture button to take a photo</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                      4
                    </span>
                    <span>Wait for AI analysis to identify medical devices</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Results and Status */}
          <div className="space-y-4">
            {/* Processing State */}
            {isPending && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center gap-3 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Analyzing image...</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error State */}
            {!!error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error instanceof Error ? error.message : 'Failed to classify image'}
                </AlertDescription>
              </Alert>
            )}

            {/* Results Section */}
            {results && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Identification Result</h2>
                  <Button variant="outline" onClick={handleReset}>
                    Scan Another
                  </Button>
                </div>

                <MedicalDeviceCard results={results} />
              </div>
            )}

            {/* Placeholder for desktop when no results */}
            {!results && !isPending && !error && (
              <div className="hidden lg:block">
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                      <p className="text-sm">Results will appear here after capturing an image</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Footer Card */}
        <div className="mt-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  <a
                    href="https://github.com/Plabrum/pacerID"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors underline"
                  >
                    View on GitHub
                  </a>
                </div>
                <div className="hidden sm:block text-muted-foreground/50">•</div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a
                    href="mailto:philip.labrum@gmail.com"
                    className="hover:text-foreground transition-colors underline"
                  >
                    philip.labrum@gmail.com
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
