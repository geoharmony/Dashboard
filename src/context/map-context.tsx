import { createContext, useContext, useState, useEffect, type ReactNode, useCallback, useRef } from "react"
import L from "leaflet"
import { fetchLayerData, fetchAlertsData } from "@/lib/api"
import { type Alert } from "@/types/alerts"

export interface Layer {
  id: string
  name: string
  type: "geojson" | "csv" | "marker" | "raster"
  category: string
  group: string
  tabAssociations: string[]
  visible: boolean
  data?: any
  tileUrl?: string
  tileUrlsByDate?: Record<string, string>
  leafletLayer?: L.Layer
  color: string
  opacity?: number
  minZoom?: number
  maxZoom?: number
  date?: string // Optional date for time-based filtering
}

interface DateRange {
  start: Date
  end: Date
}

interface MapContextType {
  mapInstance: L.Map | null
  selectedDate: Date | null
  dateRange: DateRange | null
  setMapInstance: (map: L.Map) => void
  setSelectedDate: (date: Date | null) => void
  activeCategory: string
  setActiveCategory: (category: string) => void
  layers: Layer[]
  filteredLayers: Layer[]
  alerts?: Alert[]
  filteredAlerts?: Alert[]
  activeAlerts?: string[]
  toggleLayer?: (id: string) => void
  focusOnAlert?: (id: string) => void
  filterLayersByCategory?: (category: string) => void
  searchQuery?: string
  setSearchQuery?: (query: string) => void
  isSearchVisible?: boolean
  setIsSearchVisible?: (visible: boolean) => void
  showingTopo: boolean
  baseLayer?: L.TileLayer
  setBaseLayer?: (layer: L.TileLayer) => void
  topoLayer?: L.TileLayer
  setTopoLayer?: (layer: L.TileLayer) => void
}

const MapContext = createContext<MapContextType | undefined>(undefined)

// Admin region coordinates for mock data
const adminCoords: Record<string, [number, number]> = {
  Jonglei: [8.5, 31.5],
  "Eastern Equatoria": [4.5, 33.5],
  "Western Equatoria": [5.5, 28.0],
  "Central Equatoria": [4.8, 31.0],
  "Western Bahr el Ghazal": [8.5, 25.5],
}

// Helper function to format date as YYYY-MM-DD
const formatDateForComparison = (date: Date): string => {
  return date.toISOString().split("T")[0]
}

// Helper function to check if a date string matches a target date
const datesMatch = (dateStr: string | undefined, targetDate: Date): boolean => {
  if (!dateStr) return true // Items without dates are visible on all dates
  const itemDate = new Date(dateStr)
  return formatDateForComparison(itemDate) === formatDateForComparison(targetDate)
}

