"use client"

import { useState } from "react"
import { Navigation } from "@/components/layout/navigation"
import { AlertsList } from "@/components/alerts/alerts-list"
import { RuleCard } from "@/components/alerts/rule-card"
import { RuleForm } from "@/components/alerts/rule-form"
import { alerts as initialAlerts, alertRules as initialRules } from "@/lib/mock-data"
import type { Alert, AlertRule } from "@/types"
import { Button } from "@/components/ui/button"
import { Plus, Bell, Settings, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

type Tab = "alerts" | "rules"
type FilterSeverity = "all" | "critical" | "warning" | "info"

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("alerts")
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
  const [rules, setRules] = useState<AlertRule[]>(initialRules)
  const [showRuleForm, setShowRuleForm] = useState(false)
  const [editingRule, setEditingRule] = useState<AlertRule | undefined>()
  const [filterSeverity, setFilterSeverity] = useState<FilterSeverity>("all")
  const [showAcknowledged, setShowAcknowledged] = useState(true)

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)))
  }

  const handleToggleRule = (id: string, enabled: boolean) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled } : r)))
  }

  const handleSaveRule = (ruleData: Omit<AlertRule, "id">) => {
    if (editingRule) {
      setRules((prev) => prev.map((r) => (r.id === editingRule.id ? { ...r, ...ruleData } : r)))
    } else {
      const newRule: AlertRule = {
        ...ruleData,
        id: `rule-${Date.now()}`,
      }
      setRules((prev) => [...prev, newRule])
    }
    setShowRuleForm(false)
    setEditingRule(undefined)
  }

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id))
  }

  const filteredAlerts = alerts.filter((a) => {
    if (!showAcknowledged && a.acknowledged) return false
    if (filterSeverity !== "all" && a.severity !== filterSeverity) return false
    return true
  })

  const alertCounts = {
    total: alerts.length,
    critical: alerts.filter((a) => a.severity === "critical" && !a.acknowledged).length,
    warning: alerts.filter((a) => a.severity === "warning" && !a.acknowledged).length,
    unacknowledged: alerts.filter((a) => !a.acknowledged).length,
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Alertas</h1>
            <p className="text-sm text-muted-foreground">
              {alertCounts.unacknowledged} alertas sin revisar | {alertCounts.critical} críticas
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 border-b border-border mb-6">
          <button
            onClick={() => setActiveTab("alerts")}
            className={cn(
              "flex items-center gap-2 px-1 pb-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === "alerts"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <Bell className="h-4 w-4" />
            Alertas
            {alertCounts.unacknowledged > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-xs bg-red-100 text-red-700">
                {alertCounts.unacknowledged}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("rules")}
            className={cn(
              "flex items-center gap-2 px-1 pb-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === "rules"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <Settings className="h-4 w-4" />
            Reglas
          </button>
        </div>

        {activeTab === "alerts" && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                {(["all", "critical", "warning", "info"] as const).map((sev) => (
                  <Button
                    key={sev}
                    variant={filterSeverity === sev ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterSeverity(sev)}
                  >
                    {sev === "all"
                      ? "Todas"
                      : sev === "critical"
                        ? "Críticas"
                        : sev === "warning"
                          ? "Advertencias"
                          : "Info"}
                  </Button>
                ))}
              </div>
              <div className="h-4 w-px bg-border" />
              <Button
                variant={showAcknowledged ? "default" : "outline"}
                size="sm"
                onClick={() => setShowAcknowledged(!showAcknowledged)}
              >
                {showAcknowledged ? "Mostrando revisadas" : "Ocultando revisadas"}
              </Button>
            </div>

            {filteredAlerts.length > 0 ? (
              <AlertsList alerts={filteredAlerts} onAcknowledge={handleAcknowledge} />
            ) : (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-medium">No hay alertas</p>
                <p className="text-sm text-muted-foreground">
                  {filterSeverity !== "all" || !showAcknowledged
                    ? "Prueba ajustando los filtros"
                    : "Todo está bajo control"}
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === "rules" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">{rules.length} reglas configuradas</p>
              <Button onClick={() => setShowRuleForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Regla
              </Button>
            </div>

            <div className="space-y-3">
              {rules.map((rule) => (
                <RuleCard
                  key={rule.id}
                  rule={rule}
                  onToggle={handleToggleRule}
                  onEdit={(r) => {
                    setEditingRule(r)
                    setShowRuleForm(true)
                  }}
                  onDelete={handleDeleteRule}
                />
              ))}
            </div>
          </>
        )}

        {showRuleForm && (
          <RuleForm
            rule={editingRule}
            onSave={handleSaveRule}
            onCancel={() => {
              setShowRuleForm(false)
              setEditingRule(undefined)
            }}
          />
        )}
      </main>
    </div>
  )
}
