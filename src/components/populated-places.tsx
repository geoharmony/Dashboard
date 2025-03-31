import L from "leaflet"
import { useMapContext } from "@/context/map-context"
import { useEffect, useRef } from "react"
import PopulatedPlacesData from "@/data/populated_places.json"

interface PopulatedPlacesProps {
  isVisible: boolean
}

export function PopulatedPlaces({ isVisible }: PopulatedPlacesProps) {
  const { mapInstance } = useMapContext()
  const layerRef = useRef<L.GeoJSON | null>(null)

  useEffect(() => {
    if (!mapInstance) return

    if (isVisible) {
      if (!layerRef.current) {
        const layer = L.geoJSON(PopulatedPlacesData, {
          pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng, {
              radius: 2,
              color: "#333333",
              weight: 1,
              opacity: 0.15,
              fillOpacity: 0.05,
              fillColor: "#333333",
            })
          },
          // style: () => ({
          //   color: "#357981",
          //   weight: 2,
          //   opacity: 0.7,
          //   fillOpacity: 0.35,
          //   fillColor: "#357981",
          // }),
        }).addTo(mapInstance)
        layerRef.current = layer
      }
    } else {
      if (layerRef.current) {
        mapInstance.removeLayer(layerRef.current)
        layerRef.current = null
      }
    }
  }, [mapInstance, isVisible])

  return null
}
      