import L from "leaflet"
import { useMapContext } from "@/context/map-context"
import { useEffect, useRef } from "react"
import Geo from "@/data/unmiss_civil_affairs_geo.json"



export function UNMISSCivilAffairs({ isVisible }: { isVisible: boolean }) {
  const { mapInstance } = useMapContext()
  const unmissCivilAffairsRef = useRef<L.GeoJSON | null>(null)

  useEffect(() => {
    if (!mapInstance) return

    // Clean up function
    return () => {
      if (unmissCivilAffairsRef.current) {
        mapInstance.removeLayer(unmissCivilAffairsRef.current)
        unmissCivilAffairsRef.current = null
      }
    }
  }, [mapInstance])

  useEffect(() => {
    if (!mapInstance) return

    // Remove existing layer if it exists
    if (unmissCivilAffairsRef.current) {
      mapInstance.removeLayer(unmissCivilAffairsRef.current)
    }

    if (!isVisible) return

    // Create IDP layer
    unmissCivilAffairsRef.current = L.geoJSON(Geo, {
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
