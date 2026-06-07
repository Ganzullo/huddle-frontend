"use client"

import { useEffect, useMemo, useState } from "react"
import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar"
import { QuickFilters } from "@/components/dashboard/quick-filters"
import { FiltersPanel } from "@/components/dashboard/filters-panel"
import { OfertaCard } from "@/components/dashboard/oferta-card"
import { BannerCta } from "@/components/dashboard/banner-cta"
import { OFERTAS } from "@/lib/dashboard-data"

export default function DashboardPage() {
  const [rol, setRol] = useState("inexperto")
  const [nombre, setNombre] = useState("Estudiante USM")
  const [filtroActivo, setFiltroActivo] = useState("Todos")

  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = sessionStorage.getItem("huddle_onboarding")
    if (raw) {
      try {
        const data = JSON.parse(raw)
        if (data.rol) setRol(data.rol)
        if (data.nombre) setNombre(data.nombre)
      } catch {
        // ignore
      }
    }
  }, [])

  const ofertasFiltradas = useMemo(() => {
    if (filtroActivo === "Todos") return OFERTAS
    return OFERTAS.filter((o) => o.area === filtroActivo)
  }, [filtroActivo])

  return (
    <div className="min-h-screen bg-secondary/40">
      <DashboardNavbar rol={rol} nombre={nombre} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Quick filters */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="min-w-0 overflow-x-auto">
            <QuickFilters activo={filtroActivo} onChange={setFiltroActivo} />
          </div>

          {/* Mobile filters trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="shrink-0 rounded-full lg:hidden bg-transparent">
                <SlidersHorizontal className="size-4" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filtros avanzados</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FiltersPanel />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters - desktop */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-5">
              <FiltersPanel />
            </div>
          </aside>

          {/* Listing */}
          <section className="min-w-0 flex-1">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-lg font-semibold text-foreground">
                {ofertasFiltradas.length} ofertas encontradas
              </h1>
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-sm text-muted-foreground">Ordenar por:</span>
                <Select defaultValue="relevancia">
                  <SelectTrigger className="h-9 w-[160px]" aria-label="Ordenar por">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevancia">Relevancia</SelectItem>
                    <SelectItem value="precio-asc">Precio: menor a mayor</SelectItem>
                    <SelectItem value="precio-desc">Precio: mayor a menor</SelectItem>
                    <SelectItem value="rating">Mejor calificación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {ofertasFiltradas.map((oferta) => (
                <OfertaCard key={oferta.id} oferta={oferta} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                {[1, 2, 3, 4, 5].map((n) => (
                  <PaginationItem key={n}>
                    <PaginationLink href="#" isActive={n === 1}>
                      {n}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <span className="px-2 text-muted-foreground">…</span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">10</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <div className="mt-8">
              <BannerCta />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
