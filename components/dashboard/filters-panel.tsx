"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { RAMOS_FILTRO, CAMPUS_FILTRO, BLOQUES_FILTRO } from "@/lib/dashboard-data"

const DIAS_SEMANA = [
  { id: "lun", label: "Lunes" },
  { id: "mar", label: "Martes" },
  { id: "mie", label: "Miércoles" },
  { id: "jue", label: "Jueves" },
  { id: "vie", label: "Viernes" },
  { id: "sab", label: "Sábado" },
  { id: "dom", label: "Domingo" },
]

interface Filtros {
  ramos: string[]
  modalidad: string[]
  campus: string[]
  bloques: string[]
  dias: string[]
  precioMin: number
  precioMax: number
}

interface FiltersPanelProps {
  filtros: Filtros
  onFiltrosChange: (filtros: Filtros) => void
  campusInicial?: string
}

export function FiltersPanel({ filtros, onFiltrosChange, campusInicial }: FiltersPanelProps) {
  const [busquedaRamo, setBusquedaRamo] = useState("")

  const ramosFiltrados = useMemo(() => {
    if (!busquedaRamo.trim()) return RAMOS_FILTRO
    return RAMOS_FILTRO.filter((r) =>
      r.nombre.toLowerCase().includes(busquedaRamo.toLowerCase())
    )
  }, [busquedaRamo])

  function toggle<K extends keyof Filtros>(key: K, value: string) {
    const arr = filtros[key] as string[]
    onFiltrosChange({
      ...filtros,
      [key]: arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value],
    })
  }

  return (
    <div className="flex h-full max-h-[calc(100vh-220px)] flex-col overflow-y-auto pr-1 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex flex-col gap-6 pb-4">

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
          <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
            {ramosFiltrados.length === 0 ? (
              <p className="text-sm text-muted-foreground">No se encontraron ramos</p>
            ) : (
              ramosFiltrados.map((ramo) => (
                <div key={ramo.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`ramo-${ramo.id}`}
                    checked={filtros.ramos.includes(ramo.id)}
                    onCheckedChange={() => toggle("ramos", ramo.id)}
                  />
                  <Label htmlFor={`ramo-${ramo.id}`} className="cursor-pointer text-sm font-normal text-foreground">
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
                  onCheckedChange={() => toggle("modalidad", m)}
                />
                <Label htmlFor={`mod-${m}`} className="cursor-pointer text-sm font-normal text-foreground">
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
                  onCheckedChange={() => toggle("campus", campus)}
                />
                <Label htmlFor={`campus-${campus}`} className="cursor-pointer text-sm font-normal text-foreground">
                  {campus}
                </Label>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* Días disponibles */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Días disponibles</h3>
          <div className="flex flex-wrap gap-2">
            {DIAS_SEMANA.map((dia) => {
              const activo = filtros.dias.includes(dia.id)
              return (
                <button
                  key={dia.id}
                  type="button"
                  onClick={() => toggle("dias", dia.id)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    activo
                      ? "border-[#0070f3] bg-[#0070f3] text-white"
                      : "border-border bg-transparent text-muted-foreground hover:border-[#0070f3]/50 hover:text-foreground"
                  }`}
                >
                  {dia.label}
                </button>
              )
            })}
          </div>
        </section>

        <Separator />

        {/* Bloques horarios */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Bloques horarios</h3>
          <div className="space-y-2.5">
            {BLOQUES_FILTRO.map((bloque) => (
              <div key={bloque.id} className="flex items-center gap-2">
                <Checkbox
                  id={`bloque-${bloque.id}`}
                  checked={filtros.bloques.includes(bloque.id)}
                  onCheckedChange={() => toggle("bloques", bloque.id)}
                />
                <Label htmlFor={`bloque-${bloque.id}`} className="flex flex-1 cursor-pointer items-center justify-between text-sm font-normal text-foreground">
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
              <Label htmlFor="precio-min" className="text-xs font-normal text-muted-foreground">Mínimo</Label>
              <Input
                id="precio-min"
                type="number"
                placeholder="$0"
                className="h-9"
                value={filtros.precioMin || ""}
                onChange={(e) => onFiltrosChange({ ...filtros, precioMin: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="precio-max" className="text-xs font-normal text-muted-foreground">Máximo</Label>
              <Input
                id="precio-max"
                type="number"
                placeholder="$50.000"
                className="h-9"
                value={filtros.precioMax === 999999 ? "" : filtros.precioMax}
                onChange={(e) => onFiltrosChange({ ...filtros, precioMax: Number(e.target.value) || 999999 })}
              />
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}