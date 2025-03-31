import L from "leaflet"
import { useMapContext } from "@/context/map-context"
import { useEffect, useRef } from "react"
import UNMISS from "@/data/UNMISS South Sudan Locations.json"

import UNCompoundOfficeSvg from "@/assets/icon_un_loc_transparentbox.svg"
import { Feature } from "geojson"

const UNCompoundOfficeIcon = L.icon({
  iconUrl: UNCompoundOfficeSvg,
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
  className: "unmiss-icon",
})

interface UNMISSLayerProps {
  isVisible: boolean
}

export function UNMISSLayer({ isVisible }: UNMISSLayerProps) {
  const { mapInstance } = useMapContext()
  const unmissLayerRef = useRef<L.GeoJSON | null>(null)

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

    if (!isVisible) return

    console.log("UNMISSLayer", UNMISS)

    // Create UNMISS layer
    unmissLayerRef.current = L.geoJSON(UNMISS as GeoJSON.FeatureCollection, {
      pointToLayer: (feature: Feature, latlng: L.LatLng) => {
        return L.marker(latlng, {
          icon: UNCompoundOfficeIcon,
          // color: "#3949AB", // Indigo
          // weight: 2,
          // opacity: 0.7,
          // fillOpacity: 0.1,
          // fillColor: "#3949AB",
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
        console.log("feature", feature)
        console.log("layer", layer)
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
  }, [mapInstance, isVisible])

  // Non-visual component (just manages the UNMISS layer on leaflet map)
  return null
}