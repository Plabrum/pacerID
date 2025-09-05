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
  const streamRef = useRef<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [cameraStarted, setCameraStarted] = useState(false)

  // Small helpers
  const hasMediaDevices = () =>
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function'

  const isNamedError = (e: unknown): e is { name: string; message?: string } => {
    return typeof e === 'object' && e !== null && 'name' in e && typeof (e as { name: unknown }).name === 'string'
  }
  const startCamera = useCallback(async () => {
    setError(null)
    setIsLoading(true)

    try {
      setCameraStarted(true)

      if (!hasMediaDevices()) {
        setCameraStarted(false)
        setError(
          'This browser does not support camera access. Try a different browser, enable HTTPS, or use Continuity Camera with your iPhone.'
        )
        return
      }

      const videoInputs: MediaDeviceInfo[] =
        typeof navigator.mediaDevices.enumerateDevices === 'function'
          ? (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === 'videoinput')
          : []

      const firstInput = videoInputs[0]

      const constraints: MediaStreamConstraints = {
        audio: false,
        video: firstInput
          ? { deviceId: { exact: firstInput.deviceId }, facingMode: 'environment' }
          : { facingMode: { ideal: 'environment' } }
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)

      const videoEl = videoRef.current
      if (videoEl) {
        videoEl.srcObject = mediaStream
        streamRef.current = mediaStream
        setStream(mediaStream)
      } else {
        // Stop tracks if we cannot attach them
        mediaStream.getTracks().forEach(track => track.stop())
        throw new Error('Video element not ready')
      }
    } catch (err: unknown) {
      console.error('Camera access error:', err)

      if (isNamedError(err)) {
        switch (err.name) {
          case 'NotAllowedError':
          case 'SecurityError':
            setError('Permission denied. Please allow camera access in your browser settings and reload the page.')
            break
          case 'NotFoundError':
          case 'OverconstrainedError':
            setError('No usable camera was found. Connect a webcam or try using your iPhone via Continuity Camera.')
            break
          case 'NotReadableError':
            setError('The camera is in use by another application. Close other apps that use the camera and try again.')
            break
          default:
            setError('Unable to access the camera. Please check permissions, ensure HTTPS, and try again.')
        }
      } else {
        setError('Unable to access the camera due to an unexpected error.')
      }

      setCameraStarted(false)
    } finally {
      setIsLoading(false)
    }
  }, [setError, setIsLoading, setCameraStarted, setStream])

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
      <div className="flex flex-col">
        <div className="bg-muted relative flex h-32 items-center justify-center overflow-hidden rounded-lg p-6">
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
    <div className="flex flex-col space-y-4">
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

      {stream && !capturedImage && (
        <div className="flex gap-2">
          <Button
            onClick={captureImage}
            disabled={disabled || isLoading}
            size="lg"
            className="flex-1"
          >
            <Camera className="mr-2 h-5 w-5" />
            {disabled ? 'Processing...' : 'Capture Image'}
          </Button>
          <Button
            onClick={() => {
              stopCamera()
              setCameraStarted(false)
            }}
            size="lg"
            variant="destructive"
            className="flex-1"
          >
            Close Camera
          </Button>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="hidden"
      />
    </div>
  )
}
