import type * as GeoJSON from "geojson"

// Function to fetch GeoJSON data from a URL
export async function fetchGeoJSON(url: string): Promise<GeoJSON.FeatureCollection> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch GeoJSON: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching GeoJSON:", error)
    // Return an empty feature collection as fallback
    return { type: "FeatureCollection", features: [] }
  }
}

