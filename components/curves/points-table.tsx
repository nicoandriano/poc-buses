"use client"

import { useState } from "react"
import type { CurvePoint } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Check, X } from "lucide-react"

interface PointsTableProps {
  points: CurvePoint[]
  onUpdatePoint?: (updated: CurvePoint) => void
}

export function PointsTable({ points, onUpdatePoint }: PointsTableProps) {
  const [editingPoint, setEditingPoint] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<Partial<CurvePoint>>({})

  const sortedPoints = [...points].sort((a, b) => b.daysBeforeDeparture - a.daysBeforeDeparture)

  const startEdit = (point: CurvePoint) => {
    setEditingPoint(point.daysBeforeDeparture)
    setEditValues({
      expectedOccupancy: point.expectedOccupancy,
      toleranceLower: point.toleranceLower,
      toleranceUpper: point.toleranceUpper,
    })
  }

  const cancelEdit = () => {
    setEditingPoint(null)
    setEditValues({})
  }

  const saveEdit = (point: CurvePoint) => {
    if (onUpdatePoint) {
      onUpdatePoint({
        ...point,
        expectedOccupancy: editValues.expectedOccupancy ?? point.expectedOccupancy,
        toleranceLower: editValues.toleranceLower ?? point.toleranceLower,
        toleranceUpper: editValues.toleranceUpper ?? point.toleranceUpper,
      })
    }
    cancelEdit()
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Días antes</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Objetivo %</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Tolerancia</th>
            <th className="px-4 py-3 w-20"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sortedPoints.map((point) => {
            const isEditing = editingPoint === point.daysBeforeDeparture

            return (
              <tr key={point.daysBeforeDeparture} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-foreground">D-{point.daysBeforeDeparture}</span>
                </td>
                <td className="px-4 py-3">
                  {isEditing ? (
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={editValues.expectedOccupancy}
                      onChange={(e) => setEditValues({ ...editValues, expectedOccupancy: Number(e.target.value) })}
                      className="w-20 h-8"
                    />
                  ) : (
                    <span className="text-sm text-foreground">{point.expectedOccupancy}%</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={editValues.toleranceLower}
                        onChange={(e) => setEditValues({ ...editValues, toleranceLower: Number(e.target.value) })}
                        className="w-16 h-8"
                      />
                      <span className="text-muted-foreground">-</span>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={editValues.toleranceUpper}
                        onChange={(e) => setEditValues({ ...editValues, toleranceUpper: Number(e.target.value) })}
                        className="w-16 h-8"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {point.toleranceLower}% - {point.toleranceUpper}%
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => saveEdit(point)}>
                        <Check className="h-4 w-4 text-emerald-600" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={cancelEdit}>
                        <X className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => startEdit(point)}>
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
