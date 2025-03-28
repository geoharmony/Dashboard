import type { Alert } from "@/context/map-context"

export const mockAlerts: Alert[] = [
  {
    id: "alert-1",
    title: "Drought Warning",
    description: "Severe drought conditions affecting agricultural activities",
    severity: "warning",
    date: "2026-06-15",
    latitude: 7.55,
    longitude: 30.45,
  },
  {
    id: "alert-2",
    title: "Conflict Alert",
    description: "Reported conflict between herding communities",
    severity: "alert",
    date: "2026-06-15",
    latitude: 4.41,
    longitude: 32.57,
  },
  {
    id: "alert-3",
    title: "Flooding Risk",
    description: "Heavy rainfall causing flooding in low-lying areas",
    severity: "warning",
    date: "2026-07-10",
    latitude: 7.78,
    longitude: 33.0,
  },
  {
    id: "alert-4",
    title: "Food Security Crisis",
    description: "Critical food shortage affecting vulnerable populations",
    severity: "alert",
    date: "2026-10-15",
    admin2_region: "Jonglei",
  },
  {
    id: "alert-5",
    title: "Water Access Dispute",
    description: "Tensions rising over limited water resources",
    severity: "alert",
    date: "2026-02-05",
    admin2_region: "Eastern Equatoria",
  },
]

