import L from "leaflet"
import { useMapContext } from "@/context/map-context"
import { useEffect, useRef } from "react"
import Events from "@/data/events.json"
import { isSameDay, parse } from "date-fns"
import ConflictIcon from "@/assets/icon_conflict.svg"

export function ConflictEventPoints({ isVisible }: { isVisible: boolean }) {
  const { mapInstance, selectedDate } = useMapContext()
  const conflictPointRef = useRef<L.GeoJSON | null>(null)
  const icon = L.icon({
    iconUrl: ConflictIcon,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    className: "conflict-icon",
  })

  useEffect(() => {
    if (!mapInstance) return

    // Clean up function
    return () => {
      if (conflictPointRef.current) {
        mapInstance.removeLayer(conflictPointRef.current)
        conflictPointRef.current = null
      }
    }
  }, [mapInstance])

  useEffect(() => {
    if (!mapInstance) return

    // Remove existing layer if it exists
    if (conflictPointRef.current) {
      mapInstance.removeLayer(conflictPointRef.current)
    }

    if (!isVisible) return

    conflictPointRef.current = L.geoJSON(Events, {
      pointToLayer: (feature, latlng) => {
        return L.marker(latlng, { icon })
      },
      filter: (feature) => {
        if (!selectedDate) return false
        if (!feature.properties.event_date) return false
        return isSameDay(parse(feature.properties.event_date, "yyyy-MM-dd", new Date()), selectedDate)
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties) {
          const locationFields = ["admin1", "admin2", "admin3"]
          const popupContent = `
            <div class="p-2">
              <div class="text-xs font-semibold">Event Type</div>
              <div class="text-xs">${feature.properties.disorder_type} - ${feature.properties.event_type} - ${feature.properties.sub_event_type}</div>
              <div class="text-xs font-semibold">Notes</div>
              <div class="text-xs">${feature.properties.notes}</div>
              <div class="text-xs font-semibold">Location</div>
              <div class="text-xs">${locationFields.map((field) => feature.properties[field]).join(", ")}</div>
            </div>
          `
          layer.bindPopup(popupContent)
        }
      },
    }).addTo(mapInstance)
  }, [mapInstance, isVisible, selectedDate])

  return null
}
