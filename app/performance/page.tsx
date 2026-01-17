import { Navigation } from "@/components/layout/navigation"
import { ServicesTable } from "@/components/performance/services-table"
import { services } from "@/lib/mock-data"

export default function PerformancePage() {
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Performance vs Objetivo</h1>
          <p className="text-sm text-muted-foreground">
            {stats.total} servicios monitoreados | {stats.ahead} adelante, {stats.onCurve} en curva, {stats.behind}{" "}
            atrasados
          </p>
        </div>

        <ServicesTable services={services} />
      </main>
    </div>
  )
}
