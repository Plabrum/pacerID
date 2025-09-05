'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Camera, AlertCircle, RotateCcw, Play } from 'lucide-react'

interface CameraViewProps {
  onImageCaptureAction: (imageBlob: Blob) => void
  disabled?: boolean
  capturedImage?: string | null
  onClear?: () => void
  autoStart?: boolean
}

export function CameraView({
  onImageCaptureAction,
  disabled = false,
  capturedImage,
  onClear,
  autoStart = true
}: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [cameraStarted, setCameraStarted] = useState(false)

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      setIsLoading(true)
      setCameraStarted(true)

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        streamRef.current = mediaStream
        setStream(mediaStream)
      }
    } catch (err) {
      console.error('Camera access error:', err)
      setError('Unable to access camera. Please check permissions and try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
      setStream(null)
    }
  }, [])

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || disabled) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setTimeout(() => captureImage(), 100)
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(
      blob => {
        if (blob) {
          stopCamera()
          onImageCaptureAction(blob)
        }
      },
      'image/jpeg',
      0.8
    )
  }, [onImageCaptureAction, disabled, stopCamera])

  useEffect(() => {
    if (autoStart) {
      startCamera()
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [autoStart, startCamera])

  useEffect(() => {
    if (!capturedImage && !stream && !error && (autoStart || cameraStarted)) {
      startCamera()
    }
  }, [capturedImage, stream, error, startCamera, autoStart, cameraStarted])

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button
          onClick={startCamera}
          variant="outline"
          className="w-full bg-transparent"
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (!autoStart && !cameraStarted && !capturedImage) {
    return (
      <div className="space-y-4">
        <div className="bg-muted relative flex h-32 items-center justify-center overflow-hidden rounded-lg">
          <div className="text-center">
            <Camera className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
            <p className="text-muted-foreground mb-3 text-xs">Use camera to scan X-ray image</p>
            <Button
              onClick={startCamera}
              size="sm"
              disabled={isLoading}
            >
              <Play className="mr-2 h-4 w-4" />
              {isLoading ? 'Starting...' : 'Start Camera'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-black">
        {isLoading && !capturedImage && (
          <div className="bg-muted absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Camera className="text-muted-foreground mx-auto mb-2 h-12 w-12" />
              <p className="text-muted-foreground text-sm">Starting camera...</p>
            </div>
          </div>
        )}

        {capturedImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={capturedImage || '/placeholder.svg'}
            alt="Captured X-ray"
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
            onLoadedMetadata={() => {
              setIsLoading(false)
            }}
          />
        )}

        {!capturedImage && (
          <div className="pointer-events-none absolute inset-4 rounded-lg border-2 border-white/50"></div>
        )}
      </div>

      {capturedImage ? (
        <Button
          onClick={onClear}
          size="lg"
          className="w-full bg-transparent"
          variant="outline"
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Clear & Retake
        </Button>
      ) : (
        <Button
          onClick={captureImage}
          disabled={disabled || isLoading || !stream}
          size="lg"
          className="w-full"
        >
          <Camera className="mr-2 h-5 w-5" />
          {disabled ? 'Processing...' : 'Capture Image'}
        </Button>
      )}

      <canvas
        ref={canvasRef}
        className="hidden"
      />
    </div>
  )
}
