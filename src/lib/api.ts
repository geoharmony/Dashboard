// Mock API functions to simulate fetching data from a server

import type { Layer } from "@/context/map-context"

// Mock GeoJSON data
const mockGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Conflict Zone A",
        severity: "High",
        date: "2025-03-15T00:00:00Z",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [29.5, 7.2],
            [30.5, 7.2],
            [30.5, 8.2],
            [29.5, 8.2],
            [29.5, 7.2],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Conflict Zone B",
        severity: "Medium",
        date: "2025-03-16T00:00:00Z",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [30.2, 8.5],
            [31.2, 8.5],
            [31.2, 9.5],
            [30.2, 9.5],
            [30.2, 8.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Permanent Conflict Zone",
        severity: "Low",
        // No date - should be visible on all dates
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [29.8, 7.8],
            [30.8, 7.8],
            [30.8, 8.8],
            [29.8, 8.8],
            [29.8, 7.8],
          ],
        ],
      },
    },
  ],
}

// Mock CSV data (converted to JSON for simplicity)
const mockCSVData = [
  { latitude: 7.8, longitude: 30.2, name: "Incident 1", type: "Conflict", date: "2025-03-15T00:00:00Z" },
  { latitude: 8.2, longitude: 30.5, name: "Incident 2", type: "Conflict", date: "2025-03-15T00:00:00Z" },
  { latitude: 8.5, longitude: 29.8, name: "Incident 3", type: "Conflict", date: "2025-03-16T00:00:00Z" },
  { latitude: 7.5, longitude: 29.5, name: "Incident 4", type: "Conflict", date: "2025-03-17T00:00:00Z" },
  { latitude: 7.7, longitude: 30.0, name: "Permanent Incident", type: "Conflict" }, // No date - should be visible on all dates
]

// Mock marker data
const mockMarkerData = [
  { latitude: 7.3, longitude: 30.8, name: "Displacement Camp A", population: 1200, date: "2025-03-15T00:00:00Z" },
  { latitude: 8.7, longitude: 30.3, name: "Displacement Camp B", population: 850, date: "2025-03-16T00:00:00Z" },
  { latitude: 9.1, longitude: 29.7, name: "Displacement Camp C", population: 1500, date: "2025-03-17T00:00:00Z" },
  { latitude: 8.0, longitude: 30.0, name: "Permanent Camp", population: 2000 }, // No date - should be visible on all dates
]

// Mock flood data
const mockFloodData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Flood Zone A",
        severity: "High",
        date: "2025-03-15T00:00:00Z",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [30.0, 6.8],
            [31.0, 6.8],
            [31.0, 7.8],
            [30.0, 7.8],
            [30.0, 6.8],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Permanent Flood Risk Zone",
        severity: "Medium",
        // No date - should be visible on all dates
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [30.5, 7.0],
            [31.5, 7.0],
            [31.5, 8.0],
            [30.5, 8.0],
            [30.5, 7.0],
          ],
        ],
      },
    },
  ],
}

// Mock drought data
const mockDroughtData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Drought Zone A",
        severity: "Medium",
        date: "2025-03-16T00:00:00Z",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [28.5, 8.0],
            [29.5, 8.0],
            [29.5, 9.0],
            [28.5, 9.0],
            [28.5, 8.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Chronic Drought Zone",
        severity: "Low",
        // No date - should be visible on all dates
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [28.0, 8.5],
            [29.0, 8.5],
            [29.0, 9.5],
            [28.0, 9.5],
            [28.0, 8.5],
          ],
        ],
      },
    },
  ],
}

// Mock field operations data
const mockFieldOperationsData = [
  { latitude: 7.9, longitude: 30.4, name: "Field Team Alpha", status: "Active", date: "2025-03-15T00:00:00Z" },
  { latitude: 8.3, longitude: 29.9, name: "Field Team Beta", status: "Active", date: "2025-03-16T00:00:00Z" },
  { latitude: 8.8, longitude: 30.7, name: "Field Team Gamma", status: "Standby", date: "2025-03-17T00:00:00Z" },
  { latitude: 8.0, longitude: 30.5, name: "Permanent Field Team", status: "Active" }, // No date - should be visible on all dates
]

// Mock tile URLs by date for raster layers
const floodwatchTileUrls = {
  "2025-03-15":
    "https://storage.googleapis.com/geoharmony-tiles/march-15-2025-floodwatch-differences-from-historical-mean/{z}/{x}/{y}",
  "2025-03-16":
    "https://storage.googleapis.com/geoharmony-tiles/march-16-2025-floodwatch-differences-from-historical-mean/{z}/{x}/{y}",
  "2025-03-17":
    "https://storage.googleapis.com/geoharmony-tiles/march-17-2025-floodwatch-differences-from-historical-mean/{z}/{x}/{y}",
}

