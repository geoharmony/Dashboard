import L from "leaflet"
import { useMapContext } from "@/context/map-context"
import { useEffect, useRef } from "react"
import UNMISS from "@/data/UNMISS South Sudan Locations.json"

import UNCompoundOffice from "@/assets/UN-compound-office.svg"
import { Feature } from "geojson"


interface UNMISSLayerProps {
  enabled: boolean
}

export function UNMISSLayer({ enabled }: UNMISSLayerProps) {
  const { mapInstance } = useMapContext()
  const unmissLayerRef = useRef<L.GeoJSON | null>(null)

  const UNCompoundOfficeIcon = L.icon({
    iconUrl: UNCompoundOffice,
    iconSize: [32, 48],
    iconAnchor: [16, 48],
    popupAnchor: [0, -48],
  })

  useEffect(() => {
    if (!mapInstance) return

    // Clean up function
    return () => {
      if (unmissLayerRef.current) {
        mapInstance.removeLayer(unmissLayerRef.current)
        unmissLayerRef.current = null
      }
    }
  }, [mapInstance])

  useEffect(() => {
    if (!mapInstance) return

    // Remove existing layer if it exists
    if (unmissLayerRef.current) {
      mapInstance.removeLayer(unmissLayerRef.current)
    }

    if (!enabled) return

    // Create UNMISS layer
    unmissLayerRef.current = L.geoJSON(UNMISS, {
      pointToLayer: (_feature: Feature, latlng: L.LatLng) => {
        return L.marker(latlng, {
          icon: UNCompoundOfficeIcon,
        })
      },
      // style: () => ({
      //   color: "#3949AB", // Indigo
      //   weight: 2,
      //   opacity: 0.7,
      //   fillOpacity: 0.1,
      //   fillColor: "#3949AB",
      //     radius: 10,
      //   })
      // },
      // style: () => ({
      //   color: "#3949AB", // Indigo
      //   weight: 2,
      //   opacity: 0.7,
      //   fillOpacity: 0.1,
      //   fillColor: "#3949AB",
      // }),
      onEachFeature: (feature, layer) => {
        if (feature.properties) {
          const popupContent = `
            <div class="p-2">
              <div class="font-medium">${feature.properties.name || "Unknown"}</div>
              <div class="text-xs">UNMISS</div>
            </div>
          `
          layer.bindPopup(popupContent)
        }
      },
    }).addTo(mapInstance)
  }, [mapInstance, enabled])

  // Non-visual component (just manages the UNMISS layer on leaflet map)
  return null
}