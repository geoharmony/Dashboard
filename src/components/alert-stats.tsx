export default function AlertStats() {
  const alertTypes = [
    { type: "FLOOD", count: 24, color: "#afd3ff" },
    { type: "DROUGHT", count: 15, color: "#ffe2a8" },
    { type: "CROP", count: 11, color: "#ffad64" },
    { type: "TRANSHUMANCE", count: 33, color: "#ef62ff" },
    { type: "CONFLICT", count: 129, color: "#ff6565" },
    { type: "IDPs", count: 41, color: "#357981" },
  ]

  const totalAlerts = alertTypes.reduce((sum, stat) => sum + stat.count, 0)

  return (
    <div className="mb-8">
      {/* Total Alerts Counter */}
      <div className="flex justify-end mb-4">
        <div className="text-right">
          <div className="text-6xl font-light text-gray-400">{totalAlerts}</div>
          <div className="text-2xl font-medium text-gray-400">ALERTS</div>
        </div>
      </div>

      {/* Alert Type Stats with Visual Connection */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        {alertTypes.map((alert, index) => (
          <div key={index} className="flex flex-col rounded overflow-hidden shadow-sm">
            {/* Count Display */}
            <div className="w-full py-2 text-center bg-white border-t border-x border-[#e1e1e1]">
              <div className="text-2xl font-medium">{alert.count}</div>
              <div className="text-xs text-gray-500">ALERTS</div>
            </div>

            {/* Alert Type Button */}
            <div
              className="w-full py-2 text-center font-medium border-b border-x border-[#e1e1e1]"
              style={{ backgroundColor: alert.color }}
            >
              {alert.type}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

