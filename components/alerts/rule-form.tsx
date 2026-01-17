"use client"

import type React from "react"

import { useState } from "react"
import type { AlertRule, AlertType, AlertSeverity } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface RuleFormProps {
  rule?: AlertRule
  onSave: (rule: Omit<AlertRule, "id">) => void
  onCancel: () => void
}

export function RuleForm({ rule, onSave, onCancel }: RuleFormProps) {
  const [name, setName] = useState(rule?.name || "")
  const [type, setType] = useState<AlertType>(rule?.type || "occupation")
  const [condition, setCondition] = useState(rule?.condition || "below_target")
  const [threshold, setThreshold] = useState(rule?.threshold || 10)
  const [severity, setSeverity] = useState<AlertSeverity>(rule?.severity || "warning")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      type,
      condition,
      threshold,
      severity,
      enabled: true,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-xl border border-border shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">{rule ? "Editar Regla" : "Nueva Regla"}</h3>
          <button onClick={onCancel} className="p-1 hover:bg-muted rounded transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <Label htmlFor="name">Nombre de la regla</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Ocupación crítica baja"
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Tipo de alerta</Label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as AlertType)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="occupation">Ocupación</option>
              <option value="demand">Demanda</option>
              <option value="competition">Competencia</option>
              <option value="price">Precio</option>
            </select>
          </div>

          <div>
            <Label htmlFor="condition">Condición</Label>
            <select
              id="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="below_target">Por debajo del objetivo</option>
              <option value="above_target">Por encima del objetivo</option>
              <option value="velocity_above">Velocidad por encima de</option>
              <option value="velocity_below">Velocidad por debajo de</option>
            </select>
          </div>

          <div>
            <Label htmlFor="threshold">Umbral (%)</Label>
            <Input
              id="threshold"
              type="number"
              min={1}
              max={100}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="severity">Severidad</Label>
            <select
              id="severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value as AlertSeverity)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="critical">Crítica</option>
              <option value="warning">Advertencia</option>
              <option value="info">Informativa</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" className="flex-1">
              {rule ? "Guardar Cambios" : "Crear Regla"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
