"use client"

import { useMemo, useState } from "react"
import type { Service, ServiceStatus } from "@/types"
import { StatusBadge } from "@/components/shared/status-badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { markets } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface TimelineViewProps {
  services: Service[]
}

const statusOrder: ServiceStatus[] = [
  "ahead-3", "ahead-2", "ahead-1", "on-curve",
  "behind-1", "behind-2", "behind-3",
]

const statusLabels: Record<ServiceStatus, string> = {
  "ahead-3": "Muy Adelante",
  "ahead-2": "Adelante",
  "ahead-1": "Lev. Adelante",
  "on-curve": "En Curva",
  "behind-1": "Lev. Atrasado",
  "behind-2": "Atrasado",
  "behind-3": "Muy Atrasado",
}

const statusBarColors: Record<ServiceStatus, string> = {
  "ahead-3": "bg-emerald-600",
  "ahead-2": "bg-emerald-400",
  "ahead-1": "bg-teal-300",
  "on-curve": "bg-blue-500",
  "behind-1": "bg-amber-400",
  "behind-2": "bg-orange-500",
  "behind-3": "bg-red-600",
}

const statusBgColors: Record<ServiceStatus, string> = {
  "ahead-3": "bg-emerald-50",
  "ahead-2": "bg-emerald-50/50",
  "ahead-1": "bg-teal-50/50",
  "on-curve": "bg-blue-50",
  "behind-1": "bg-amber-50",
  "behind-2": "bg-orange-50",
  "behind-3": "bg-red-50",
}

export function TimelineView({ services }: TimelineViewProps) {
  const [filterMarket, setFilterMarket] = useState("all")

  const filteredServices = useMemo(() => {
    if (filterMarket === "all") return services
    return services.filter((s) => s.marketId === filterMarket)
  }, [services, filterMarket])

  // Group services by date
  const dateGroups = useMemo(() => {
    const groups: Record<string, Service[]> = {}
    filteredServices.forEach((s) => {
      if (!groups[s.date]) groups[s.date] = []
      groups[s.date].push(s)
    })
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [filteredServices])

  // For the overall summary stacked bar
  const overallDistribution = useMemo(() => {
    const counts: Record<ServiceStatus, number> = {} as Record<ServiceStatus, number>
    statusOrder.forEach((s) => (counts[s] = 0))
    filteredServices.forEach((s) => counts[s.status]++)
    const total = filteredServices.length
    return statusOrder.map((status) => ({
      status,
      count: counts[status],
      percentage: total > 0 ? (counts[status] / total) * 100 : 0,
    }))
  }, [filteredServices])

  function getDistribution(svcs: Service[]) {
    const counts: Record<ServiceStatus, number> = {} as Record<ServiceStatus, number>
    statusOrder.forEach((s) => (counts[s] = 0))
    svcs.forEach((s) => counts[s.status]++)
    const total = svcs.length
    return statusOrder.map((status) => ({
      status,
      count: counts[status],
      percentage: total > 0 ? (counts[status] / total) * 100 : 0,
    }))
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr + "T12:00:00")
    return d.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" })
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Distribucion Temporal</h3>
          <p className="text-sm text-muted-foreground">
            {filteredServices.length} servicios por fecha de salida
          </p>
        </div>
        <Select value={filterMarket} onValueChange={setFilterMarket}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Mercado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los mercados</SelectItem>
            {markets.map((m) => (
              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Overall summary */}
      <div className="p-4 border-b border-border">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Resumen General</p>
        <div className="flex h-8 rounded-lg overflow-hidden">
          {overallDistribution.map(({ status, percentage, count }) =>
            count > 0 ? (
              <div
                key={status}
                className={cn("flex items-center justify-center transition-all", statusBarColors[status])}
                style={{ width: `${percentage}%` }}
                title={`${statusLabels[status]}: ${count} (${percentage.toFixed(1)}%)`}
              >
                {percentage > 8 && (
                  <span className="text-[11px] font-semibold text-white drop-shadow-sm">
                    {count}
                  </span>
                )}
              </div>
            ) : null,
          )}
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
          {overallDistribution.map(({ status, count, percentage }) =>
            count > 0 ? (
              <div key={status} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={cn("h-2.5 w-2.5 rounded-sm shrink-0", statusBarColors[status])} />
                <span>{statusLabels[status]}</span>
                <span className="font-medium text-foreground">{count}</span>
                <span>({percentage.toFixed(0)}%)</span>
              </div>
            ) : null,
          )}
        </div>
      </div>

      {/* Timeline rows */}
      <div className="divide-y divide-border">
        {dateGroups.map(([date, svcs]) => {
          const dist = getDistribution(svcs)
          return (
            <div key={date} className="px-4 py-3">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-28 shrink-0">
                  <p className="text-sm font-medium text-foreground">{formatDate(date)}</p>
                  <p className="text-xs text-muted-foreground">{svcs.length} servicios</p>
                </div>
                <div className="flex-1 flex h-6 rounded-md overflow-hidden">
                  {dist.map(({ status, percentage, count }) =>
                    count > 0 ? (
                      <div
                        key={status}
                        className={cn("flex items-center justify-center transition-all", statusBarColors[status])}
                        style={{ width: `${percentage}%` }}
                        title={`${statusLabels[status]}: ${count}`}
                      >
                        {percentage > 10 && (
                          <span className="text-[10px] font-semibold text-white drop-shadow-sm">
                            {count}
                          </span>
                        )}
                      </div>
                    ) : null,
                  )}
                </div>
              </div>
              {/* Small service pills */}
              <div className="flex flex-wrap gap-1 ml-28 pl-4">
                {svcs.map((s) => (
                  <div
                    key={s.id}
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-medium",
                      statusBgColors[s.status],
                    )}
                    title={`${s.marketName} ${s.departureTime} - Gap: ${s.gap > 0 ? "+" : ""}${s.gap}%`}
                  >
                    {s.departureTime} {s.marketName.split(" - ")[1]?.slice(0, 3)}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
