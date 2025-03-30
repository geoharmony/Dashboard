import { type Geometry } from "geojson"

export interface Location {
  name: string
  geometry: Geometry
  // lat: number
  // lon: number
  admin1?: string
  admin2?: string
  admin3?: string
}

export interface Event {
  date: string
  narrative_id: string
  location: Location
  event: string
  context?: string
  narrative_summary?: string
  sources_referenced?: string[]
}

