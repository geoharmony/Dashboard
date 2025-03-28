// Create a synthetic-narratives.ts file to handle the GeoJSON data
import type { FeatureCollection, Feature, Point } from "geojson"

export interface NarrativeProperties {
  "Narrative ID": string
  Date: string
  Location: string
  Latitude: number
  Longitude: number
  Event: string
  Context: string
  "Dashboard Layers Triggered": string
  "Survey Indicators Triggered": string
  "Dashboard Activity": string
}

export type NarrativeFeature = Feature<Point, NarrativeProperties>
export type NarrativeCollection = FeatureCollection<Point, NarrativeProperties>

// This function would normally fetch from an API
export async function fetchNarrativesData(): Promise<NarrativeCollection> {
  // For this example, we're using the data that was provided in the GeoJSON file
  const narrativesData: NarrativeCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          "Narrative ID": "Y1",
          Date: "2026-06-15",
          Location: "Leer, Unity State",
          Latitude: 7.55,
          Longitude: 30.45,
          Event:
            "Extended drought in Leer dried key water sources. Resource disputes between herding groups led to displacement and violence.",
          Context: "Persistent drought followed by water disputes and displacement.",
          "Dashboard Layers Triggered":
            "Drought Stress (VHI, ASIS), Conflict Risk Today (Resource Conflict), Field Operations (Water Access Survey), Displacement Overview (Local Movement).",
          "Survey Indicators Triggered": "CAD 2.1, 3.1.2, 6.1, Patrol 2.1, 3.1",
          "Dashboard Activity":
            "VHI and ASIS indicators triggered, patrol water scarcity zones logged, conflict marker added to risk map.",
        },
        geometry: {
          type: "Point",
          coordinates: [30.45, 7.55],
        },
      },
      {
        type: "Feature",
        properties: {
          "Narrative ID": "Y2",
          Date: "2026-06-15",
          Location: "Torit, Eastern Equatoria",
          Latitude: 4.41,
          Longitude: 32.57,
          Event:
            "An armyworm infestation, coupled with drought, devastated maize crops near Torit. Tensions rose after accusations of pesticide hoarding by commercial farms.",
          Context: "Crop pest outbreak worsens dry conditions, fueling market instability.",
          "Dashboard Layers Triggered":
            "Crop Stress Overview (ASAP Pest Alerts), Environmental Trends (Market Prices), Conflict Risk Today (Economic Unrest), Field Operations (Civil Affairs Crop Reports).",
          "Survey Indicators Triggered": "CAD 1.1, 4.1, 6.1.1, Patrol 3.1, 4.1",
          "Dashboard Activity":
            "Crop stress and pest layers activated; food price indicators spike; conflict risk overlay triggered.",
        },
        geometry: {
          type: "Point",
          coordinates: [32.57, 4.41],
        },
      },
      {
        type: "Feature",
        properties: {
          "Narrative ID": "Y3",
          Date: "2026-06-25",
          Location: "Akobo, Jonglei State",
          Latitude: 7.78,
          Longitude: 33.0,
          Event:
            "Heavy rainfall triggered flooding and displacement in Akobo. Poor sanitation in makeshift shelters resulted in a localized cholera outbreak.",
          Context: "Early flooding followed by shelter shortages and hygiene crisis.",
          "Dashboard Layers Triggered":
            "Flood Impacts (SAR, UNOSAT), Displacement Overview (Temporary Shelters), Environmental Trends (Health Risk Hotspot), Field Operations (WASH Surveys).",
          "Survey Indicators Triggered": "CAD 3.1.2, 5.1, 6.1, Patrol 2.1, 4.1",
          "Dashboard Activity":
            "Flood zones and shelter layers visualized; health alerts and WASH survey markers added.",
        },
        geometry: {
          type: "Point",
          coordinates: [33.0, 7.78],
        },
      },
      {
        type: "Feature",
        properties: {
          "Narrative ID": "Y4",
          Date: "2026-01-15",
          Location: "Renk, Upper Nile State",
          Latitude: 11.83,
          Longitude: 32.8,
          Event: "Increased returnee arrivals in Renk strained water services, triggering disputes and civil tension.",
          Context: "Dry season water shortages in host community exacerbated by refugee returnees.",
          "Dashboard Layers Triggered":
            "Displacement Overview (Returnees), Drought Stress (Water Scarcity), Conflict Risk Today (Tension Points), Field Operations (WASH Indicators).",
          "Survey Indicators Triggered": "CAD 1.1, 3.1.2, 6.1, 6.1.1, Patrol 2.1, 4.1",
          "Dashboard Activity":
            "Returnee overlays updated, WASH and tension hotspots visualized, conflict alerts triggered.",
        },
        geometry: {
          type: "Point",
          coordinates: [32.8, 11.83],
        },
      },
      {
        type: "Feature",
        properties: {
          "Narrative ID": "Y5",
          Date: "2026-02-15",
          Location: "Kapoeta East, Eastern Equatoria",
          Latitude: 4.77,
          Longitude: 33.59,
          Event:
            "Overlapping cattle migration routes in Kapoeta East led to deadly clashes between youth groups. Drought stress and livestock pressure fueled the violence.",
          Context: "Livestock raiding during dry season transhumance route overlap.",
          "Dashboard Layers Triggered":
            "Conflict Risk Today (Transhumance Conflict), Field Operations (Livestock Tracker), Drought Stress (Vegetation Index), Environmental Trends (Mobility).",
          "Survey Indicators Triggered": "CAD 2.1, 3.1.2, 5.1, 6.1, Patrol 1, 3.1",
          "Dashboard Activity":
            "Vegetation loss visualized; conflict alerts tagged to livestock corridors; mediation markers flagged.",
        },
        geometry: {
          type: "Point",
          coordinates: [33.59, 4.77],
        },
      },
    ],
  }

  return narrativesData
}

// Function to group narratives by their ID
export function groupNarrativesByID(narratives: NarrativeCollection): Record<string, NarrativeFeature[]> {
  return narratives.features.reduce(
    (acc, feature) => {
      const id = feature.properties["Narrative ID"]
      if (!acc[id]) {
        acc[id] = []
      }
      acc[id].push(feature)
      return acc
    },
    {} as Record<string, NarrativeFeature[]>,
  )
}

// Function to filter narratives by date
export function filterNarrativesByDate(narratives: NarrativeCollection, date: Date): NarrativeFeature[] {
  const dateStr = date.toISOString().split("T")[0]
  return narratives.features.filter((feature) => {
    return feature.properties.Date === dateStr
  })
}

