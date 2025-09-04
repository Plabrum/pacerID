'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { MedicalDeviceResult } from '@/src/openapi/requests'

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
          <div
            key={index}
            className={`space-y-3 ${index > 0 ? 'border-t pt-4' : ''}`}
          >
            <div
              className="hover:bg-muted/50 -m-1 flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors"
              onClick={() => toggleExpanded(index)}
            >
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium">
                  {device.manufacturer && device.name ? `${device.manufacturer} ${device.name}` : device.name}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={index === 0 ? 'default' : 'secondary'}
                  className="font-medium"
                >
                  Confidence: {(device.confidence * 100).toFixed(2)}%
                </Badge>
              </div>
            </div>

            {expandedIndex === index && (
              <div className="space-y-4 pt-6">
                <div className="flex gap-4">
                  {device.image && (
                    <div className="bg-muted relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={device.image || '/placeholder.svg'}
                        alt={device.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="grid h-full grid-cols-2 gap-3">
                      {device.manufacturer && (
                        <DeviceInfoBox
                          label="Manufacturer"
                          value={device.manufacturer}
                        />
                      )}
                      <DeviceInfoBox
                        label="Model"
                        value={device.name}
                      />
                      {device.type && (
                        <DeviceInfoBox
                          label="Type"
                          value={device.type}
                        />
                      )}
                      {device.leads && (
                        <DeviceInfoBox
                          label="Leads"
                          value={device.leads}
                        />
                      )}
                      {device.link && (
                        <a
                          href={device.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-muted/50 hover:bg-muted/80 hover:border-muted-foreground/20 flex cursor-pointer flex-col justify-center rounded-lg border border-transparent p-3 text-center transition-colors"
                        >
                          <div className="text-muted-foreground text-xs font-medium">Learn More</div>
                          <div className="mt-1 flex items-center justify-center gap-1 text-sm font-semibold">
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
                    <div className="mb-1 text-sm font-medium">Description</div>
                    <p className="text-muted-foreground text-xs leading-relaxed">{device.description}</p>
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
    value: string | number
    className?: string
  }

  function DeviceInfoBox({ label, value, className = '' }: DeviceInfoBoxProps) {
    return (
      <div className={`bg-muted/50 flex flex-col justify-center rounded-lg p-3 text-center ${className}`}>
        <div className="text-muted-foreground text-xs font-medium">{label}</div>
        <div className="mt-1 truncate text-sm font-semibold">{value}</div>
      </div>
    )
  }
}
