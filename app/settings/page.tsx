"use client"

import { useState } from "react"
import { Navigation } from "@/components/layout/navigation"
import { AggressivenessSlider } from "@/components/settings/aggressiveness-slider"
import { ExampleCalculator } from "@/components/settings/example-calculator"
import { MarketOverrides } from "@/components/settings/market-overrides"
import { SafetyLimits } from "@/components/settings/safety-limits"
import { aggressivenessConfig as initialConfig, markets } from "@/lib/mock-data"
import type { AggressivenessConfig } from "@/types"
import { Button } from "@/components/ui/button"
import { Save, RotateCcw } from "lucide-react"

export default function SettingsPage() {
  const [config, setConfig] = useState<AggressivenessConfig>(initialConfig)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    setConfig(initialConfig)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Configuración de Agresividad</h1>
            <p className="text-sm text-muted-foreground">
              Define qué tan agresivo es el sistema al recomendar cambios de precio
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Restaurar
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              {saved ? "Guardado" : "Guardar"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Global Aggressiveness */}
            <div className="rounded-xl border border-border bg-card p-5">
              <AggressivenessSlider
                value={config.global}
                onChange={(value) => setConfig({ ...config, global: value })}
                label="Agresividad Global"
                description="Valor base aplicado a todos los mercados"
              />
            </div>

            {/* Market Overrides */}
            <MarketOverrides
              markets={markets}
              overrides={config.marketOverrides}
              globalValue={config.global}
              onChange={(overrides) => setConfig({ ...config, marketOverrides: overrides })}
            />

            {/* Safety Limits */}
            <SafetyLimits
              limits={config.safetyLimits}
              onChange={(limits) => setConfig({ ...config, safetyLimits: limits })}
            />
          </div>

          {/* Right Column - Calculator */}
          <div>
            <ExampleCalculator
              aggressiveness={config.global}
              maxIncrease={config.safetyLimits.maxPriceIncrease}
              maxDecrease={config.safetyLimits.maxPriceDecrease}
            />

            {/* Info Card */}
            <div className="mt-6 rounded-xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold text-foreground mb-3">Cómo funciona</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">Nivel 1-3: Conservador</p>
                  <p>Cambios de precio pequeños y graduales. Ideal para mercados sensibles al precio.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Nivel 4-6: Moderado</p>
                  <p>Balance entre capturar revenue y mantener demanda estable.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Nivel 7-10: Agresivo</p>
                  <p>Maximiza revenue en alta demanda. Mayor riesgo de volatilidad.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
