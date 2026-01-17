"use client"

import { useState, useMemo } from "react"
import { formatCurrency } from "@/lib/calculations"
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExampleCalculatorProps {
  aggressiveness: number
  maxIncrease: number
  maxDecrease: number
}

export function ExampleCalculator({ aggressiveness, maxIncrease, maxDecrease }: ExampleCalculatorProps) {
  const [basePrice, setBasePrice] = useState(10000)
  const [gap, setGap] = useState(15)

  const calculation = useMemo(() => {
    const baseMultiplier = aggressiveness / 10
    let priceChange: number

    if (gap > 0) {
      priceChange = gap * 0.5 * baseMultiplier
    } else {
      priceChange = gap * 0.8 * baseMultiplier
    }

    // Apply safety limits
    priceChange = Math.max(priceChange, -maxDecrease)
    priceChange = Math.min(priceChange, maxIncrease)

    const newPrice = basePrice * (1 + priceChange / 100)

    return {
      priceChange,
      newPrice: Math.round(newPrice),
      direction: gap > 0 ? "increase" : gap < 0 ? "decrease" : "none",
    }
  }, [aggressiveness, basePrice, gap, maxIncrease, maxDecrease])

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-base font-semibold text-foreground mb-4">Calculadora en Vivo</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Prueba cómo afecta la agresividad a las recomendaciones de precio
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm text-muted-foreground block mb-1">Precio Base</label>
          <input
            type="number"
            value={basePrice}
            onChange={(e) => setBasePrice(Number(e.target.value))}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground block mb-1">Gap vs Objetivo (%)</label>
          <input
            type="number"
            value={gap}
            onChange={(e) => setGap(Number(e.target.value))}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">Positivo = adelante, Negativo = atrasado</p>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground">Precio Actual</p>
            <p className="text-lg font-semibold text-foreground">{formatCurrency(basePrice)}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Precio Recomendado</p>
            <p
              className={cn(
                "text-lg font-semibold",
                calculation.direction === "increase"
                  ? "text-emerald-600"
                  : calculation.direction === "decrease"
                    ? "text-amber-600"
                    : "text-foreground",
              )}
            >
              {formatCurrency(calculation.newPrice)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          {calculation.direction === "increase" ? (
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          ) : calculation.direction === "decrease" ? (
            <TrendingDown className="h-4 w-4 text-amber-600" />
          ) : null}
          <span
            className={cn(
              "text-sm font-medium",
              calculation.direction === "increase"
                ? "text-emerald-600"
                : calculation.direction === "decrease"
                  ? "text-amber-600"
                  : "text-muted-foreground",
            )}
          >
            {calculation.priceChange > 0 ? "+" : ""}
            {calculation.priceChange.toFixed(1)}%
          </span>
          <span className="text-sm text-muted-foreground">
            ({calculation.direction === "increase" ? "+" : ""}
            {formatCurrency(calculation.newPrice - basePrice)})
          </span>
        </div>
      </div>
    </div>
  )
}
