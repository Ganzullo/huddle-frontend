"use client"

import Link from "next/link"
import { GraduationCap, Search, MessageSquare, Bell, Plus, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DashboardNavbarProps {
  rol: string
  nombre: string
}

export function DashboardNavbar({ rol, nombre }: DashboardNavbarProps) {
  const puedePublicar = rol === "experto" || rol === "hibrido"

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
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground" aria-label="Mensajes">
            <MessageSquare className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full text-muted-foreground"
            aria-label="Notificaciones"
          >
            <Bell className="size-5" />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[#0070f3] ring-2 ring-card" />
          </Button>

          {puedePublicar && (
            <Button className="ml-1 hidden rounded-full bg-[#0070f3] text-white hover:bg-[#0070f3]/90 sm:inline-flex">
              <Plus className="size-4" />
              Publicar oferta
            </Button>
          )}

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
