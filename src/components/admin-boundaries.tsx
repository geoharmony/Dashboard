"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"

interface AdminBoundariesProps {
  admin1GeoJSON: GeoJSON.FeatureCollection | null
  admin2GeoJSON: GeoJSON.FeatureCollection | null
  mapInstance: L.Map | null
}

// Declare GeoJSON
declare var GeoJSON: any

export function AdminBoundaries({ admin1GeoJSON, admin2GeoJSON, mapInstance }: AdminBoundariesProps) {
  const admin1LayerRef = useRef<L.GeoJSON | null>(null)
  const admin2LayerRef = useRef<L.GeoJSON | null>(null)

  useEffect(() => {
    if (!mapInstance) return

    // Clean up function
    return () => {
      if (admin1LayerRef.current) {
        mapInstance.removeLayer(admin1LayerRef.current)
        admin1LayerRef.current = null
      }
      if (admin2LayerRef.current) {
        mapInstance.removeLayer(admin2LayerRef.current)
        admin2LayerRef.current = null
      }
    }
  }, [mapInstance])

  useEffect(() => {
    if (!mapInstance || !admin1GeoJSON) return

    // Remove existing layer if it exists
    if (admin1LayerRef.current) {
      mapInstance.removeLayer(admin1LayerRef.current)
    }

    // Create Admin1 layer
    admin1LayerRef.current = L.geoJSON(admin1GeoJSON, {
      style: () => ({
        color: "#3949AB", // Indigo
        weight: 2,
        opacity: 0.7,
        fillOpacity: 0.1,
        fillColor: "#3949AB",
      }),
      onEachFeature: (feature, layer) => {
        if (feature.properties) {
          const popupContent = `
            <div class="p-2">
              <div class="font-medium">${feature.properties.ADM1_NAME || "Unknown"}</div>
              <div class="text-xs">Admin Level 1</div>
            </div>
          `
          layer.bindPopup(popupContent)
        }
      },
    }).addTo(mapInstance)
  }, [mapInstance, admin1GeoJSON])

  useEffect(() => {
    if (!mapInstance || !admin2GeoJSON) return

    // Remove existing layer if it exists
    if (admin2LayerRef.current) {
      mapInstance.removeLayer(admin2LayerRef.current)
    }

    // Create Admin2 layer
    admin2LayerRef.current = L.geoJSON(admin2GeoJSON, {
      style: () => ({
        color: "#7986CB", // Lighter indigo
        weight: 1,
        opacity: 0.5,
        fillOpacity: 0.05,
        fillColor: "#7986CB",
      }),
      onEachFeature: (feature, layer) => {
        if (feature.properties) {
          const popupContent = `
            <div class="p-2">
              <div class="font-medium">${feature.properties.ADM2_NAME || "Unknown"}</div>
              <div class="text-xs">Admin Level 2</div>
              <div class="text-xs">Parent: ${feature.properties.ADM1_NAME || "Unknown"}</div>
            </div>
          `
          layer.bindPopup(popupContent)
        }
      },
    }).addTo(mapInstance)
  }, [mapInstance, admin2GeoJSON])

  return null // This is a non-visual component
}

