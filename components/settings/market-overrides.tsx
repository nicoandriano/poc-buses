"use client"

import type { Market } from "@/types"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface MarketOverridesProps {
  markets: Market[]
  overrides: Record<string, number>
  globalValue: number
  onChange: (overrides: Record<string, number>) => void
}

export function MarketOverrides({ markets, overrides, globalValue, onChange }: MarketOverridesProps) {
  const [showAdd, setShowAdd] = useState(false)

  const marketsWithOverrides = markets.filter((m) => m.id in overrides)
  const marketsWithoutOverrides = markets.filter((m) => !(m.id in overrides))

  const handleUpdate = (marketId: string, value: number) => {
    onChange({ ...overrides, [marketId]: value })
  }

  const handleRemove = (marketId: string) => {
    const newOverrides = { ...overrides }
    delete newOverrides[marketId]
    onChange(newOverrides)
  }

  const handleAdd = (marketId: string) => {
    onChange({ ...overrides, [marketId]: globalValue })
    setShowAdd(false)
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Excepciones por Mercado</h3>
          <p className="text-sm text-muted-foreground">Configura agresividad diferente para mercados específicos</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="h-4 w-4 mr-1" />
          Agregar
        </Button>
      </div>

      {showAdd && marketsWithoutOverrides.length > 0 && (
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Seleccionar mercado:</p>
          <div className="flex flex-wrap gap-2">
            {marketsWithoutOverrides.map((market) => (
              <Button key={market.id} variant="outline" size="sm" onClick={() => handleAdd(market.id)}>
                {market.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {marketsWithOverrides.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <p>No hay excepciones configuradas</p>
          <p className="text-sm">Todos los mercados usan el valor global ({globalValue})</p>
        </div>
      ) : (
        <div className="space-y-4">
          {marketsWithOverrides.map((market) => {
            const value = overrides[market.id]
            const diff = value - globalValue

            return (
              <div key={market.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-foreground truncate">{market.name}</span>
                    {diff !== 0 && (
                      <span
                        className={cn(
                          "text-xs px-1.5 py-0.5 rounded",
                          diff > 0 ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700",
                        )}
                      >
                        {diff > 0 ? "+" : ""}
                        {diff} vs global
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[value]}
                      onValueChange={([val]) => handleUpdate(market.id, val)}
                      min={1}
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-8 text-center font-semibold text-foreground">{value}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 shrink-0"
                  onClick={() => handleRemove(market.id)}
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
