"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, TrendingUp, LineChart, Bell, Settings, ChevronDown } from "lucide-react"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/performance", label: "Performance", icon: TrendingUp },
  { href: "/curves", label: "Curvas", icon: LineChart },
  { href: "/alerts", label: "Alertas", icon: Bell },
  { href: "/settings", label: "Configuración", icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="text-xs font-bold text-primary-foreground">MGO</span>
                </div>
                <div className="hidden sm:flex flex-col leading-none">
                  <span className="text-sm font-bold text-foreground">MGO Revenue</span>
                  <span className="text-[10px] text-muted-foreground tracking-wide">by Catalyst RM</span>
                </div>
              </div>
            </Link>

            <div className="hidden lg:block h-8 w-px bg-border" />

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 rounded-lg border border-border px-3 py-1.5">
              <Image
                src="/images/via-bariloche-logo.png"
                alt="Via Bariloche"
                width={28}
                height={28}
                className="rounded"
              />
              <div className="text-right">
                <p className="text-sm font-medium text-foreground leading-tight">Via Bariloche</p>
                <p className="text-[11px] text-muted-foreground">Gerente de Estrategia de Red</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="sm:hidden h-9 w-9 rounded-full overflow-hidden border border-border">
              <Image
                src="/images/via-bariloche-logo.png"
                alt="Via Bariloche"
                width={36}
                height={36}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
