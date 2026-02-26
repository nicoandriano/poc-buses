"use client"

import { useState } from "react"
import { Navigation } from "@/components/layout/navigation"
import { ServicesTable } from "@/components/performance/services-table"
import { TimelineView } from "@/components/performance/timeline-view"
import { CalendarView } from "@/components/performance/calendar-view"
import { services } from "@/lib/mock-data"
import { Table, CalendarDays, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

type ViewMode = "table" | "timeline" | "calendar"

const viewOptions: { id: ViewMode; label: string; icon: typeof Table }[] = [
  { id: "table", label: "Tabla", icon: Table },
  { id: "timeline", label: "Timeline", icon: BarChart3 },
  { id: "calendar", label: "Calendario", icon: CalendarDays },
]

export default function PerformancePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("table")

  const stats = {
    total: services.length,
    ahead: services.filter((s) => s.status.startsWith("ahead")).length,
    onCurve: services.filter((s) => s.status === "on-curve").length,
    behind: services.filter((s) => s.status.startsWith("behind")).length,
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Performance vs Objetivo</h1>
            <p className="text-sm text-muted-foreground">
              {stats.total} servicios monitoreados | {stats.ahead} adelante, {stats.onCurve} en curva, {stats.behind}{" "}
              atrasados
            </p>
          </div>

          {/* View mode switcher */}
          <div className="flex items-center rounded-lg border border-border bg-muted/30 p-0.5">
            {viewOptions.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setViewMode(id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                  viewMode === id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {viewMode === "table" && <ServicesTable services={services} />}
        {viewMode === "timeline" && <TimelineView services={services} />}
        {viewMode === "calendar" && <CalendarView services={services} />}
      </main>
    </div>
  )
}
