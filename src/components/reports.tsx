import { Download } from "lucide-react"
import AlertsTable from "@/components/alerts-table"
import RegionTabs from "@/components/region-tabs"
import AlertStats from "@/components/alert-stats"
import TimeFilters from "@/components/time-filters"

export function Reports() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <TimeFilters />
        <button className="flex items-center space-x-2 text-[#1e1e1e]">
          <span>SHARE REPORT</span>
          <Download size={18} />
        </button>
      </div>

      {/* Region Tabs */}
      <RegionTabs />

      {/* Alert Stats */}
      <AlertStats />

      {/* Alert Tables */}
      <AlertsTable />
    </main>
  )
}