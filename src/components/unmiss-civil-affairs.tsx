import L from "leaflet"
import { useMapContext } from "@/context/map-context"
import { useEffect, useRef } from "react"
import Geo from "@/data/unmiss_civil_affairs_geo.json"
import CivilAffairsIcon from "@/assets/icon_un_civilaffairs_transparent.svg"
import { isSameDay, parse } from "date-fns"



export function UNMISSCivilAffairs({ isVisible }: { isVisible: boolean }) {
  const { mapInstance, selectedDate } = useMapContext()
  const unmissCivilAffairsRef = useRef<L.GeoJSON | null>(null)

  const icon = L.icon({
    iconUrl: CivilAffairsIcon,
    iconSize: [25, 25],
  })

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
        return L.marker(latlng, {
          icon: icon,
        })
      },
      filter: (feature) => {
        return isSameDay(parse(feature.properties?.date, "yyyy-MM-dd", new Date()), selectedDate)
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
              <div class="text-xs font-semibold">${feature.properties.name}</div>
              <div class="text-sm">${feature.properties.description}</div>
            </div>
          `
          layer.bindPopup(popupContent)
        }
      },
    }).addTo(mapInstance)
  }, [mapInstance, isVisible, selectedDate])

  // Non-visual component (just manages the IDP layer on leaflet map)
  return null
}
