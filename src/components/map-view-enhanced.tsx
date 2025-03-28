"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useMapContext } from "@/context/map-context"
import { TimeSliderEnhanced } from "@/components/time-slider-enhanced"
import { HomeButton } from "@/components/home-button"
import { CoordinatesDisplay } from "@/components/coordinates-display"
import { AdminBoundaries } from "@/components/admin-boundaries"
import { EventMarkers } from "@/components/event-markers"
import { AlertsPanelEnhanced } from "@/components/alerts-panel-enhanced"
import { filterEventsByDateRange } from "@/lib/events-utils"
import type { Event } from "@/types/events"
import type { GeoJSON } from "geojson"

interface MapViewEnhancedProps {
  events: Event[]
  admin1GeoJSON: GeoJSON.FeatureCollection
  admin2GeoJSON: GeoJSON.FeatureCollection
}

export function MapViewEnhanced({ events, admin1GeoJSON, admin2GeoJSON }: MapViewEnhancedProps) {
  const mapRef = useRef<L.Map | null>(null)
  const { setMapInstance, selectedDate } = useMapContext()
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const isInitializedRef = useRef(false)
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])

  // Filter events based on selected date
  useEffect(() => {
    if (selectedDate) {
      const filtered = filterEventsByDateRange(events, selectedDate, 10)
      setFilteredEvents(filtered)
    } else {
      setFilteredEvents([])
    }
  }, [events, selectedDate])

  // Handle marker click
  const handleMarkerClick = useCallback((event: Event) => {
    // This will be handled by the popup's click event
  }, [])

  useEffect(() => {
    if (!mapContainerRef.current) return

    // Initialize map if it doesn't exist
    if (!mapRef.current) {
      // Make sure the container has dimensions before initializing the map
      const container = mapContainerRef.current
      const containerHeight = container.clientHeight
      const containerWidth = container.clientWidth

      if (containerHeight === 0 || containerWidth === 0) {
        // If container dimensions are not ready, wait a bit and try again
        const timer = setTimeout(() => {
          if (container && !isInitializedRef.current) {
            initializeMap()
          }
        }, 100)
        return () => clearTimeout(timer)
      }

      initializeMap()
    }

    function initializeMap() {
      if (isInitializedRef.current || !mapContainerRef.current) return

      try {
        mapRef.current = L.map(mapContainerRef.current, {
          center: [7.5, 30],
          zoom: 7,
          zoomControl: true,
          attributionControl: true,
          scrollWheelZoom: true,
          closePopupOnClick: false,
          preferCanvas: true,
          zoomSnap: 0.5,
          zoomDelta: 0.5,
          fadeAnimation: false,
          markerZoomAnimation: false,
        })

        // Add base tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          minZoom: 3,
          maxZoom: 19,
        }).addTo(mapRef.current)

        // Disable Ukrainian flag from attribution control
        mapRef.current.attributionControl.setPrefix("")

        // Save map instance to context
        setMapInstance(mapRef.current)
        isInitializedRef.current = true

        // Force a resize event to ensure tiles load properly
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.invalidateSize()
          }
        }, 100)
      } catch (error) {
        console.error("Error initializing map:", error)
      }
    }

    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove()
        } catch (error) {
          console.error("Error removing map:", error)
        }
        mapRef.current = null
        isInitializedRef.current = false
      }
    }
  }, [setMapInstance])

  // Ensure map resizes properly when container dimensions change
  useEffect(() => {
    if (!mapRef.current) return

    const handleResize = () => {
      if (mapRef.current) {
        try {
          mapRef.current.invalidateSize()
        } catch (error) {
          console.error("Error resizing map:", error)
        }
      }
    }

    window.addEventListener("resize", handleResize)

    // Initial invalidateSize to fix any sizing issues
    setTimeout(handleResize, 200)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="relative flex flex-col h-full">
      <div ref={mapContainerRef} className="flex-1 w-full" />

      {/* Enhanced components */}
      <TimeSliderEnhanced />
      <HomeButton />
      <CoordinatesDisplay />
      <AlertsPanelEnhanced events={filteredEvents} />

      {/* Map layers */}
      <AdminBoundaries admin1GeoJSON={admin1GeoJSON} admin2GeoJSON={admin2GeoJSON} />
      <EventMarkers events={filteredEvents} onMarkerClick={handleMarkerClick} />
    </div>
  )
}

