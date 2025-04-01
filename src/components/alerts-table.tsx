import type { AlertType } from "@/types/alerts"

export default function AlertsTable() {
  // Alert types with their colors for consistent styling
  const alertTypeStyles: Record<string, { color: string }> = {
    FLOOD: { color: "#afd3ff" },
    DROUGHT: { color: "#ffe2a8" },
    CROP: { color: "#ffad64" },
    TRANSHUMANCE: { color: "#ef62ff" },
    CONFLICT: { color: "#ff6565" },
    IDPs: { color: "#357981" },
  }

  // Sample data for the alerts table based on South Sudan counties and payams
  const alertEntries = [
    {
      id: 1,
      alerts: ["FLOOD", "CONFLICT"] as AlertType[],
      date: "15 Mar 2023",
      county: "Juba",
      payam: "Munuki",
      timeline: "Y1",
      sources: "UNMISS Field Report, Local NGO",
    },
    {
      id: 2,
      alerts: ["DROUGHT", "IDPs", "CONFLICT"] as AlertType[],
      date: "12 Mar 2023",
      county: "Wau",
      payam: "Bagari",
      timeline: "Y9",
      sources: "WFP Assessment, OCHA",
    },
    {
      id: 3,
      alerts: ["FLOOD"] as AlertType[],
      date: "10 Mar 2023",
      county: "Bor South",
      payam: "Makuach",
      timeline: "Y1",
      sources: "UNMISS Field Report",
    },
  ]

  return (
    <div className="space-y-6">
      {alertEntries.map((entry) => (
        <div key={entry.id} className="border border-[#e1e1e1] rounded overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-5 bg-[#f3f3f3]">
            <div className="px-4 py-3 font-medium">Date</div>
            <div className="px-4 py-3 font-medium">County</div>
            <div className="px-4 py-3 font-medium">Payam</div>
            <div className="px-4 py-3 font-medium">Timeline {entry.timeline}</div>
            <div className="px-4 py-3 font-medium">Sources</div>
          </div>

          {/* Table Content */}
          <div className="grid grid-cols-5">
            {/* First column with alert types and date */}
            <div className="bg-[#e7e7e7] p-4">
              <div className="mb-2 text-sm">{entry.date}</div>
              <div className="space-y-2">
                {entry.alerts.map((alertType, alertIndex) => (
                  <div
                    key={alertIndex}
                    className="px-4 py-2 text-center rounded"
                    style={{ backgroundColor: alertTypeStyles[alertType].color }}
                  >
                    {alertType}
                  </div>
                ))}
              </div>
            </div>

            {/* County Column */}
            <div className="bg-white p-4 flex items-center">
              <div className="text-sm">{entry.county}</div>
            </div>

            {/* Payam Column */}
            <div className="bg-white p-4 flex items-center">
              <div className="text-sm">{entry.payam}</div>
            </div>

            {/* Timeline Column */}
            <div className="bg-white p-4 flex items-center justify-center">
              <div className="text-sm">Timeline data for {entry.timeline}</div>
            </div>

            {/* Sources Column */}
            <div className="bg-white p-4 flex items-center">
              <div className="text-sm">{entry.sources}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

