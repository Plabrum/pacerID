export type MedicalDeviceResult = {
  name: string
  manufacturer: string
  type: string
  leads?: number
  image: string
  link: string
  description?: string // Made optional since it's nullable
  confidence: number // Confidence percentage (0-100)
}

export type ClassificationResponse = {
  results: MedicalDeviceResult[]
  capturedImage?: string
}
