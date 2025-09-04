"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink} from "lucide-react"
import Image from "next/image"
import { MedicalDeviceResult } from "@/src/openapi/requests"

interface MedicalDeviceCardProps {
  results: MedicalDeviceResult[]
}

export function MedicalDeviceCard({ results }: MedicalDeviceCardProps) {
  const [expandedIndex, setExpandedIndex] = useState<number>(0)

  const toggleExpanded = (index: number) => {
    if (expandedIndex !== index) {
      setExpandedIndex(index)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Classification Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {results.map((device, index) => (
          <div key={index} className={`space-y-3 ${index > 0 ? "pt-4 border-t" : ""}`}>
            <div
              className="flex items-center justify-between cursor-pointer hover:bg-muted/50 rounded-lg p-3 -m-1 transition-colors"
              onClick={() => toggleExpanded(index)}
            >
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm">
                  {device.manufacturer && device.name ? `${device.manufacturer} ${device.name}` : device.name}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={index === 0 ? "default" : "secondary"} className="font-medium">
                  Confidence: {(device.confidence * 100).toFixed(2)}%
                </Badge>
              </div>
            </div>

            {expandedIndex === index && (
              <div className="space-y-4 pt-6">
                <div className="flex gap-4">
                  {device.image && (
                    <div className="relative aspect-square bg-muted rounded-lg overflow-hidden flex-shrink-0 w-20">
                      <Image src={device.image || "/placeholder.svg"} alt={device.name} fill className="object-cover" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="grid grid-cols-2 gap-3 h-full">
                      {device.manufacturer && <DeviceInfoBox label="Manufacturer" value={device.manufacturer} />}
                      <DeviceInfoBox label="Model" value={device.name} />
                      {device.type && <DeviceInfoBox label="Type" value={device.type} />}
                      {device.leads && <DeviceInfoBox label="Leads" value={device.leads} />}
                      {device.link && (
                        <a
                          href={device.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-muted/50 hover:bg-muted/80 transition-colors rounded-lg p-3 text-center flex flex-col justify-center cursor-pointer border border-transparent hover:border-muted-foreground/20"
                        >
                          <div className="text-xs text-muted-foreground font-medium">Learn More</div>
                          <div className="font-semibold text-sm flex items-center justify-center gap-1 mt-1">
                            <ExternalLink className="h-3 w-3" />
                            Visit
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {device.description && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="font-medium text-sm mb-1">Description</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{device.description}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )



  
interface DeviceInfoBoxProps {
  label: string
  value: string
  className?: string
}

 function DeviceInfoBox({ label, value, className = "" }: DeviceInfoBoxProps) {
  return (
    <div className={`bg-muted/50 rounded-lg p-3 text-center flex flex-col justify-center ${className}`}>
      <div className="text-xs text-muted-foreground font-medium">{label}</div>
      <div className="font-semibold text-sm truncate mt-1">{value}</div>
    </div>
  )
}

}
