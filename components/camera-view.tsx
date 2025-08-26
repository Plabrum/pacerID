"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, AlertCircle, RotateCcw } from "lucide-react"

interface CameraViewProps {
  onImageCaptureAction: (imageBlob: Blob) => void
  disabled?: boolean
  capturedImage?: string | null
  onClear?: () => void
}

export function CameraView({  onImageCaptureAction, disabled = false, capturedImage, onClear }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      setIsLoading(true)

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {facingMode:'environment'},
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        streamRef.current = mediaStream
        setStream(mediaStream)
      }
    } catch (err) {
      console.error("Camera access error:", err)
      setError("Unable to access camera. Please check permissions and try again.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      setStream(null)
    }
  }, [])

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || disabled) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    // Ensure video has loaded and has dimensions
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setTimeout(() => captureImage(), 100)
      return
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          stopCamera()
          onImageCaptureAction(blob)
        }
      },
      "image/jpeg",
      0.8,
    )
  }, [onImageCaptureAction, disabled, stopCamera])

  useEffect(() => {
    startCamera()
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [startCamera])

  useEffect(() => {
    if (!capturedImage && !stream && !error) {
      startCamera()
    }
  }, [capturedImage, stream, error, startCamera])

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={startCamera} variant="outline" className="w-full bg-transparent">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden aspect-[4/3]">
        {isLoading && !capturedImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="text-center">
              <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Starting camera...</p>
            </div>
          </div>
        )}

        {capturedImage ? (
        /* eslint-disable-next-line @next/next/no-img-element */
          <img src={capturedImage || "/placeholder.svg"} alt="Captured X-ray" className="w-full h-full object-cover" />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            onLoadedMetadata={() => {
              setIsLoading(false)
            }}
          />
        )}

        {!capturedImage && (
          <div className="absolute inset-4 border-2 border-white/50 rounded-lg pointer-events-none"></div>
        )}
      </div>

      {capturedImage ? (
        <Button onClick={onClear} size="lg" className="w-full bg-transparent" variant="outline">
          <RotateCcw className="h-5 w-5 mr-2" />
          Clear & Retake
        </Button>
      ) : (
        <Button onClick={captureImage} disabled={disabled || isLoading || !stream} size="lg" className="w-full">
          <Camera className="h-5 w-5 mr-2" />
          {disabled ? "Processing..." : "Capture Image"}
        </Button>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
