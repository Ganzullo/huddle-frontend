"use client"

import { useEffect, useState, useCallback } from "react"
import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
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
import { EmptyState } from "@/components/dashboard/empty-state"
import { BannerCta } from "@/components/dashboard/banner-cta"

interface Oferta {
  id: string
  id_tutor: string
  id_ramo: string
  nombre_ramo: string
  modalidad: string
  precio_referencial: number
  lugar_especifico: string
  descripcion?: string
  nombre_tutor?: string
  rating?: number
  reviews?: number
  fecha_creacion: any
}

interface Filtros {
  ramos: string[]
  modalidad: string[]
  dia: string
  horario: string
  precioMin: number
  precioMax: number
}

export default function DashboardPage() {
  const [rol, setRol] = useState("inexperto")
  const [nombre, setNombre] = useState("Estudiante USM")
  const [filtroActivo, setFiltroActivo] = useState("Todos")
  const [orden, setOrden] = useState("relevancia")
  const [ofertas, setOfertas] = useState<Oferta[]>([])
  const [cargando, setCargando] = useState(true)
  const [filtros, setFiltros] = useState<Filtros>({
    ramos: [],
    modalidad: [],
    dia: "",
    horario: "",
    precioMin: 0,
    precioMax: 999999,
  })

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

  const cargarOfertas = useCallback(async () => {
    setCargando(true)
    try {
      const params = new URLSearchParams()
      if (filtros.ramos.length > 0) params.set("ramos", filtros.ramos.join(","))
      if (filtros.modalidad.length === 1) params.set("modalidad", filtros.modalidad[0])
      if (filtros.precioMin > 0) params.set("precioMin", String(filtros.precioMin))
      if (filtros.precioMax < 999999) params.set("precioMax", String(filtros.precioMax))
      params.set("orden", orden)

      const res = await fetch(`/api/ofertas?${params.toString()}`)
      const data = await res.json()
      setOfertas(data.ofertas ?? [])
    } catch (error) {
      console.error("Error al cargar ofertas:", error)
    } finally {
      setCargando(false)
    }
  }, [filtros, orden])

  // Carga inicial y cuando cambian filtros u orden
  useEffect(() => {
    cargarOfertas()
  }, [cargarOfertas])

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
                <FiltersPanel onFiltrosChange={setFiltros} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters - desktop */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-5">
              <FiltersPanel onFiltrosChange={setFiltros} />
            </div>
          </aside>

          {/* Listing */}
          <section className="min-w-0 flex-1">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-lg font-semibold text-foreground">
                {cargando ? "Buscando ofertas..." : `${ofertas.length} ofertas encontradas`}
              </h1>
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-sm text-muted-foreground">Ordenar por:</span>
                <Select value={orden} onValueChange={setOrden}>
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

            {cargando ? (
              <div className="flex flex-col gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-40 w-full animate-pulse rounded-2xl bg-muted" />
                ))}
              </div>
            ) : ofertas.length > 0 ? (
              <div className="flex flex-col gap-4">
                {ofertas.map((oferta) => (
                  <OfertaCard key={oferta.id} oferta={oferta} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}

            <div className="mt-8">
              <BannerCta />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}