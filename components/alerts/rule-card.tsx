"use client"

import { cn } from "@/lib/utils"
import type { AlertRule } from "@/types"
import { Switch } from "@/components/ui/switch"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RuleCardProps {
  rule: AlertRule
  onToggle?: (id: string, enabled: boolean) => void
  onEdit?: (rule: AlertRule) => void
  onDelete?: (id: string) => void
}

export function RuleCard({ rule, onToggle, onEdit, onDelete }: RuleCardProps) {
  const typeLabels = {
    occupation: "Ocupación",
    competition: "Competencia",
    demand: "Demanda",
    price: "Precio",
  }

  const conditionLabels: Record<string, string> = {
    below_target: "Por debajo del objetivo",
    above_target: "Por encima del objetivo",
    velocity_above: "Velocidad por encima de",
    velocity_below: "Velocidad por debajo de",
  }

  const severityConfig = {
    critical: { label: "Crítica", bg: "bg-red-100 text-red-700" },
    warning: { label: "Advertencia", bg: "bg-amber-100 text-amber-700" },
    info: { label: "Info", bg: "bg-blue-100 text-blue-700" },
  }

  return (
    <div className={cn("rounded-xl border border-border bg-card p-4", !rule.enabled && "opacity-60")}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-foreground">{rule.name}</span>
            <span className={cn("px-2 py-0.5 rounded text-xs font-medium", severityConfig[rule.severity].bg)}>
              {severityConfig[rule.severity].label}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {typeLabels[rule.type]}: {conditionLabels[rule.condition] || rule.condition}{" "}
            <span className="font-medium text-foreground">{rule.threshold}%</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEdit?.(rule)}>
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onDelete?.(rule.id)}>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Switch checked={rule.enabled} onCheckedChange={(checked) => onToggle?.(rule.id, checked)} />
        </div>
      </div>
    </div>
  )
}
