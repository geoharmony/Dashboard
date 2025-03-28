export interface Location {
  name: string
  lat: number
  lon: number
  admin1: string
  admin2: string
}

export interface Event {
  date: string
  narrative_id: string // We'll keep the field name but refer to it as "timeline_id" in the UI
  location: Location
  event: string
  context?: string
  narrative_summary?: string
  sources_referenced?: string[]
}

