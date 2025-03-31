import L from "leaflet"
import { useMapContext } from "@/context/map-context"
import { useEffect, useRef } from "react"
import FloodPolygon from "@/data/flood060509.json"

export function FloodLayer({isVisible}) {
  const { mapInstance, layers } = useMapContext()
  const FloodLayerRef = useRef<L.GeoJSON | null>(null)


  useEffect(() => {
    if (!mapInstance) return

    // Clean up function
    return () => {
      if (FloodLayerRef.current) {
        mapInstance.removeLayer(FloodLayerRef.current)
        FloodLayerRef.current = null
      }
    }
  }, [mapInstance])

  useEffect(() => {
    if (!mapInstance) return

    // Remove existing layer if it exists
    if (FloodLayerRef.current) {
      mapInstance.removeLayer(FloodLayerRef.current)
    }

    // Create IDP layer
    FloodLayerRef.current = L.geoJSON(FloodPolygon, {
      style: () => ({
        color: "#00FF00", // Green
        weight: 2,
        opacity: 0.7,
        fillOpacity: 0.1,
        fillColor: "#00FF00",
      })
    }).addTo(mapInstance)
  }, [mapInstance, isVisible])

  // Non-visual component (just manages the IDP layer on leaflet map)
  return null
}
