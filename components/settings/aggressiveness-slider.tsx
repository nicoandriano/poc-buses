"use client"

import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

interface AggressivenessSliderProps {
  value: number
  onChange: (value: number) => void
  label?: string
  description?: string
}

export function AggressivenessSlider({ value, onChange, label, description }: AggressivenessSliderProps) {
  const getLabel = (val: number) => {
    if (val <= 2) return { text: "Muy Conservador", color: "text-blue-600" }
    if (val <= 4) return { text: "Conservador", color: "text-cyan-600" }
    if (val <= 6) return { text: "Moderado", color: "text-emerald-600" }
    if (val <= 8) return { text: "Agresivo", color: "text-amber-600" }
    return { text: "Muy Agresivo", color: "text-red-600" }
  }

  const labelInfo = getLabel(value)

  return (
    <div className="space-y-4">
      {label && (
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">{label}</p>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-foreground">{value}</span>
            <span className="text-sm text-muted-foreground">/10</span>
            <p className={cn("text-sm font-medium", labelInfo.color)}>{labelInfo.text}</p>
          </div>
        </div>
      )}

      <div className="pt-2">
        <Slider value={[value]} onValueChange={([val]) => onChange(val)} min={1} max={10} step={1} className="w-full" />

        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>1 - Conservador</span>
          <span>5 - Moderado</span>
          <span>10 - Agresivo</span>
        </div>
      </div>
    </div>
  )
}
