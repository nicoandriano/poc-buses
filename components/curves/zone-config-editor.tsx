"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Settings2, Save } from "lucide-react"
import type { CurveZoneConfig, CurveZone } from "@/types"

interface ZoneConfigEditorProps {
  config: CurveZoneConfig
  onSave: (config: CurveZoneConfig) => void
}

export function ZoneConfigEditor({ config, onSave }: ZoneConfigEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editedConfig, setEditedConfig] = useState<CurveZoneConfig>(config)

  const handleZoneChange = (zoneId: string, field: keyof CurveZone, value: number | string) => {
    setEditedConfig((prev) => ({
      ...prev,
      zones: prev.zones.map((z) => (z.id === zoneId ? { ...z, [field]: value } : z)),
    }))
  }

  const handleSave = () => {
    onSave(editedConfig)
    setIsOpen(false)
  }

  // Sort zones by level descending (ahead-3 first, behind-3 last)
  const sortedZones = [...editedConfig.zones].sort((a, b) => b.level - a.level)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="h-4 w-4 mr-2" />
          Configurar Zonas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configuración de Zonas de Desviación</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Tolerancia base (zona "En curva")</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={editedConfig.tolerance}
                onChange={(e) =>
                  setEditedConfig((prev) => ({
                    ...prev,
                    tolerance: Number(e.target.value),
                  }))
                }
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">% (+/-)</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Umbrales de zonas</Label>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium">Zona</th>
                    <th className="text-left p-3 font-medium">Nivel</th>
                    <th className="text-left p-3 font-medium">Desde %</th>
                    <th className="text-left p-3 font-medium">Hasta %</th>
                    <th className="text-left p-3 font-medium">Color</th>
                    <th className="text-left p-3 font-medium">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedZones.map((zone) => (
                    <tr key={zone.id} className="border-t">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: zone.color }} />
                          <span className="font-medium">{zone.name}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`font-mono ${
                            zone.level > 0 ? "text-green-600" : zone.level < 0 ? "text-red-600" : "text-blue-600"
                          }`}
                        >
                          {zone.level > 0 ? `+${zone.level}` : zone.level}
                        </span>
                      </td>
                      <td className="p-3">
                        {zone.level !== 3 && zone.level !== -3 ? (
                          <Input
                            type="number"
                            value={zone.minDeviation}
                            onChange={(e) => handleZoneChange(zone.id, "minDeviation", Number(e.target.value))}
                            className="w-20 h-8"
                          />
                        ) : (
                          <span className="text-muted-foreground">{zone.minDeviation}%</span>
                        )}
                      </td>
                      <td className="p-3">
                        {zone.level !== 3 && zone.level !== -3 ? (
                          <Input
                            type="number"
                            value={zone.maxDeviation}
                            onChange={(e) => handleZoneChange(zone.id, "maxDeviation", Number(e.target.value))}
                            className="w-20 h-8"
                          />
                        ) : (
                          <span className="text-muted-foreground">
                            {zone.maxDeviation > 50 ? "∞" : zone.maxDeviation + "%"}
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <Input
                          type="color"
                          value={zone.color}
                          onChange={(e) => handleZoneChange(zone.id, "color", e.target.value)}
                          className="w-12 h-8 p-0.5 cursor-pointer"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          value={zone.action}
                          onChange={(e) => handleZoneChange(zone.id, "action", e.target.value)}
                          className="h-8 text-xs"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Nota:</strong> Los umbrales definen qué tan desviado está un servicio respecto a la curva
              esperada. Por ejemplo, si la tolerancia es 5%, un servicio con +7% de desviación estará "Levemente
              adelante" (nivel +1). Estos niveles se usan en la sección Performance para categorizar cada servicio.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Guardar Configuración
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
