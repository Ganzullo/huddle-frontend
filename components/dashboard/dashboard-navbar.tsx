"use client"

import Link from "next/link"
import { GraduationCap, Search, MessageSquare, Bell, Plus, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DashboardNavbarProps {
  rol: string
  nombre: string
}

interface Notificacion {
  id: string
  titulo: string
  detalle: string
  tiempo: string
  leida: boolean
}

// Estructura lista para conectar con la base de datos.
// Deja el array vacío para visualizar el estado "Sin notificaciones".
const NOTIFICACIONES: Notificacion[] = [
  {
    id: "n1",
    titulo: "Nueva respuesta de Camila Rojas",
    detalle: "Aceptó tu solicitud de ayudantía de MAT021.",
    tiempo: "Hace 5 min",
    leida: false,
  },
  {
    id: "n2",
    titulo: "Recordatorio de sesión",
    detalle: "Tu bloque 3-4 con Diego Fuentes es mañana.",
    tiempo: "Hace 2 h",
    leida: false,
  },
]

export function DashboardNavbar({ rol, nombre }: DashboardNavbarProps) {
  const sinLeer = NOTIFICACIONES.filter((n) => !n.leida).length

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex shrink-0 items-center gap-2">
          <GraduationCap className="size-7 text-[#0070f3]" strokeWidth={2} />
          <span className="hidden text-lg font-bold text-[#0070f3] sm:inline">Huddle USM</span>
        </Link>

        {/* Search */}
        <div className="relative mx-auto hidden w-full max-w-md flex-1 md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar ramos, temas o habilidades..."
            className="h-10 rounded-full border-border bg-secondary pl-10"
            aria-label="Buscar ramos, temas o habilidades"
          />
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground"
            aria-label="Mensajes"
          >
            <Link href="/mensajes">
              <MessageSquare className="size-5" />
            </Link>
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full text-muted-foreground"
                aria-label="Notificaciones"
              >
                <Bell className="size-5" />
                {sinLeer > 0 && (
                  <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[#0070f3] ring-2 ring-card" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h3 className="text-sm font-semibold text-foreground">Notificaciones</h3>
                {sinLeer > 0 && (
                  <span className="rounded-full bg-[#0070f3]/10 px-2 py-0.5 text-[11px] font-medium text-[#0070f3]">
                    {sinLeer} nuevas
                  </span>
                )}
              </div>

              {NOTIFICACIONES.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
                  <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                    <Bell className="size-5" />
                  </div>
                  <p className="text-sm font-medium text-foreground">No tienes notificaciones pendientes</p>
                  <p className="text-xs text-muted-foreground">Te avisaremos cuando haya novedades.</p>
                </div>
              ) : (
                <ul className="max-h-80 overflow-y-auto py-1">
                  {NOTIFICACIONES.map((n) => (
                    <li key={n.id}>
                      <button
                        type="button"
                        className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/60"
                      >
                        <span
                          className={cn(
                            "mt-1.5 size-2 shrink-0 rounded-full",
                            n.leida ? "bg-transparent" : "bg-[#0070f3]",
                          )}
                          aria-hidden="true"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-foreground">{n.titulo}</span>
                          <span className="block text-xs text-muted-foreground">{n.detalle}</span>
                          <span className="mt-0.5 block text-[11px] text-muted-foreground/70">{n.tiempo}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </PopoverContent>
          </Popover>

          <Button
            asChild
            className="ml-1 hidden rounded-full bg-[#0070f3] text-white hover:bg-[#0070f3]/90 sm:inline-flex"
          >
            <Link href="/publicar-oferta">
              <Plus className="size-4" />
              Publicar oferta
            </Link>
          </Button>

          <button
            type="button"
            className="ml-1 flex size-9 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground"
            aria-label={`Perfil de ${nombre}`}
          >
            <User className="size-5" />
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="border-t border-border px-4 py-2 md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar ramos, temas o habilidades..."
            className="h-10 rounded-full border-border bg-secondary pl-10"
            aria-label="Buscar ramos, temas o habilidades"
          />
        </div>
      </div>
    </header>
  )
}
