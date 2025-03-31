import L from "leaflet"
import { useMapContext } from "@/context/map-context"
import { useEffect, useRef } from "react"
import ConflictEventsData from "@/data/crisis-events.json"

export function ConflictEvents({ isVisible, selectedDate }: { isVisible: boolean; selectedDate: Date | null }) {
  const { mapInstance } = useMapContext()
  const layerRef = useRef<L.GeoJSON | null>(null)

  useEffect(() => {
    if (!mapInstance) return
    if (!isVisible) {
      if (layerRef.current) {
        mapInstance.removeLayer(layerRef.current)
        layerRef.current = null
      }
      return
    }

    if (isVisible && selectedDate && !layerRef.current) {
      if (!layerRef.current) {
        console.log("Conflict Layer Updating", selectedDate)
        const layer = L.geoJSON(ConflictEventsData, {
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
            const crisis = feature.crisis
            if (!crisis) return false
            const { targeting, demo, political } = crisis[month]
            const total = targeting.events + targeting.fatalities + demo.events + political.events + political.fatalities

            return total > 0;
          },
          onEachFeature: (feature, layer) => {
            const month = selectedDate?.getMonth()
            const crisis = feature.crisis[month]
            const monthName = selectedDate.toLocaleString('default', { month: 'long' })
            if (!crisis) return
            const TITLES = {
              targeting: "Targeting Civilians",
              demo: "Demonstrations",
              political: "Political Violence"
            }
            const { targeting, demo, political } = crisis

            const tooltipContent = `
              <div class="p-2">
                <div class="text-xs">ACLED Conflict Events - ${monthName}</div>
                <div class="font-medium">${TITLES.targeting}</div>
                  <div class="font-small"># of Events: ${targeting.events}</div>
                  <div class="font-small"># of Fatalities: ${targeting.fatalities}</div>
                <div class="font-medium">${TITLES.demo}</div>
                  <div class="font-small"># of Events: ${demo.events}</div>
                <div class="font-medium">${TITLES.political}</div>
                  <div class="font-small"># of Events: ${political.events}</div>
                  <div class="font-small"># of Fatalities: ${political.fatalities}</div>
              </div>
            `
            layer.bindTooltip(() => {
              return tooltipContent
            })
          }
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