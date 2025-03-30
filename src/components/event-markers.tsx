"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import type { Event } from "../types/events"

interface EventMarkersProps {
  events: Event[]
  mapInstance: L.Map | null
  onMarkerClick?: (event: Event) => void
  highlightedTimelineId?: string | null
}

export function EventMarkers({ events, mapInstance, onMarkerClick, highlightedTimelineId }: EventMarkersProps) {
  const markersLayerRef = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    if (!mapInstance) return

    // Clean up function
    return () => {
      if (markersLayerRef.current) {
        mapInstance.removeLayer(markersLayerRef.current)
        markersLayerRef.current = null
      }
    }
  }, [mapInstance])

  useEffect(() => {
    if (!mapInstance) return

    // Remove existing markers
    if (markersLayerRef.current) {
      mapInstance.removeLayer(markersLayerRef.current)
    }

    // Create a new layer group for markers
    markersLayerRef.current = L.layerGroup().addTo(mapInstance)

    // Add markers for each event
    events.forEach((event) => {
      // Skip if no location
      if (!event.location) return

      // Determine if this event is part of the highlighted timeline
      const isHighlighted = highlightedTimelineId && event.narrative_id === highlightedTimelineId

      // Create a marker with a custom icon
      if (event.location.geometry.type === "Point") {
      const marker = L.marker([event.location.geometry.coordinates[1], event.location.geometry.coordinates[0]], {
        icon: L.divIcon({
          html: `<div style="background-color: ${isHighlighted ? "#ff4500" : "#ef4444"}; width: ${isHighlighted ? "16px" : "12px"}; height: ${isHighlighted ? "16px" : "12px"}; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 1px ${isHighlighted ? "#ff4500" : "#ef4444"};"></div>`,
          className: "custom-div-icon",
          iconSize: [isHighlighted ? 16 : 12, isHighlighted ? 16 : 12],
          iconAnchor: [isHighlighted ? 8 : 6, isHighlighted ? 8 : 6],
        }),
      })

      // Add popup with event details
      const popupContent = `
        <div class="p-2 max-w-xs">
          <div class="font-medium">${event.location.name}</div>
          <div class="text-xs">${new Date(event.date).toLocaleDateString()}</div>
          <div class="mt-1">${event.event}</div>
          ${event.context ? `<div class="mt-1 text-xs italic">${event.context}</div>` : ""}
          <div class="mt-1 flex gap-1">
            <span class="text-xs px-1 bg-gray-100 rounded">Timeline ${event.narrative_id}</span>
            <span class="text-xs px-1 bg-gray-100 rounded">${event.location.admin1}</span>
          </div>
        </div>
      `

      marker.bindPopup(popupContent)

      // Add click handler
      if (onMarkerClick) {
        marker.on("click", () => {
          onMarkerClick(event)
        })
      }

      // Add marker to layer group
      markersLayerRef.current?.addLayer(marker)
    }
    })
  }, [mapInstance, events, onMarkerClick, highlightedTimelineId])

  return null // This is a non-visual component
}

