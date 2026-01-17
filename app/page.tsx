"use client"

import { useState } from "react"
import { Navigation } from "@/components/layout/navigation"
import { KPICard } from "@/components/dashboard/kpi-card"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { TopMarkets } from "@/components/dashboard/top-markets"
import { AlertsSummary } from "@/components/dashboard/alerts-summary"
import { ServicesOverview } from "@/components/dashboard/services-overview"
import { dashboardKPIs, revenueHistory, markets, alerts, services } from "@/lib/mock-data"
import { formatCompactNumber } from "@/lib/calculations"
import { DollarSign, Users, Bus, AlertTriangle, Plane, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Currency } from "@/types"

export default function DashboardPage() {
  const [currency, setCurrency] = useState<Currency>("ARS")

  const revenue = currency === "USD" ? dashboardKPIs.totalRevenueUSD : dashboardKPIs.totalRevenue
  const revenueTarget = currency === "USD" ? dashboardKPIs.revenueTargetUSD : dashboardKPIs.revenueTarget

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Vista general del revenue management</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Moneda:</span>
            <div className="flex rounded-lg border border-border overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrency("ARS")}
                className={`rounded-none h-8 px-3 ${currency === "ARS" ? "bg-primary text-primary-foreground" : ""}`}
              >
                ARS
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrency("USD")}
                className={`rounded-none h-8 px-3 ${currency === "USD" ? "bg-primary text-primary-foreground" : ""}`}
              >
                USD
              </Button>
            </div>
          </div>
        </div>

        {/* KPIs Grid - Updated to use currency toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
          <KPICard
            title="Revenue Total"
            value={formatCompactNumber(revenue, currency)}
            subtitle={`Objetivo: ${formatCompactNumber(revenueTarget, currency)}`}
            trend={{ value: dashboardKPIs.revenueGrowth, label: "vs mes anterior" }}
            icon={DollarSign}
            variant="default"
          />
          <KPICard
            title="Ocupación Promedio"
            value={`${dashboardKPIs.avgOccupancy}%`}
            subtitle={`Objetivo: ${dashboardKPIs.occupancyTarget}%`}
            icon={Users}
            variant={dashboardKPIs.avgOccupancy >= dashboardKPIs.occupancyTarget ? "success" : "warning"}
          />
          <KPICard
            title="Servicios en Curva"
            value={`${dashboardKPIs.servicesOnTarget}/${dashboardKPIs.totalServices}`}
            subtitle={`${dashboardKPIs.servicesBehind} por debajo`}
            icon={Bus}
            variant="default"
          />
          <KPICard
            title="Alertas Activas"
            value={dashboardKPIs.activeAlerts.toString()}
            subtitle={`${dashboardKPIs.criticalAlerts} críticas`}
            icon={AlertTriangle}
            variant={dashboardKPIs.criticalAlerts > 0 ? "danger" : "default"}
          />
          <KPICard
            title="Pasajeros"
            value={dashboardKPIs.totalPax.toLocaleString("es-AR")}
            subtitle={`${dashboardKPIs.totalSeats.toLocaleString("es-AR")} asientos`}
            icon={Plane}
            variant="default"
          />
          <KPICard
            title="Frecuencias"
            value={dashboardKPIs.totalFrequencies.toString()}
            subtitle="Servicios monitoreados"
            icon={Calendar}
            variant="default"
          />
        </div>

        {/* Charts and Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RevenueChart data={revenueHistory} />
            <ServicesOverview services={services} />
          </div>
          <div className="space-y-6">
            <TopMarkets markets={markets} currency={currency} />
            <AlertsSummary alerts={alerts} />
          </div>
        </div>
      </main>
    </div>
  )
}
