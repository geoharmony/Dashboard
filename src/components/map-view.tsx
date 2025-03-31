import { useEffect, useRef, useState, useCallback } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useMapContext } from "@/context/map-context"
import { HomeButton } from "@/components/home-button"
import { EventMarkers } from "@/components/event-markers"
import { TimelinePanel } from "@/components/timeline-panel"
import { filterEventsByDateRange } from "@/lib/events-utils"
import type { Event } from "@/types/events"
import { DateSlider } from "@/components/slider"
import { AdminBoundaries } from "@/components/admin-boundaries"
import { UNMISSLayer } from "@/components/unmiss-layer"
import { IDPLayer } from "./idp-layer"
import { ConflictEvents } from "./conflict-events"
import { ConflictEventPoints } from "./conflict-event-points"
import { FloodLayer } from "./flood-layer"
import { PopulatedPlaces } from "./populated-places"

interface MapViewProps {
  events: Event[]
}

export function MapView({ events }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null)
  const { setMapInstance, selectedDate, setSelectedDate, dateRange, layers, setBaseLayer, setTopoLayer } = useMapContext()
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const isInitializedRef = useRef(false)
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [highlightedTimelineId, setHighlightedTimelineId] = useState<string | null>(null)

  // Filter events based on selected date
  useEffect(() => {
    if (selectedDate) {
      const filtered = filterEventsByDateRange(events, selectedDate, 10)
      setFilteredEvents(filtered)
    } else {
      setFilteredEvents([])
    }

    // Clear highlighted timeline when date changes
    setHighlightedTimelineId(null)
  }, [events, selectedDate])

  // Handle marker click
  const handleMarkerClick = useCallback((event: Event) => {
    setHighlightedTimelineId(event.narrative_id)
  }, [])

  // Handle timeline selection
  const handleTimelineSelect = useCallback((timelineId: string) => {
    setHighlightedTimelineId(timelineId)
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

        window.mapRef = mapRef

        // Add base tile layer
        const baseLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          minZoom: 3,
          maxZoom: 19,
        }).addTo(mapRef.current)
        setBaseLayer(baseLayer)
        setTopoLayer(L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a target="_blank" href="https://www.opentopomap.org/copyright">OpenTopoMap</a> contributors',
          minZoom: 3,
          maxZoom: 19,
        }))

        // Disable Ukrainian flag from attribution control
        mapRef.current.attributionControl.setPrefix("<a target='_blank' href='https://leafletjs.com'>Leaflet</a>")

        // Save map instance to context
        setMapInstance(mapRef.current)
        isInitializedRef.current = true

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

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="relative flex flex-grow flex-col h-full">
      <div ref={mapContainerRef} className="flex-1 w-full" />

      <HomeButton mapInstance={mapRef.current} />
      <TimelinePanel
        events={filteredEvents}
        selectedDate={selectedDate}
        mapInstance={mapRef.current}
        onTimelineSelect={handleTimelineSelect}
      />

      {/* Map layers */}
      <ConflictEvents
        isVisible={layers.filter(layer => layer.id === "conflict-risk").some(layer => layer.visible)}
        selectedDate={selectedDate}
      />

      <ConflictEventPoints
        isVisible={layers.filter(layer => layer.id === "conflict-events").some(layer => layer.visible)}
      />

      <EventMarkers
        events={filteredEvents}
        mapInstance={mapRef.current}
        onMarkerClick={handleMarkerClick}
      />
      <AdminBoundaries
        mapInstance={mapRef.current}
        admin1Enabled={layers.filter(layer => layer.id === "admin1").some(layer => layer.visible)}
        admin2Enabled={layers.filter(layer => layer.id === "admin2").some(layer => layer.visible)}
      />

      <UNMISSLayer isVisible={layers.filter(layer => layer.id === "unmiss").some(layer => layer.visible)}/>
      <IDPLayer isVisible={layers.filter(layer => layer.id === "idp").some(layer => layer.visible)}/>
      {/* <PopulatedPlaces isVisible={layers.filter(layer => layer.id === "populated_places").some(layer => layer.visible)}/> */}
      <PopulatedPlaces isVisible={layers.filter(layer => layer.id === "populated_places").some(layer => layer.visible)}/>
      <FloodLayer 
        isVisible={layers.filter(layer => layer.id === "flood").some(layer => layer.visible)}
      />
      


      {/* <IDPLayer
        mapInstance={mapRef.current}
        data={IDP_DATA}
        enabled={true}
      />
      <CrisisLayer
        data={ADM2_CRISIS}
        enabled={true}
        mapInstance={mapRef.current}
      />
      <FloodwatchLayer
        mapInstance={mapRef.current}
        data={floodwatchTileUrls}
        enabled={true}
      /> */}


      <DateSlider selectedDate={selectedDate} setSelectedDate={setSelectedDate} dateRange={dateRange} />
    </div>
  )
}