const precipitationTileUrls = {
  "2025-03-15": "https://storage.googleapis.com/geoharmony-tiles/current-precipitation/2025-03-15/{z}/{x}/{y}",
  "2025-03-16": "https://storage.googleapis.com/geoharmony-tiles/current-precipitation/2025-03-16/{z}/{x}/{y}",
  "2025-03-17": "https://storage.googleapis.com/geoharmony-tiles/current-precipitation/2025-03-17/{z}/{x}/{y}",
}

const droughtTileUrls = {
  "2025-03-15": "https://storage.googleapis.com/geoharmony-tiles/drought-severity-index/2025-03-15/{z}/{x}/{y}",
  "2025-03-16": "https://storage.googleapis.com/geoharmony-tiles/drought-severity-index/2025-03-16/{z}/{x}/{y}",
  "2025-03-17": "https://storage.googleapis.com/geoharmony-tiles/drought-severity-index/2025-03-17/{z}/{x}/{y}",
}

export async function fetchLayerData(): Promise<Layer[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [
    {
      id: "conflict-zones",
      name: "Conflict Zones",
      type: "geojson",
      category: "conflict-risk",
      group: "Security",
      tabAssociations: ["conflict-risk", "reports"],
      visible: true,
      data: mockGeoJSON,
      color: "#ff00ff",
    },
    {
      id: "conflict-incidents",
      name: "Conflict Incidents",
      type: "csv",
      category: "conflict-risk",
      group: "Security",
      tabAssociations: ["conflict-risk", "reports"],
      visible: true,
      data: mockCSVData,
      color: "#ff00ff",
    },
    {
      id: "displacement-camps",
      name: "Displacement Camps",
      type: "marker",
      category: "displacement",
      group: "Humanitarian",
      tabAssociations: ["displacement", "reports"],
      visible: false,
      data: mockMarkerData,
      color: "#9c27b0",
    },
    {
      id: "flood-zones",
      name: "Flood Zones",
      type: "geojson",
      category: "flood-impacts",
      group: "Environmental",
      tabAssociations: ["flood-impacts", "reports"],
      visible: false,
      data: mockFloodData,
      color: "#2196f3",
    },
    {
      id: "drought-zones",
      name: "Drought Zones",
      type: "geojson",
      category: "drought-stress",
      group: "Environmental",
      tabAssociations: ["drought-stress", "reports"],
      visible: false,
      data: mockDroughtData,
      color: "#ff9800",
    },
    {
      id: "field-teams",
      name: "Field Teams",
      type: "marker",
      category: "field-operations",
      group: "Operations",
      tabAssociations: ["field-operations", "reports"],
      visible: false,
      data: mockFieldOperationsData,
      color: "#4caf50",
    },
    {
      id: "asis",
      name: "ASIS",
      type: "marker",
      category: "map",
      group: "Base Layers",
      tabAssociations: ["map"],
      visible: false,
      data: [
        { latitude: 8.1, longitude: 30.1, name: "ASIS Point 1", date: "2025-03-15T00:00:00Z" },
        { latitude: 8.4, longitude: 30.4, name: "ASIS Point 2", date: "2025-03-16T00:00:00Z" },
        { latitude: 8.2, longitude: 30.2, name: "Permanent ASIS Point" }, // No date - should be visible on all dates
      ],
      color: "#607d8b",
    },
    {
      id: "march-15-2025-floodwatch",
      name: "Floodwatch",
      type: "raster",
      category: "flood-impacts",
      group: "Environmental",
      tabAssociations: ["flood-impacts", "reports"],
      visible: false,
      tileUrl: floodwatchTileUrls["2025-03-15"], // Default tile URL
      tileUrlsByDate: floodwatchTileUrls,
      color: "#03a9f4",
      opacity: 0.7,
      minZoom: 5,
      maxZoom: 15,
    },
    {
      id: "current-precipitation",
      name: "Current Precipitation",
      type: "raster",
      category: "flood-impacts",
      group: "Weather",
      tabAssociations: ["flood-impacts", "drought-stress"],
      visible: false,
      tileUrl: precipitationTileUrls["2025-03-15"], // Default tile URL
      tileUrlsByDate: precipitationTileUrls,
      color: "#4fc3f7",
      opacity: 0.6,
      minZoom: 4,
      maxZoom: 12,
    },
    {
      id: "drought-severity-index",
      name: "Drought Severity Index",
      type: "raster",
      category: "drought-stress",
      group: "Environmental",
      tabAssociations: ["drought-stress", "reports"],
      visible: false,
      tileUrl: droughtTileUrls["2025-03-16"], // Default tile URL
      tileUrlsByDate: droughtTileUrls,
      color: "#ff9800",
      opacity: 0.8,
      minZoom: 5,
      maxZoom: 14,
    },
  ]
}

