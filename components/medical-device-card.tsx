"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, ImageIcon } from "lucide-react"
import Image from "next/image"
import { MedicalDevice } from "@/src/openapi/requests"



interface MedicalDeviceCardProps {
  device: MedicalDevice
  capturedImage?: string | null
}

export function MedicalDeviceCard({ device, capturedImage }: MedicalDeviceCardProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Captured Image */}
      {capturedImage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Captured Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              <Image src={capturedImage || "/placeholder.svg"} alt="Captured X-ray" fill className="object-cover" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Device Information */}
      <Card>
        <CardHeader>
          <CardTitle>{device.name}</CardTitle>
          <CardDescription>Identified Medical Device</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Device Image */}
          {device.image && (
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
<Image
  src={device.image || "/placeholder.svg"}
  alt={device.name}
  fill
  className="object-cover rounded-xl"
/>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{device.description}</p>
          </div>

          {/* Learn More Link */}
          {device.link && (
            <Button asChild variant="outline" className="w-full bg-transparent">
              <a href={device.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Learn More
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