// Fix the activeAlerts initialization to ensure alerts are displayed by default
export function MapProvider({ children }: { children: ReactNode }) {
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date("2026-06-15"))
  const [dateRange, setDateRange] = useState<DateRange | null>({
    start: new Date("2026-01-01"),
    end: new Date("2026-12-31"),
  })
  const [activeCategory, setActiveCategory] = useState<string>("conflict-risk")

  const [layers, setLayers] = useState<Layer[]>([])
  const [filteredLayers, setFilteredLayers] = useState<Layer[]>([])

  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([])

  // Initialize all alerts as active by default
  const [activeAlerts, setActiveAlerts] = useState<string[]>([])

  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false)

  // Use refs to track active layers and markers
  const activeLayersRef = useRef(new Map<string, L.Layer>())
  const activeAlertsRef = useRef(new Map<string, L.Layer>())
  const pendingUpdatesRef = useRef(false)

  // Topo layer state
  const [showingTopo, setShowingTopo] = useState<boolean>(false)
  const [baseLayer, setBaseLayer] = useState<L.TileLayer | null>(null)
  const [topoLayer, setTopoLayer] = useState<L.TileLayer | null>(null)


  // Handle checking if we should show topo layer
  useEffect(() => {
    const topoLayerIds: string[] = ["idp", "something"]
    if (layers.filter(layer => topoLayerIds.includes(layer.id) && layer.visible).length > 0) {
      setShowingTopo(true)
    } else {
      setShowingTopo(false)
    }
  }, [layers])

  // Fetch initial layer data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Fetch layer data
        const layerData = await fetchLayerData()
        setLayers(layerData)

        // Fetch alerts data
        const alertsData = await fetchAlertsData()
        setAlerts(alertsData)
      } catch (error) {
        console.error("Failed to load initial data:", error)
      }
    }

    loadInitialData()
  }, [])

  // Filter layers and alerts based on selected date
  useEffect(() => {
    if (!selectedDate) {
      setFilteredLayers(layers)
      setFilteredAlerts(alerts)
      return
    }

    // Filter layers based on date
    const newFilteredLayers = layers.map((layer) => {
      // Create a copy of the layer
      const layerCopy = { ...layer }

      // Filter data based on date if applicable
      if (layer.type === "geojson" && layer.data) {
        // Filter GeoJSON features
        console.groupCollapsed(layer.id)
        console.log('layer', layer.id, layer.data.features);
        if (layer.data.features) {
          layerCopy.data = {
            ...layer.data,
            features: layer.data.features.filter((feature: any) => {
              // Keep features without dates or with matching dates
              const date = feature.properties?.date
              console.log(feature, date, !date || datesMatch(date, selectedDate))
              return !date || datesMatch(date, selectedDate)
            }),
          }
        }
        console.groupEnd()
      } else if (layer.type === "csv" || layer.type === "marker") {
        // Filter array data
        if (Array.isArray(layer.data)) {
          layerCopy.data = layer.data.filter((item: any) => {
            // Keep items without dates or with matching dates
            return !item.date || datesMatch(item.date, selectedDate)
          })
        }
      } else if (layer.type === "raster" && layer.tileUrlsByDate) {
        // Handle date-specific tile URLs
        const dateStr = formatDateForComparison(selectedDate)
        if (layer.tileUrlsByDate[dateStr]) {
          layerCopy.tileUrl = layer.tileUrlsByDate[dateStr]
        }
      }

      return layerCopy
    })

    setFilteredLayers(newFilteredLayers)

    // Filter alerts based on date
    const newFilteredAlerts = alerts.filter((alert) => {
      return datesMatch(alert.date, selectedDate)
    })

    setFilteredAlerts(newFilteredAlerts)

    // Update active alerts to only include those that match the selected date
    setActiveAlerts((prev) =>
      prev.filter((alertId) => {
        const alert = newFilteredAlerts.find((a) => a.id === alertId)
        return !!alert
      }),
    )
  }, [selectedDate, layers, alerts])

  // Clean up all layers from the map
  const cleanupAllLayers = useCallback(() => {
    if (!mapInstance) return

    // Remove all layer markers
    activeLayersRef.current.forEach((layer) => {
      mapInstance.removeLayer(layer)
    })
    activeLayersRef.current.clear()

    // Remove all alert markers
    activeAlertsRef.current.forEach((layer) => {
      mapInstance.removeLayer(layer)
    })
    activeAlertsRef.current.clear()

  }, [mapInstance])

  // Update map when filtered layers or active category changes
  useEffect(() => {
    if (!mapInstance || pendingUpdatesRef.current) return

    pendingUpdatesRef.current = true

    // Use requestAnimationFrame to batch updates and prevent rendering issues
    requestAnimationFrame(() => {
      try {
        // Clean up existing layers
        cleanupAllLayers()

        // Add visible layers that match the active category
        filteredLayers.forEach((layer) => {
          // Skip if layer is not visible or not associated with active category
          if (!layer.visible || (activeCategory !== "map" && !layer.tabAssociations.includes(activeCategory))) {
            return
          }

          // Skip if layer has no data to display
          if (
            (layer.type === "geojson" && (!layer.data.features || layer.data.features.length === 0)) ||
            ((layer.type === "csv" || layer.type === "marker") && (!layer.data || layer.data.length === 0))
          ) {
            return
          }

          // Create a new leaflet layer
          let leafletLayer: L.Layer | undefined

          if (layer.type === "raster" && layer.tileUrl) {
            // Add raster tile layer
            leafletLayer = L.tileLayer(layer.tileUrl, {
              attribution: "",
              opacity: layer.opacity || 1.0,
              minZoom: layer.minZoom || 0,
              maxZoom: layer.maxZoom || 19,
            }).addTo(mapInstance)
          } else if (layer.type === "geojson" && layer.data && layer.data.features && layer.data.features.length > 0) {
            leafletLayer = L.geoJSON(layer.data, {
              style: () => ({
                color: layer.color,
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.4,
              }),
              pointToLayer: (feature, latlng) => {
                return L.circleMarker(latlng, {
                  radius: 8,
                  fillColor: layer.color,
                  color: "#000",
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 0.8,
                })
              },
              onEachFeature: (feature, layer) => {
                // Add popup on hover for GeoJSON features
                if (feature.properties) {
                  const popupContent = `
                    <div class="p-2">
                      <div class="font-medium">${feature.properties.name || "Unnamed Area"}</div>
                      ${feature.properties.severity ? `<div>Severity: ${feature.properties.severity}</div>` : ""}
                      ${feature.properties.description ? `<div>${feature.properties.description}</div>` : ""}
                      ${
                        feature.properties.date
                          ? `<div>Date: ${new Date(feature.properties.date).toLocaleDateString()}</div>`
                          : ""
                      }
                      ${
                        Object.keys(feature.properties).map(
                          (key) =>
                            `<div>${key}: ${feature.properties[key]}</div>`
                        ).join('')
                      }
                    </div>
                  `

                  // Configure popup with options to prevent map jumping
                  const popup = L.popup({
                    closeButton: false,
                    offset: L.point(0, -8),
                    autoPan: false,
                    className: "custom-popup",
                  }).setContent(popupContent)

                  layer.bindPopup(popup)

                  // Show popup on hover, hide on mouseout
                  layer.on("mouseover", function (e) {
                    this.openPopup()
                  })
                  layer.on("mouseout", function (e) {
                    this.closePopup()
                  })
                }
              },
            }).addTo(mapInstance)
          } else if (layer.type === "csv" && layer.data && layer.data.length > 0) {
            // Convert CSV data to markers
            const markerGroup = L.layerGroup().addTo(mapInstance)

            layer.data.forEach((point: any) => {
              const marker = L.marker([point.latitude, point.longitude], {
                icon: L.divIcon({
                  html: `<div style="background-color: ${layer.color}; width: 12px; height: 12px; border-radius: 6px;"></div>`,
                  className: "custom-div-icon",
                  iconSize: [12, 12],
                  iconAnchor: [6, 6],
                }),
              })

              // Add popup on hover for CSV points
              const popupContent = `
                <div class="p-2">
                  <div class="font-medium">${point.name || "Unnamed Point"}</div>
                  ${point.type ? `<div>Type: ${point.type}</div>` : ""}
                  ${point.description ? `<div>${point.description}</div>` : ""}
                  ${point.date ? `<div>Date: ${new Date(point.date).toLocaleDateString()}</div>` : ""}
                </div>
              `

              // Configure popup with options to prevent map jumping
              const popup = L.popup({
                closeButton: false,
                offset: L.point(0, -8),
                autoPan: false,
                className: "custom-popup",
              }).setContent(popupContent)

              marker.bindPopup(popup)

              // Show popup on hover, hide on mouseout
              marker.on("mouseover", function (e) {
                this.openPopup()
              })
              marker.on("mouseout", function (e) {
                this.closePopup()
              })

              markerGroup.addLayer(marker)
            })

            leafletLayer = markerGroup
          } else if (layer.type === "marker" && layer.data && layer.data.length > 0) {
            // Add custom markers
            const markerGroup = L.layerGroup().addTo(mapInstance)

            layer.data.forEach((point: any) => {
              const marker = L.marker([point.latitude, point.longitude], {
                icon: L.divIcon({
                  html: `<div style="background-color: ${layer.color}; width: 16px; height: 16px;"></div>`,
                  className: "custom-div-icon",
                  iconSize: [16, 16],
                  iconAnchor: [8, 8],
                }),
              })

              // Add popup on hover for marker points
              const popupContent = `
                <div class="p-2">
                  <div class="font-medium">${point.name || "Unnamed Location"}</div>
                  ${point.population ? `<div>Population: ${point.population}</div>` : ""}
                  ${point.status ? `<div>Status: ${point.status}</div>` : ""}
                  ${point.date ? `<div>Date: ${new Date(point.date).toLocaleDateString()}</div>` : ""}
                </div>
              `

              // Configure popup with options to prevent map jumping
              const popup = L.popup({
                closeButton: false,
                offset: L.point(0, -8),
                autoPan: false,
                className: "custom-popup",
              }).setContent(popupContent)

              marker.bindPopup(popup)

              // Show popup on hover, hide on mouseout
              marker.on("mouseover", function (e) {
                this.openPopup()
              })
              marker.on("mouseout", function (e) {
                this.closePopup()
              })

              markerGroup.addLayer(marker)
            })

            leafletLayer = markerGroup
          }

          // Store the layer in our active layers map
          if (leafletLayer) {
            activeLayersRef.current.set(layer.id, leafletLayer)
          }
        })

        pendingUpdatesRef.current = false
      } catch (error) {
        console.error("Error updating map layers:", error)
        pendingUpdatesRef.current = false
      }
    })
  }, [mapInstance, filteredLayers, activeCategory, cleanupAllLayers])

  // Handle alert visualization
  useEffect(() => {
    if (!mapInstance) return

    console.log("Alert rendering triggered", {
      filteredAlertsCount: filteredAlerts.length,
      activeAlertsCount: activeAlerts.length,
      activeAlertIds: activeAlerts,
    })

    // Use requestAnimationFrame to batch updates
    requestAnimationFrame(() => {
      try {
        // Process alerts
        filteredAlerts.forEach((alert) => {
          const isActive = activeAlerts.includes(alert.id)
          const hasLayer = activeAlertsRef.current.has(alert.id)

          console.log(`Processing alert ${alert.id}:`, {
            isActive,
            hasLayer,
            alert,
          })

          // Remove inactive alerts
          if (!isActive && hasLayer) {
            const layer = activeAlertsRef.current.get(alert.id)!
            mapInstance.removeLayer(layer)
            activeAlertsRef.current.delete(alert.id)
            console.log(`Removed inactive alert: ${alert.id}`)
            return
          }

          // Skip if already active
          if (isActive && hasLayer) {
            console.log(`Alert ${alert.id} already active and has layer`)
            return
          }

          // Add new active alerts
          if (isActive && !hasLayer) {
            console.log(`Creating layer for alert ${alert.id}`)
            let leafletLayer: L.Layer | undefined
            let bounds: L.LatLngBounds | undefined

            // Create appropriate layer based on alert type
            if (alert.latitude && alert.longitude) {
              console.log(`Creating point marker for alert ${alert.id} at [${alert.latitude}, ${alert.longitude}]`)
              // Create a marker for point-based alerts
              const icon = L.divIcon({
                html: `<div style="background-color: ${
                  alert.severity === "alert" ? "#ef4444" : "#f59e0b"
                }; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 2px white, 0 0 0 4px ${
                  alert.severity === "alert" ? "#ef4444" : "#f59e0b"
                }, 0 0 8px rgba(0,0,0,0.3);">
                    <div style="width: 4px; height: 4px; background-color: white; border-radius: 50%;"></div>
                  </div>`,
                className: "alert-marker",
                iconSize: [24, 24],
                iconAnchor: [12, 12],
              })

              const marker = L.marker([alert.latitude, alert.longitude], { icon })

              // Add popup with alert details
              const popupContent = `
              <div class="p-2">
                <div class="font-medium">${alert.title}</div>
                <div>${alert.description}</div>
                <div class="text-sm text-muted-foreground mt-1">Date: ${new Date(alert.date).toLocaleDateString()}</div>
              </div>
            `

              // Configure popup with options to prevent map jumping
              const popup = L.popup({
                closeButton: false,
                offset: L.point(0, -16),
                autoPan: false,
                className: "custom-popup",
              }).setContent(popupContent)

              marker.bindPopup(popup)

              // Show popup on hover, hide on mouseout
              marker.on("mouseover", function (e) {
                this.openPopup()
              })
              marker.on("mouseout", function (e) {
                this.closePopup()
              })

              leafletLayer = marker.addTo(mapInstance)

              // Create bounds for this point (with some padding)
              bounds = L.latLngBounds(
                [alert.latitude - 0.1, alert.longitude - 0.1],
                [alert.latitude + 0.1, alert.longitude + 0.1],
              )
            } else if (alert.geometry) {
              console.log(`Creating geometry for alert ${alert.id}`, alert.geometry)
              // Create a polygon for geometry-based alerts
              const color = alert.severity === "alert" ? "#ef4444" : "#f59e0b"

              const geoJsonLayer = L.geoJSON(alert.geometry as any, {
                style: {
                  color,
                  weight: 2,
                  opacity: 0.8,
                  fillOpacity: 0.3,
                  fillColor: color,
                },
              }).addTo(mapInstance)

              // Add popup with alert details
              const popupContent = `
              <div class="p-2">
                <div class="font-medium">${alert.title}</div>
                <div>${alert.description}</div>
                <div class="text-sm text-muted-foreground mt-1">Date: ${new Date(alert.date).toLocaleDateString()}</div>
              </div>
            `

              // Configure popup with options to prevent map jumping
              const popup = L.popup({
                closeButton: false,
                autoPan: false,
                className: "custom-popup",
              }).setContent(popupContent)

              geoJsonLayer.bindPopup(popup)

              // Show popup on hover, hide on mouseout
              geoJsonLayer.on("mouseover", function (e) {
                this.openPopup(e.latlng)
              })
              geoJsonLayer.on("mouseout", function (e) {
                this.closePopup()
              })

              leafletLayer = geoJsonLayer
              bounds = geoJsonLayer.getBounds()
            } else if (alert.admin2_region) {
              console.log(`Creating admin region for alert ${alert.id}: ${alert.admin2_region}`)
              // For admin region alerts, we would normally fetch the region geometry
              // For this mock, we'll create a simple circle at a fixed location
              const color = alert.severity === "alert" ? "#ef4444" : "#f59e0b"

              const coords = adminCoords[alert.admin2_region] || [7.5, 30.0]
              console.log(`Using coordinates for ${alert.admin2_region}:`, coords)

              const circle = L.circle(coords, {
                radius: 50000, // 50km radius
                color,
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.3,
                fillColor: color,
              }).addTo(mapInstance)

              // Add popup with alert details
              const popupContent = `
              <div class="p-2">
                <div class="font-medium">${alert.title}</div>
                <div>${alert.description}</div>
                <div class="text-sm text-muted-foreground mt-1">Region: ${alert.admin2_region}</div>
                <div class="text-sm text-muted-foreground">Date: ${new Date(alert.date).toLocaleDateString()}</div>
              </div>
            `

              // Configure popup with options to prevent map jumping
              const popup = L.popup({
                closeButton: false,
                autoPan: false,
                className: "custom-popup",
              }).setContent(popupContent)

              circle.bindPopup(popup)

              // Show popup on hover, hide on mouseout
              circle.on("mouseover", function (e) {
                this.openPopup(e.latlng)
              })
              circle.on("mouseout", function (e) {
                this.closePopup()
              })

              leafletLayer = circle

              // Create bounds for this circle
              bounds = L.latLngBounds([coords[0] - 0.5, coords[1] - 0.5], [coords[0] + 0.5, coords[1] + 0.5])
            }

            // Store the layer and bounds
            if (leafletLayer) {
              console.log(`Successfully added layer for alert ${alert.id}`)
              activeAlertsRef.current.set(alert.id, leafletLayer)

              // Store bounds in the alert object for later use
              const updatedAlert = { ...alert, bounds }
              setFilteredAlerts((prev) => prev.map((a) => (a.id === alert.id ? updatedAlert : a)))
            } else {
              console.warn(`Failed to create layer for alert ${alert.id}`)
            }
          }
        })
      } catch (error) {
        console.error("Error updating alert layers:", error)
      }
    })
  }, [mapInstance, filteredAlerts, activeAlerts])

  // Focus on active alerts when they change
  const focusOnAlert = useCallback(
    (alertId: string) => {
      if (!mapInstance) return

      const alert = filteredAlerts.find((a) => a.id === alertId)
      if (!alert) return

      // Use requestAnimationFrame to ensure the map is ready
      requestAnimationFrame(() => {
        try {
          if (alert.latitude && alert.longitude) {
            // Zoom to the alert point
            mapInstance.setView([alert.latitude, alert.longitude], 10)
          } else if (alert.admin2_region) {
            // Zoom to the admin region
            const coords = adminCoords[alert.admin2_region] || [7.5, 30.0]
            mapInstance.setView(coords, 9)
          } else if (alert.geometry) {
            // Try to calculate bounds from geometry
            const layer = activeAlertsRef.current.get(alert.id)
            if (layer && "getBounds" in layer && typeof layer.getBounds === "function") {
              const bounds = layer.getBounds()
              mapInstance.fitBounds(bounds, {
                padding: [50, 50],
                maxZoom: 10,
              })
            }
          }
        } catch (error) {
          console.error("Error focusing on alert:", error)
        }
      })
    },
    [mapInstance, filteredAlerts],
  )

  // Cleanup all layers when component unmounts
  useEffect(() => {
    return () => {
      if (mapInstance) {
        // Clean up all layers
        activeLayersRef.current.forEach((layer) => {
          mapInstance.removeLayer(layer)
        })
        activeAlertsRef.current.forEach((layer) => {
          mapInstance.removeLayer(layer)
        })
      }
    }
  }, [mapInstance])

  const toggleLayer = useCallback((id: string) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) => {
        if (layer.id === id) {
          return { ...layer, visible: !layer.visible }
        }
        return layer
      }),
    )
  }, [])

  const filterLayersByCategory = useCallback((category: string) => {
    setActiveCategory(category)

    // Auto-show layers associated with the selected category
    setLayers((prevLayers) =>
      prevLayers.map((layer) => {
        // If the layer is associated with the selected category, make it visible
        if (layer.tabAssociations.includes(category)) {
          return { ...layer, visible: true }
        }
        return layer
      }),
    )
  }, [])

  const handleSetSelectedDate = useCallback((date: Date | null) => {
    setSelectedDate(date)
  }, [])

  const handleSetActiveCategory = useCallback((category: string) => {
    setActiveCategory(category)
  }, [])

  useEffect(() => {
    if (!mapInstance) return

    if (!baseLayer || !topoLayer) return

    if (showingTopo) {
      mapInstance.addLayer(topoLayer)
      mapInstance.removeLayer(baseLayer)
    } else {
      mapInstance.removeLayer(topoLayer)
      mapInstance.addLayer(baseLayer)
    }
  }, [mapInstance, showingTopo, baseLayer, topoLayer])

  return (
    <MapContext.Provider
      value={{
        mapInstance,
        selectedDate,
        dateRange,
        setMapInstance,
        setSelectedDate: handleSetSelectedDate,
        activeCategory,
        setActiveCategory: handleSetActiveCategory,
        layers,
        filteredLayers,
        alerts,
        filteredAlerts,
        activeAlerts,
        toggleLayer,
        focusOnAlert,
        filterLayersByCategory,
        searchQuery,
        setSearchQuery,
        isSearchVisible,
        setIsSearchVisible,
        showingTopo,
        baseLayer,
        setBaseLayer,
        topoLayer,
        setTopoLayer,
      }}
    >
      {children}
    </MapContext.Provider>
  )
}

export function useMapContext() {
  const context = useContext(MapContext)
  if (context === undefined) {
    throw new Error("useMapContext must be used within a MapProvider")
  }
  return context
}

