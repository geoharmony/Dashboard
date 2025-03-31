import L from "leaflet"
import { useMapContext } from "@/context/map-context"
import { useEffect, useRef } from "react"
import Road from "@/data/road.json"

export function RoadLayer({isVisible}: { isVisible: boolean }) {
  const { mapInstance} = useMapContext()
  const RoadLayerRef = useRef<L.GeoJSON | null>(null)


  useEffect(() => {
    if (!mapInstance) return

    // Clean up function
    return () => {
      if (RoadLayerRef.current) {
        mapInstance.removeLayer(RoadLayerRef.current)
        RoadLayerRef.current = null
      }
    }
  }, [mapInstance])

  useEffect(() => {
    if (!mapInstance) return

    // Remove existing layer if it exists
    if (RoadLayerRef.current) {
      mapInstance.removeLayer(RoadLayerRef.current)
    }

    if (!isVisible) return

    // Create IDP layer
    RoadLayerRef.current = L.geoJSON(Road, {
      style: () => ({
        color: "#000000", // Green
        weight: 2,
        opacity: 0.7,
        fillOpacity: 0.4,
        fillColor: "#000000",
      })
    }).addTo(mapInstance)
  }, [mapInstance, isVisible])

  // Non-visual component (just manages the IDP layer on leaflet map)
  return null
}
