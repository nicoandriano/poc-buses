import { Navigation } from "@/components/layout/navigation"
import { StatusBadge } from "@/components/shared/status-badge"
import { OccupancyBar } from "@/components/shared/occupancy-bar"
import { PerformanceChart } from "@/components/performance/performance-chart"
import { RecommendationCard } from "@/components/performance/recommendation-card"
import { ServiceMetrics } from "@/components/performance/service-metrics"
import { services, fillingCurves } from "@/lib/mock-data"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface ServiceDetailPageProps {
  params: Promise<{ serviceId: string }>
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { serviceId } = await params
  const service = services.find((s) => s.id === serviceId)

  if (!service) {
    notFound()
  }

  // Get the filling curve for this market (default to weekday)
  const curve = fillingCurves.find((c) => c.marketId === service.marketId && c.pattern === "weekday")
  const curvePoints = curve?.points || []

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/performance"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Performance
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{service.marketName}</h1>
              <p className="text-sm text-muted-foreground">
                Salida: {service.departureTime} - {service.date}
              </p>
            </div>
            <StatusBadge status={service.status} />
          </div>
        </div>

        {/* Metrics */}
        <div className="mb-6">
          <ServiceMetrics service={service} />
        </div>

        {/* Occupancy Bar */}
        <div className="rounded-xl border border-border bg-card p-5 mb-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Ocupación Actual vs Objetivo</h3>
          <OccupancyBar current={service.currentOccupancy} target={service.targetOccupancy} height="lg" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PerformanceChart
              curvePoints={curvePoints}
              currentDays={service.daysUntilDeparture}
              currentOccupancy={service.currentOccupancy}
            />
          </div>
          <div>
            <RecommendationCard service={service} />
          </div>
        </div>
      </main>
    </div>
  )
}
