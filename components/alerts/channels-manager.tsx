"use client"

import { useState } from "react"
import type { NotificationChannelConfig, NotificationChannel } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import {
  Mail,
  MessageSquare,
  Phone,
  Bell,
  Webhook,
  MessageCircle,
  Plus,
  Trash2,
  CheckCircle2,
  X,
} from "lucide-react"

interface ChannelsManagerProps {
  channels: NotificationChannelConfig[]
  onChange: (channels: NotificationChannelConfig[]) => void
}

const channelIcons: Record<NotificationChannel, typeof Mail> = {
  platform: Bell,
  email: Mail,
  slack: MessageSquare,
  whatsapp: MessageCircle,
  sms: Phone,
  webhook: Webhook,
}

const channelLabels: Record<NotificationChannel, string> = {
  platform: "Plataforma",
  email: "Email / Gmail",
  slack: "Slack",
  whatsapp: "WhatsApp",
  sms: "SMS",
  webhook: "Webhook",
}

const channelDescriptions: Record<NotificationChannel, string> = {
  platform: "Notificaciones dentro de MGO Revenue",
  email: "Enviar alertas a correos electrónicos configurados",
  slack: "Publicar alertas en canales de Slack",
  whatsapp: "Enviar mensajes de WhatsApp Business",
  sms: "Enviar mensajes de texto SMS",
  webhook: "Enviar datos a URLs externas via HTTP POST",
}

export function ChannelsManager({ channels, onChange }: ChannelsManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newChannelType, setNewChannelType] = useState<NotificationChannel>("email")
  const [newChannelName, setNewChannelName] = useState("")
  const [newChannelConfig, setNewChannelConfig] = useState("")

  const handleToggle = (id: string, enabled: boolean) => {
    onChange(channels.map((ch) => (ch.id === id ? { ...ch, enabled } : ch)))
  }

  const handleDelete = (id: string) => {
    onChange(channels.filter((ch) => ch.id !== id))
  }

  const handleAdd = () => {
    if (!newChannelName.trim()) return

    const config: NotificationChannelConfig["config"] = {}
    if (newChannelType === "email") config.email = newChannelConfig
    else if (newChannelType === "slack") config.slackChannel = newChannelConfig
    else if (newChannelType === "webhook") config.webhookUrl = newChannelConfig
    else if (newChannelType === "whatsapp" || newChannelType === "sms") config.phoneNumber = newChannelConfig

    const newChannel: NotificationChannelConfig = {
      id: `ch-${Date.now()}`,
      type: newChannelType,
      name: newChannelName,
      enabled: true,
      config,
      sentCount: 0,
    }

    onChange([...channels, newChannel])
    setShowAddForm(false)
    setNewChannelName("")
    setNewChannelConfig("")
  }

  const getConfigLabel = (type: NotificationChannel) => {
    switch (type) {
      case "email":
        return "Dirección de email"
      case "slack":
        return "Canal de Slack (#canal)"
      case "webhook":
        return "URL del webhook"
      case "whatsapp":
      case "sms":
        return "Número de teléfono"
      default:
        return "Configuración"
    }
  }

  const getConfigPlaceholder = (type: NotificationChannel) => {
    switch (type) {
      case "email":
        return "alertas@viabariloche.com.ar"
      case "slack":
        return "#revenue-alerts"
      case "webhook":
        return "https://api.example.com/webhooks/alerts"
      case "whatsapp":
      case "sms":
        return "+54 11 1234 5678"
      default:
        return ""
    }
  }

  const getConfigValue = (ch: NotificationChannelConfig) => {
    if (ch.type === "email") return ch.config.email
    if (ch.type === "slack") return ch.config.slackChannel
    if (ch.type === "webhook") return ch.config.webhookUrl
    if (ch.type === "whatsapp" || ch.type === "sms") return ch.config.phoneNumber
    return "-"
  }

  return (
    <div className="space-y-4">
      {/* Header with add button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">Canales de Notificación</h3>
          <p className="text-xs text-muted-foreground">Configura dónde recibir las alertas automáticas</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Agregar Canal
        </Button>
      </div>

      {/* Channel cards */}
      <div className="grid gap-3">
        {channels.map((channel) => {
          const Icon = channelIcons[channel.type]
          return (
            <div
              key={channel.id}
              className={cn(
                "flex items-center gap-4 rounded-lg border border-border bg-card p-4",
                !channel.enabled && "opacity-60"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  channel.type === "email"
                    ? "bg-red-100 text-red-600"
                    : channel.type === "slack"
                      ? "bg-purple-100 text-purple-600"
                      : channel.type === "whatsapp"
                        ? "bg-green-100 text-green-600"
                        : channel.type === "sms"
                          ? "bg-blue-100 text-blue-600"
                          : channel.type === "webhook"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground truncate">{channel.name}</p>
                  <span className="text-xs text-muted-foreground">({channelLabels[channel.type]})</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{getConfigValue(channel)}</p>
                {channel.sentCount > 0 && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    {channel.sentCount} alertas enviadas
                    {channel.lastSent && ` · Última: ${channel.lastSent}`}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleDelete(channel.id)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Switch checked={channel.enabled} onCheckedChange={(checked) => handleToggle(channel.id, checked)} />
              </div>
            </div>
          )
        })}

        {channels.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No hay canales configurados</p>
            <p className="text-xs text-muted-foreground">Las alertas solo se mostrarán en la plataforma</p>
          </div>
        )}
      </div>

      {/* Add channel modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-xl border border-border shadow-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Agregar Canal de Notificación</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <Label>Tipo de canal</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {(["email", "slack", "whatsapp", "sms", "webhook"] as NotificationChannel[]).map((type) => {
                    const Icon = channelIcons[type]
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewChannelType(type)}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-lg border text-left transition-colors",
                          newChannelType === type
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <div>
                          <p className="text-sm font-medium">{channelLabels[type]}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-2">{channelDescriptions[newChannelType]}</p>
              </div>

              <div>
                <Label htmlFor="channelName">Nombre del canal</Label>
                <Input
                  id="channelName"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="Ej: Equipo Revenue, Gerencia, etc."
                />
              </div>

              {newChannelType !== "platform" && (
                <div>
                  <Label htmlFor="channelConfig">{getConfigLabel(newChannelType)}</Label>
                  <Input
                    id="channelConfig"
                    value={newChannelConfig}
                    onChange={(e) => setNewChannelConfig(e.target.value)}
                    placeholder={getConfigPlaceholder(newChannelType)}
                  />
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <Button onClick={handleAdd} className="flex-1" disabled={!newChannelName.trim()}>
                  Agregar Canal
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
