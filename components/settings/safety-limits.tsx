"use client"

import type { AggressivenessConfig } from "@/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield } from "lucide-react"

interface SafetyLimitsProps {
  limits: AggressivenessConfig["safetyLimits"]
  onChange: (limits: AggressivenessConfig["safetyLimits"]) => void
}

export function SafetyLimits({ limits, onChange }: SafetyLimitsProps) {
  const handleChange = (key: keyof AggressivenessConfig["safetyLimits"], value: number) => {
    onChange({ ...limits, [key]: value })
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-base font-semibold text-foreground">Límites de Seguridad</h3>
          <p className="text-sm text-muted-foreground">Restricciones para evitar cambios extremos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="maxIncrease">Aumento máximo (%)</Label>
          <Input
            id="maxIncrease"
            type="number"
            min={0}
            max={100}
            value={limits.maxPriceIncrease}
            onChange={(e) => handleChange("maxPriceIncrease", Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground mt-1">Máximo aumento de precio permitido</p>
        </div>

        <div>
          <Label htmlFor="maxDecrease">Disminución máxima (%)</Label>
          <Input
            id="maxDecrease"
            type="number"
            min={0}
            max={100}
            value={limits.maxPriceDecrease}
            onChange={(e) => handleChange("maxPriceDecrease", Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground mt-1">Máxima reducción de precio permitida</p>
        </div>

        <div>
          <Label htmlFor="minPrice">Precio mínimo ($)</Label>
          <Input
            id="minPrice"
            type="number"
            min={0}
            value={limits.minPrice}
            onChange={(e) => handleChange("minPrice", Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground mt-1">Piso absoluto de precio</p>
        </div>

        <div>
          <Label htmlFor="maxPrice">Precio máximo ($)</Label>
          <Input
            id="maxPrice"
            type="number"
            min={0}
            value={limits.maxPrice}
            onChange={(e) => handleChange("maxPrice", Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground mt-1">Techo absoluto de precio</p>
        </div>
      </div>
    </div>
  )
}
