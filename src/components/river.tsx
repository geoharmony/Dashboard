import L from "leaflet"
import { useMapContext } from "@/context/map-context"
import { useEffect, useRef } from "react"
import River from "@/data/river.json"

export function RiverLayer({isVisible}: { isVisible: boolean }) {
  const { mapInstance} = useMapContext()
  const RiverLayerRef = useRef<L.GeoJSON | null>(null)


  useEffect(() => {
    if (!mapInstance) return

    // Clean up function
    return () => {
      if (RiverLayerRef.current) {
        mapInstance.removeLayer(RiverLayerRef.current)
        RiverLayerRef.current = null
      }
    }
  }, [mapInstance])

  useEffect(() => {
    if (!mapInstance) return

    // Remove existing layer if it exists
    if (RiverLayerRef.current) {
      mapInstance.removeLayer(RiverLayerRef.current)
    }

    if (!isVisible) return

    // Create IDP layer
    RiverLayerRef.current = L.geoJSON(River, {
      style: () => ({
        color: "#0000FF", // Green
        weight: 2,
        opacity: 0.7,
        fillOpacity: 0.4,
        fillColor: "#0000FF",
      })
    }).addTo(mapInstance)
  }, [mapInstance, isVisible])

  // Non-visual component (just manages the IDP layer on leaflet map)
  return null
}
