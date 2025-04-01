export default function AlertTypeFilters() {
  const alertTypes = [
    { type: "FLOOD", color: "#afd3ff" },
    { type: "DROUGHT", color: "#ffe2a8" },
    { type: "CROP", color: "#ffad64" },
    { type: "TRANSHUMANCE", color: "#ef62ff" },
    { type: "CONFLICT", color: "#ff6565" },
    { type: "IDPs", color: "#357981" },
  ]

  return (
    <div className="flex space-x-2 mb-6">
      {alertTypes.map((alert, index) => (
        <button
          key={index}
          className="px-6 py-2 text-[#1e1e1e] rounded-md border border-[#e1e1e1] font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: alert.color }}
        >
          {alert.type}
        </button>
      ))}
    </div>
  )
}

