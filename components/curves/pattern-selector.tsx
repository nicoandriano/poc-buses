"use client"

import { cn } from "@/lib/utils"
import type { DayPattern } from "@/types"

interface PatternSelectorProps {
  selected: DayPattern
  onChange: (pattern: DayPattern) => void
}

const patterns: { value: DayPattern; label: string }[] = [
  { value: "weekday", label: "Lun-Jue" },
  { value: "friday", label: "Viernes" },
  { value: "saturday", label: "Sábado" },
  { value: "sunday", label: "Domingo" },
  { value: "holiday", label: "Feriado" },
]

export function PatternSelector({ selected, onChange }: PatternSelectorProps) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-muted/50 p-1">
      {patterns.map((pattern) => (
        <button
          key={pattern.value}
          onClick={() => onChange(pattern.value)}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
            selected === pattern.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {pattern.label}
        </button>
      ))}
    </div>
  )
}
