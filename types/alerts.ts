export type AlertType = "FLOOD" | "DROUGHT" | "CROP" | "TRANSHUMANCE" | "CONFLICT" | "IDPs"

export interface AlertEntry {
  id: number
  alerts: AlertType[]
  date: string
  county: string
  payam: string
  timeline: string
  sources: string
}

