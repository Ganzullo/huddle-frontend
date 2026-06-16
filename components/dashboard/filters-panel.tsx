"use client"

import { useState, useMemo, useEffect } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { RAMOS_FILTRO, CAMPUS_FILTRO, BLOQUES_FILTRO } from "@/lib/dashboard-data"

interface Filtros {
  ramos: string[]
  modalidad: string[]
  campus: string[]
  bloques: string[]
  precioMin: number
  precioMax: number
}

interface FiltersPanelProps {
  onFiltrosChange?: (filtros: Filtros) => void
  campusInicial?: string
}

export function FiltersPanel({ onFiltrosChange, campusInicial }: FiltersPanelProps) {
  const [busquedaRamo, setBusquedaRamo] = useState("")
  const [filtros, setFiltros] = useState<Filtros>({
    ramos: [],
    modalidad: [],
    campus: campusInicial ? [campusInicial] : [],
    bloques: [],
    precioMin: 0,
    precioMax: 50000,
  })

  // Cuando llega el campus del perfil, aplicar filtro automáticamente
  useEffect(() => {
    if (!campusInicial) return
    setFiltros((prev) => {
      const yaIncluido = prev.campus.includes(campusInicial)
      if (yaIncluido) return prev
      const next = { ...prev, campus: [campusInicial] }
      onFiltrosChange?.(next)
      return next
    })
  }, [campusInicial, onFiltrosChange])

  const ramosFiltrados = useMemo(() => {
    if (!busquedaRamo.trim()) return RAMOS_FILTRO
    return RAMOS_FILTRO.filter((r) =>
      r.nombre.toLowerCase().includes(busquedaRamo.toLowerCase())
    )
  }, [busquedaRamo])

  function toggleRamo(id: string) {
    setFiltros((prev) => ({
      ...prev,
      ramos: prev.ramos.includes(id)
        ? prev.ramos.filter((r) => r !== id)
        : [...prev.ramos, id],
    }))
  }

  function toggleModalidad(m: string) {
    setFiltros((prev) => ({
      ...prev,
      modalidad: prev.modalidad.includes(m)
        ? prev.modalidad.filter((x) => x !== m)
        : [...prev.modalidad, m],
    }))
  }

  function toggleCampus(c: string) {
    setFiltros((prev) => ({
      ...prev,
      campus: prev.campus.includes(c)
        ? prev.campus.filter((x) => x !== c)
        : [...prev.campus, c],
    }))
  }

  function toggleBloque(id: string) {
    setFiltros((prev) => ({
      ...prev,
      bloques: prev.bloques.includes(id)
        ? prev.bloques.filter((x) => x !== id)
        : [...prev.bloques, id],
    }))
  }

  function aplicarFiltros() {
    onFiltrosChange?.(filtros)
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Ramo */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Ramo</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar ramo..."
            className="h-9 pl-9"
            aria-label="Buscar ramo"
            value={busquedaRamo}
            onChange={(e) => setBusquedaRamo(e.target.value)}
          />
        </div>
        <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1">
          {ramosFiltrados.length === 0 ? (
            <p className="text-sm text-muted-foreground">No se encontraron ramos</p>
          ) : (
            ramosFiltrados.map((ramo) => (
              <div key={ramo.id} className="flex items-center gap-2">
                <Checkbox
                  id={`ramo-${ramo.id}`}
                  checked={filtros.ramos.includes(ramo.id)}
                  onCheckedChange={() => toggleRamo(ramo.id)}
                />
                <Label
                  htmlFor={`ramo-${ramo.id}`}
                  className="text-sm font-normal text-foreground cursor-pointer"
                >
                  {ramo.nombre}
                </Label>
              </div>
            ))
          )}
        </div>
      </section>

      <Separator />

      {/* Modalidad */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Modalidad</h3>
        <div className="space-y-2.5">
          {["Presencial", "Online"].map((m) => (
            <div key={m} className="flex items-center gap-2">
              <Checkbox
                id={`mod-${m}`}
                checked={filtros.modalidad.includes(m)}
                onCheckedChange={() => toggleModalidad(m)}
              />
              <Label
                htmlFor={`mod-${m}`}
                className="text-sm font-normal text-foreground cursor-pointer"
              >
                {m}
              </Label>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Campus USM */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          Campus USM
          {campusInicial && (
            <span className="ml-2 text-[11px] font-normal text-[#0070f3]">
              · prefiltrado por tu sede
            </span>
          )}
        </h3>
        <div className="space-y-2.5">
          {CAMPUS_FILTRO.map((campus) => (
            <div key={campus} className="flex items-center gap-2">
              <Checkbox
                id={`campus-${campus}`}
                checked={filtros.campus.includes(campus)}
                onCheckedChange={() => toggleCampus(campus)}
              />
              <Label
                htmlFor={`campus-${campus}`}
                className="text-sm font-normal text-foreground cursor-pointer"
              >
                {campus}
              </Label>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Bloques horarios USM */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Bloques horarios</h3>
        <div className="space-y-2.5">
          {BLOQUES_FILTRO.map((bloque) => (
            <div key={bloque.id} className="flex items-center gap-2">
              <Checkbox
                id={`bloque-${bloque.id}`}
                checked={filtros.bloques.includes(bloque.id)}
                onCheckedChange={() => toggleBloque(bloque.id)}
              />
              <Label
                htmlFor={`bloque-${bloque.id}`}
                className="flex flex-1 items-center justify-between text-sm font-normal text-foreground cursor-pointer"
              >
                <span>{bloque.label}</span>
                <span className="text-xs text-muted-foreground">{bloque.horario}</span>
              </Label>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Precio referencial */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Precio referencial</h3>
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <Label htmlFor="precio-min" className="text-xs font-normal text-muted-foreground">
              Mínimo
            </Label>
            <Input
              id="precio-min"
              type="number"
              placeholder="$0"
              className="h-9"
              onChange={(e) =>
                setFiltros((p) => ({ ...p, precioMin: Number(e.target.value) }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="precio-max" className="text-xs font-normal text-muted-foreground">
              Máximo
            </Label>
            <Input
              id="precio-max"
              type="number"
              placeholder="$50.000"
              className="h-9"
              onChange={(e) =>
                setFiltros((p) => ({ ...p, precioMax: Number(e.target.value) }))
              }
            />
          </div>
        </div>
      </section>

      <Button
        onClick={aplicarFiltros}
        className="w-full rounded-full bg-[#0070f3] text-white hover:bg-[#0070f3]/90"
      >
        Aplicar filtros
      </Button>
    </div>
  )
}