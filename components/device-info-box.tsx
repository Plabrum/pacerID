'use client'

interface DeviceInfoBoxProps {
  label: string
  value: string
  className?: string
}

export function DeviceInfoBox({ label, value, className = '' }: DeviceInfoBoxProps) {
  return (
    <div className={`bg-muted/50 flex flex-col justify-center rounded-lg p-3 text-center ${className}`}>
      <div className="text-muted-foreground text-xs font-medium">{label}</div>
      <div className="mt-1 truncate text-sm font-semibold">{value}</div>
    </div>
  )
}
