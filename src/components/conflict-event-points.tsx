import L from "leaflet"
import { useMapContext } from "@/context/map-context"
import { useEffect, useRef } from "react"
import Events from "@/data/events.json"



export function ConflictEventPoints({ isVisible }: { isVisible: boolean }) {
  const { mapInstance } = useMapContext()
  const confilicPointRef = useRef<L.GeoJSON | null>(null)

  useEffect(() => {
    if (!mapInstance) return

    // Clean up function
    return () => {
      if (conflictPointRef.current) {
        mapInstance.removeLayer(confilicPointRef.current)
        confilicPointRef.current = null
      }
    }
  }, [mapInstance])

  useEffect(() => {
    if (!mapInstance) return

    // Remove existing layer if it exists
    if (confilicPointRef.current) {
      mapInstance.removeLayer(confilicPointRef.current)
    }

    if (!isVisible) return

    // Create IDP layer
    confilicPointRef.current = L.geoJSON(Events, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, {
          radius: 10,
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
              <div class="font-medium">${feature.properties.notes}</div>
              <div class="text-xs">ConflictPoints</div>
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
