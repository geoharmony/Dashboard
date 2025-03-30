// # Alert Types
import { Geometry } from "geojson"
import L from "leaflet"

export interface AlertLocation {
  name: string
  geometry: Geometry
  admin1?: string
  admin2?: string
  admin3?: string
}

export interface Alert {
  narrative_id: string
  date: Date
  event: string
  context?: string
  narrative_summary?: string
  sources_referenced?: string[]
  leafletLayer?: L.Layer
  bounds?: L.LatLngBounds
  location: AlertLocation
}
