import type { Layer } from "@/context/map-context"
import { type FeatureCollection } from "geojson"

import ADMIN1 from "@/data/GAUL_South_Sudan_Admin_Layer1.json"
import ADMIN2 from "@/data/GAUL_South_Sudan_Admin_Layer2.json"
import EVENTS from "@/data/unmiss-events-chronological.json"
import CONFLICT_EVENTS from "@/data/events.json"
import UNMISS from "@/data/UNMISS South Sudan Locations.json"
import IDP_DATA from "@/data/cccm_combined.json"
import FloodPolygon from "@/data/flood060509.json"
import ADM2_CRISIS from "@/data/crisis-events.json"

import { type Alert } from "@/types/alerts"


// Mock tile URLs by date for raster layers
const floodwatchTileUrls = {
  "2026-07-15": "https://storage.googleapis.com/geoharmony-tiles/march-15-2025-floodwatch-differences-from-historical-mean/{z}/{x}/{y}",
  "2026-07-16": "https://storage.googleapis.com/geoharmony-tiles/march-15-2025-floodwatch-differences-from-historical-mean/{z}/{x}/{y}",
  "2026-07-17": "https://storage.googleapis.com/geoharmony-tiles/march-15-2025-floodwatch-differences-from-historical-mean/{z}/{x}/{y}",
}

const precipitationTileUrls = {
  "2026-06-15": "https://storage.googleapis.com/geoharmony-tiles/march-15-2025-floodwatch-differences-from-historical-mean/{z}/{x}/{y}",
  "2026-06-16": "https://storage.googleapis.com/geoharmony-tiles/march-15-2025-floodwatch-differences-from-historical-mean/{z}/{x}/{y}",
  "2026-06-17": "https://storage.googleapis.com/geoharmony-tiles/march-15-2025-floodwatch-differences-from-historical-mean/{z}/{x}/{y}",
}

const droughtTileUrls = {
  "2026-08-15": "https://storage.googleapis.com/geoharmony-tiles/drought-severity-index/2025-03-15/{z}/{x}/{y}",
  "2026-08-16": "https://storage.googleapis.com/geoharmony-tiles/drought-severity-index/2025-03-16/{z}/{x}/{y}",
  "2026-08-17": "https://storage.googleapis.com/geoharmony-tiles/drought-severity-index/2025-03-17/{z}/{x}/{y}",
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function fetchAlertsData(): Promise<Alert[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return EVENTS.map((event) => ({
    ...event,
    date: new Date(event.date),
  })) as Alert[]
}

export async function fetchLayerData(): Promise<Layer[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [
    {
      id: "admin1",
      name: "States",
      type: "geojson",
      category: "Geographic",
      group: "Geographic",
      tabAssociations: [],
      visible: true,
      data: ADMIN1,
      color: "#ff00ff",
    },

    {
      id: "admin2",
      name: "Payam",
      type: "geojson",
      category: "Geographic",
      group: "Geographic",
      tabAssociations: [],
      visible: false,
      data: ADMIN2,
      color: "#ff00ff",
    },
    {
      id: "adm2-crisis",
      name: "Conflict Data",
      type: "geojson",
      category: "Conflict",
      group: "Conflict",
      tabAssociations: ["conflict-risk", "reports"],
      visible: false,
      data: ADM2_CRISIS,
      color: "#333333",
    },
    {
      id: "conflict-events",
      name: "Conflict Events",
      type: "geojson",
      category: "Conflict",
      group: "Conflict",
      tabAssociations: ["conflict-risk", "reports"],
      visible: false,
      data: CONFLICT_EVENTS,
      color: "#333333",
    },
    {
      id: "idp",
      name: "IDP",
      type: "geojson",
      category: "Humanitarian",
      group: "Humanitarian",
      tabAssociations: [],
      visible: false,
      data: IDP_DATA,
      color: "#00FF00",
    },
    {
      id: "unmiss",
      name: "UNMISS",
      type: "geojson",
      category: "Humanitarian",
      group: "Humanitarian",
      tabAssociations: [],
      visible: true,
      data: UNMISS,
      color: "#00FF00",
    },
    {
      id: "floodwatch",
      name: "Floodwatch",
      type: "raster",
      category: "Environmental",
      group: "Environmental",
      tabAssociations: ["flood-impacts", "reports"],
      visible: false,
      tileUrl: floodwatchTileUrls["2026-07-15"], // Default tile URL
      tileUrlsByDate: floodwatchTileUrls,
      color: "#03a9f4",
      opacity: 0.7,
      minZoom: 0,
      maxZoom: 13,
    },
    {
      id: "flood",
      name: "Flood",
      type: "geojson",
      category: "Environmental",
      group: "Environmental",
      tabAssociations: [],
      visible: false,
      data: FloodPolygon,
      color: "#00FF00",
    },
    {
      id: "populated_places",
      name: "Populated Places",
      type: "geojson",
      category: "Geographic",
      group: "Geographic",
      tabAssociations: [],
      visible: false,
      data: [],
      color: "#00FF00",
    },
    // {
    //   id: "current-precipitation",
    //   name: "Current Precipitation",
    //   type: "raster",
    //   category: "flood-impacts",
    //   group: "Weather",
    //   tabAssociations: ["flood-impacts", "drought-stress"],
    //   visible: false,
    //   tileUrl: precipitationTileUrls["2026-06-15"], // Default tile URL
    //   tileUrlsByDate: precipitationTileUrls,
    //   color: "#4fc3f7",
    //   opacity: 0.6,
    //   minZoom: 0,
    //   maxZoom: 13,
    // },
    // {
    //   id: "drought-severity-index",
    //   name: "Drought Severity Index",
    //   type: "raster",
    //   category: "Environmental",
    //   group: "Environmental",
    //   tabAssociations: ["drought-stress", "reports"],
    //   visible: false,
    //   tileUrl: droughtTileUrls["2026-08-15"], // Default tile URL
    //   tileUrlsByDate: droughtTileUrls,
    //   color: "#ff9800",
    //   opacity: 0.8,
    //   minZoom: 0,
    //   maxZoom: 13,
    // },
  ]
}

