import L from "leaflet"
import { useMapContext } from "@/context/map-context"
import { useEffect, useRef } from "react"
import ConflictEventsData from "@/data/crisis-events.json"

export function ConflictEvents({ isVisible, selectedDate }: { isVisible: boolean; selectedDate: Date | null }) {
  const { mapInstance } = useMapContext()
  const layerRef = useRef<L.GeoJSON | null>(null)

  useEffect(() => {
    console.log("In ConflictEvents")
    if (!mapInstance) return

    if (isVisible) {
      if (!layerRef.current) {
        const layer = L.geoJSON(ConflictEventsData, {
          style: () => ({
            color: "#357981",
            weight: 2,
            opacity: 0.7,
            fillOpacity: 0.35,
            fillColor: "#357981",
          }),

          filter: (feature) => {
            // if (!selectedDate) return false
            // Extract month from selectedDate
            const month = selectedDate?.getMonth()
            const { targeting, demo, political } = feature.properties.crisis[month]
            const total = targeting.events + targeting.fatalities + demo.events + political.events + political.fatalities
            console.log(feature, total)

            return total > 0;
            
          },
        }).addTo(mapInstance)

        layerRef.current = layer
      }
    } else {

      if (layerRef.current) {
        mapInstance.removeLayer(layerRef.current)
        layerRef.current = null
      }

    }
  }, [mapInstance, isVisible, selectedDate])

  return null
}