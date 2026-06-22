"use client"

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { GraduationCap, Search, MessageSquare, Bell, Plus, User, HandHelping } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface SidebarNavProps {
  nombre: string
  fotoUrl?: string
}

interface Notificacion {
  id: string
  titulo: string
  detalle: string
  tiempo: string
  leida: boolean
}

const NOTIFICACIONES: Notificacion[] = []

export function SidebarNav({ nombre, fotoUrl }: SidebarNavProps) {
  const sinLeer = NOTIFICACIONES.filter((n) => !n.leida).length
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-4">
      {/* Marca + notificaciones */}
      <div className="flex items-center justify-between gap-2">
        <Link href="/dashboard" className="flex shrink-0 items-center gap-2">
          <GraduationCap className="size-7 text-[#0070f3]" strokeWidth={2} />
          <span className="text-lg font-bold text-[#0070f3]">Huddle USM</span>
        </Link>
        <Button
  variant="ghost"
  size="icon"
  className="rounded-full text-muted-foreground"
  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
  aria-label="Cambiar tema"
>
  {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
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
                <p className="text-sm font-medium text-foreground">Sin notificaciones</p>
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
      </div>

      {/* Accesos rápidos */}
<div className="flex flex-col gap-2">
  <Button
    asChild
    className="w-full justify-start rounded-full bg-[#0070f3] text-white hover:bg-[#0070f3]/90"
  >
    <Link href="/publicar-oferta">
      <Plus className="size-4" />
      Publicar oferta
    </Link>
  </Button>
  <Button
    asChild
    variant="outline"
    className="w-full justify-start rounded-full bg-transparent"
  >
    <Link href="/solicitar-ayudantia">
      <HandHelping className="size-4" />
      Solicitar ayudantía
    </Link>
  </Button>
  <Button
    asChild
    variant="outline"
    className="w-full justify-start rounded-full bg-transparent"
  >
    <Link href="/mensajes">
      <MessageSquare className="size-4" />
      Mensajes
    </Link>
  </Button>
</div>

      {/* Perfil del usuario */}
      <Link
        href="/perfil"
        className="flex items-center gap-3 rounded-2xl bg-secondary/60 p-3 transition-colors hover:bg-secondary"
      >
        <div
          className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-card text-muted-foreground"
          aria-hidden="true"
        >
          {fotoUrl ? (
            <Image src={fotoUrl} alt={nombre} fill className="object-cover" sizes="40px" />
          ) : (
            <User className="size-5" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{nombre}</p>
          <p className="text-xs text-muted-foreground">Ver perfil</p>
        </div>
      </Link>
    </div>
  )
}