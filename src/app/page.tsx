"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Loader2, AlertCircle } from "lucide-react"
import { CameraView } from "@/components/camera-view"
import { MedicalDeviceCard } from "@/components/medical-device-card"
import { ThemeToggle } from "@/components/theme-toggle"

import { useDevicesServicePostApiClassify } from "../openapi/queries"
import type { ApiError, MedicalDevice } from "../openapi/requests"

export default function MedicalDeviceScanner() {
  const [error, setError] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  // React Query mutation
  const classifyMutation = useDevicesServicePostApiClassify<MedicalDevice, ApiError>({
    retry: 1,
  })

  const isProcessing = classifyMutation.isPending
  const device = classifyMutation.data ?? null

  const handleImageCapture = useCallback(
    async (imageBlob: Blob) => {
      setError(null)

      // show local preview immediately
      const imageUrl = URL.createObjectURL(imageBlob)
      setCapturedImage(imageUrl)

      // build multipart form data
      const formData = new FormData()
      formData.append("image", imageBlob, "capture.jpg")

      try {
        // await the POST
        await classifyMutation.mutateAsync({
          requestBody: formData as unknown as { [k: string]: unknown },
        })
      } catch (err) {
        const maybe = err as ApiError | { message?: string }
        setError(
          (maybe as ApiError)?.message ??
            maybe?.message ??
            "Failed to classify image"
        )
      }
    },
    [classifyMutation]
  )

  const handleReset = useCallback(() => {
    setError(null)
    setCapturedImage(null)
    classifyMutation.reset()
  }, [classifyMutation])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Pacer ID</h1>
          <p className="text-muted-foreground">Identify device from X-ray images</p>
        </div>

        {/* Camera Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Camera
            </CardTitle>
            <CardDescription>Position your X-ray image in the camera view and tap capture</CardDescription>
          </CardHeader>
          <CardContent>
            <CameraView onImageCapture={handleImageCapture} disabled={isProcessing} />
          </CardContent>
        </Card>

        {/* Processing State */}
        {isProcessing && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analyzing image...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {(error || classifyMutation.error) && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error ??
                classifyMutation.error?.message ??
                  "An unexpected error occurred"}
            </AlertDescription>
          </Alert>
        )}

        {/* Results Section */}
        {device && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Identification Result</h2>
              <Button variant="outline" onClick={handleReset}>
                Scan Another
              </Button>
            </div>

            <MedicalDeviceCard device={device} capturedImage={capturedImage} />
          </div>
        )}

        {/* Instructions */}
        {!device && !isProcessing && !error && (
          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
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
                <span>Position your X-ray image clearly in the camera view</span>
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
    </div>
  )
}
