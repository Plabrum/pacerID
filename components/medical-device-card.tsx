"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import Image from "next/image"
import type { MedicalDeviceResult } from "@/types/api"

interface MedicalDeviceCardProps {
  results: MedicalDeviceResult[]
}

export function MedicalDeviceCard({ results }: MedicalDeviceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Classification Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {results.map((device, index) => (
          <div key={index} className={`space-y-3 ${index > 0 ? "pt-4 border-t" : ""}`}>
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">{device.name}</h4>
              <Badge variant={index === 0 ? "default" : "secondary"} className="ml-2">
                {device.confidence}%
              </Badge>
            </div>

            {/* Only show detailed info for top result */}
            {index === 0 && (
              <div className="space-y-3">
                <div className="flex gap-4">
                  {device.image && (
                    <div className="relative aspect-square bg-muted rounded-lg overflow-hidden flex-shrink-0 w-20">
                      <Image src={device.image || "/placeholder.svg"} alt={device.name} fill className="object-cover" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="grid grid-cols-2 gap-2 h-full">
                      {device.manufacturer && (
                        <div className="bg-muted/50 rounded-lg p-2 text-center flex flex-col justify-center">
                          <div className="text-xs text-muted-foreground">Manufacturer</div>
                          <div className="font-medium text-sm truncate">{device.manufacturer}</div>
                        </div>
                      )}
                      {device.type && (
                        <div className="bg-muted/50 rounded-lg p-2 text-center flex flex-col justify-center">
                          <div className="text-xs text-muted-foreground">Type</div>
                          <div className="font-medium text-sm truncate">{device.type}</div>
                        </div>
                      )}
                      {device.leads && (
                        <div className="bg-muted/50 rounded-lg p-2 text-center flex flex-col justify-center">
                          <div className="text-xs text-muted-foreground">Leads</div>
                          <div className="font-medium text-sm truncate">{device.leads}</div>
                        </div>
                      )}
                      {device.link && (
                        <a
                          href={device.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-muted/50 hover:bg-muted/70 transition-colors rounded-lg p-2 text-center flex flex-col justify-center cursor-pointer"
                        >
                          <div className="text-xs text-muted-foreground">Learn More</div>
                          <div className="font-medium text-sm flex items-center justify-center gap-1">
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
}

