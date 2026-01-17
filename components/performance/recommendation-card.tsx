"use client"

import { useState } from "react"
import type { Service } from "@/types"
import { formatCurrency, getStatusColor } from "@/lib/calculations"
import { TrendingUp, TrendingDown, Check, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RecommendationCardProps {
  service: Service
}

export function RecommendationCard({ service }: RecommendationCardProps) {
  const [applied, setApplied] = useState(false)
  const [rejected, setRejected] = useState(false)

  const priceIncrease = service.recommendedPrice > service.currentPrice
  const priceDiff = service.recommendedPrice - service.currentPrice
  const priceDiffPercent = (priceDiff / service.currentPrice) * 100

  if (applied) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-emerald-100 p-2">
            <Check className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="font-medium text-emerald-900">Recomendación aplicada</p>
            <p className="text-sm text-emerald-700">Precio actualizado a {formatCurrency(service.recommendedPrice)}</p>
          </div>
        </div>
      </div>
    )
  }

  if (rejected) {
    return (
      <div className="rounded-xl border border-border bg-muted/50 p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-muted p-2">
            <X className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">Recomendación rechazada</p>
            <p className="text-sm text-muted-foreground">Se mantendrá el precio actual</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Recomendación de Precio</h3>
          <p className="text-sm text-muted-foreground">Basado en curva de llenado y velocidad de venta</p>
        </div>
        <div className={cn("rounded-full p-2", priceIncrease ? "bg-emerald-100" : "bg-amber-100")}>
          {priceIncrease ? (
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          ) : (
            <TrendingDown className="h-5 w-5 text-amber-600" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Precio Actual</p>
          <p className="text-lg font-semibold text-foreground">{formatCurrency(service.currentPrice)}</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className={cn("text-sm font-medium", priceIncrease ? "text-emerald-600" : "text-amber-600")}>
            {priceIncrease ? "+" : ""}
            {formatCurrency(priceDiff)}
          </div>
          <div className="text-xs text-muted-foreground">
            ({priceIncrease ? "+" : ""}
            {priceDiffPercent.toFixed(1)}%)
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-1">Precio Recomendado</p>
          <p className={cn("text-lg font-semibold", priceIncrease ? "text-emerald-600" : "text-amber-600")}>
            {formatCurrency(service.recommendedPrice)}
          </p>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-3 mb-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="text-sm text-muted-foreground">
            {priceIncrease ? (
              <>
                La ocupación actual ({service.currentOccupancy}%) está{" "}
                <span className={getStatusColor(service.status)}>{service.gap}pts por encima</span> del objetivo. Se
                recomienda aumentar el precio para optimizar revenue.
              </>
            ) : (
              <>
                La ocupación actual ({service.currentOccupancy}%) está{" "}
                <span className={getStatusColor(service.status)}>{Math.abs(service.gap)}pts por debajo</span> del
                objetivo. Se recomienda reducir el precio para estimular ventas.
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={() => setApplied(true)} className="flex-1">
          <Check className="h-4 w-4 mr-2" />
          Aplicar Recomendación
        </Button>
        <Button variant="outline" onClick={() => setRejected(true)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
