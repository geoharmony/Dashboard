import L from "leaflet"
import { useMapContext } from "@/context/map-context"
import { useEffect, useRef } from "react"
import IDP from "@/data/cccm_combined.json"

export function IDPLayer() {
  const { mapInstance, layers } = useMapContext()
  const idpLayerRef = useRef<L.GeoJSON | null>(null)
  const isVisible = layers.filter(layer => layer.id === "idp").length > 0

  useEffect(() => {
    if (!mapInstance) return

    // Clean up function
    return () => {
      if (idpLayerRef.current) {
        mapInstance.removeLayer(idpLayerRef.current)
        idpLayerRef.current = null
      }
    }
  }, [mapInstance])

  useEffect(() => {
    if (!mapInstance) return

    // Remove existing layer if it exists
    if (idpLayerRef.current) {
      mapInstance.removeLayer(idpLayerRef.current)
    }

    // Create IDP layer
    idpLayerRef.current = L.geoJSON(IDP, {
      style: () => ({
        color: "#00FF00", // Green
        weight: 2,
        opacity: 0.7,
        fillOpacity: 0.1,
        fillColor: "#00FF00",
      }),
      onEachFeature: (feature, layer) => {
        if (feature.properties) {
          const popupContent = `
            <div class="p-2">
              <div class="font-medium">${feature.properties.site_name || "Unknown"}</div>
              ${feature.properties.site_type ? `<div class="text-xs">${feature.properties.site_type}</div>` : ""}
              ${feature.properties.site_status ? `<div class="text-xs">${feature.properties.site_status}</div>` : ""}
              <div class="text-xs">IDP</div>
            </div>
          `
          layer.bindPopup(popupContent)
        }
      },
    }).addTo(mapInstance)
  }, [mapInstance, isVisible])

  // Non-visual component (just manages the IDP layer on leaflet map)
  return null
}