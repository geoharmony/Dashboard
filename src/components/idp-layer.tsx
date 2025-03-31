import L from "leaflet"
import { useMapContext } from "@/context/map-context"
import { useEffect, useRef } from "react"
import IDP from "@/data/cccm_combined.json"
import IDPCamp from "@/assets/IDP-refugee-camp.svg"

const IDPCampIcon = L.icon({
  iconUrl: IDPCamp,
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
})

function lerp(value: number, min: number, max: number, minRadius: number, maxRadius: number) {
  const scaledValue = (value - min) / (max - min)
  return minRadius + scaledValue * (maxRadius - minRadius)
}

function scaleRadius(value: number) {
  const minRadius = 5   // Minimum circle radius in pixels
  const maxRadius = 50  // Maximum circle radius in pixels

  const smallest = 103
  const largest = 309527

  return lerp(value, smallest, largest, minRadius, maxRadius)
}

export function IDPLayer({ isVisible }: { isVisible: boolean }) {
  const { mapInstance } = useMapContext()
  const idpLayerRef = useRef<L.GeoJSON | null>(null)

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

    if (!isVisible) return

    // Create IDP layer
    idpLayerRef.current = L.geoJSON(IDP, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, {
          radius: scaleRadius(parseInt(feature.properties.displaced_persons || feature.properties.displaced || "0", 10)),
          color: "#357981",
          weight: 2,
          opacity: 0.7,
          fillOpacity: 0.35,
          fillColor: "#357981",
        })
      },
      // style: () => ({
      //   color: "#357981", // Green
      //   weight: 2,
      //   opacity: 0.7,
      //   fillOpacity: 0.35,
      //   fillColor: "#357981",
      // }),
      onEachFeature: (feature, layer) => {
        if (feature.properties) {
          const popupContent = `
            <div class="p-2">
              <div class="font-medium">${feature.properties.site_name || (feature.properties.source === "IOM" ? "IOM Camp" : "Unknown")}</div>
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