"use client"

import { useState } from "react"
import { Navigation } from "@/components/layout/navigation"
import { CurveChart } from "@/components/curves/curve-chart"
import { PointsTable } from "@/components/curves/points-table"
import { MarketSelector } from "@/components/shared/market-selector"
import { ClusterManager } from "@/components/curves/cluster-manager"
import { ClusterSelector } from "@/components/curves/cluster-selector"
import { ZoneConfigEditor } from "@/components/curves/zone-config-editor"
import { markets, fillingCurves, clusters as initialClusters, defaultZoneConfig } from "@/lib/mock-data"
import type { CurvePoint, Cluster, CurveZoneConfig } from "@/types"
import { Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function CurvesPage() {
  const [selectedMarket, setSelectedMarket] = useState(markets[0].id)
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null)
  const [clusters, setClusters] = useState<Cluster[]>(initialClusters)
  const [curves, setCurves] = useState(fillingCurves)
  const [zoneConfig, setZoneConfig] = useState<CurveZoneConfig>(defaultZoneConfig)

  const currentCurve = curves.find((c) => c.marketId === selectedMarket && c.pattern === "weekday")
  const points = currentCurve?.points || []

  const activeCluster = selectedCluster ? clusters.find((c) => c.id === selectedCluster) : null
  const marketClusters = clusters.filter((c) => c.marketId === "all" || c.marketId === selectedMarket)

  const handleUpdatePoint = (updated: CurvePoint) => {
    setCurves((prev) =>
      prev.map((curve) => {
        if (curve.marketId === selectedMarket && curve.pattern === "weekday") {
          return {
            ...curve,
            points: curve.points.map((p) => (p.daysBeforeDeparture === updated.daysBeforeDeparture ? updated : p)),
          }
        }
        return curve
      }),
    )
  }

  const handleSaveZoneConfig = (config: CurveZoneConfig) => {
    setZoneConfig(config)
    setCurves((prev) => prev.map((curve) => ({ ...curve, zoneConfig: config })))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Curvas de Llenado</h1>
          <p className="text-sm text-muted-foreground">
            Define los objetivos de ocupación por días antes de salida (hasta 60 días de AP)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with clusters */}
          <div className="lg:col-span-1 space-y-4">
            <ClusterManager
              clusters={marketClusters}
              markets={markets}
              selectedCluster={selectedCluster}
              onSelectCluster={setSelectedCluster}
              onUpdateClusters={setClusters}
            />
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <MarketSelector markets={markets} selected={selectedMarket} onChange={setSelectedMarket} />
              <ClusterSelector clusters={marketClusters} selected={selectedCluster} onChange={setSelectedCluster} />
              <div className="ml-auto">
                <ZoneConfigEditor config={zoneConfig} onSave={handleSaveZoneConfig} />
              </div>
            </div>

            {/* Active cluster info */}
            {activeCluster && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Cluster activo: {activeCluster.name}</p>
                    <p className="text-sm text-blue-700 mt-1">{activeCluster.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {activeCluster.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Zone legend */}
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm font-medium mb-3">Zonas de desviación</p>
              <div className="flex flex-wrap gap-3">
                {zoneConfig.zones
                  .sort((a, b) => b.level - a.level)
                  .map((zone) => (
                    <div key={zone.id} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: zone.color }} />
                      <span className="text-xs text-muted-foreground">
                        {zone.name} ({zone.level > 0 ? "+" : ""}
                        {zone.minDeviation}% a {zone.maxDeviation > 50 ? "∞" : zone.maxDeviation + "%"})
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {points.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="xl:col-span-2 rounded-xl border border-border bg-card p-5">
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-foreground">Curva de Ocupación Esperada</h3>
                    <p className="text-sm text-muted-foreground">
                      {markets.find((m) => m.id === selectedMarket)?.name}
                      {activeCluster ? ` - ${activeCluster.name}` : " - Curva Base"}
                    </p>
                  </div>
                  <CurveChart points={points} zoneConfig={zoneConfig} />
                  <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-0.5 w-6 bg-blue-500 rounded" />
                      <span className="text-muted-foreground">Objetivo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-0.5 w-6 bg-slate-400 rounded" style={{ borderStyle: "dashed" }} />
                      <span className="text-muted-foreground">Tolerancia (±{zoneConfig.tolerance}%)</span>
                    </div>
                  </div>
                </div>

                {/* Points Table */}
                <div>
                  <div className="mb-3">
                    <h3 className="text-base font-semibold text-foreground">Puntos de la Curva</h3>
                    <p className="text-sm text-muted-foreground">Click en editar para modificar</p>
                  </div>
                  <PointsTable points={points} onUpdatePoint={handleUpdatePoint} />
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <p className="text-muted-foreground">No hay curva definida para este mercado.</p>
                <p className="text-sm text-muted-foreground mt-1">Selecciona otro mercado o crea una nueva curva.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
