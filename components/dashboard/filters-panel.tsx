"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RAMOS_FILTRO, DIAS_SEMANA, HORARIOS } from "@/lib/dashboard-data"

interface Filtros {
  ramos: string[]
  modalidad: string[]
  dia: string
  horario: string
  precioMin: number
  precioMax: number
}

interface FiltersPanelProps {
  onFiltrosChange?: (filtros: Filtros) => void
}

export function FiltersPanel({ onFiltrosChange }: FiltersPanelProps) {
  const [radio, setRadio] = useState([5])
  const [busquedaRamo, setBusquedaRamo] = useState("")
  const [filtros, setFiltros] = useState<Filtros>({
    ramos: [],
    modalidad: [],
    dia: "",
    horario: "",
    precioMin: 0,
    precioMax: 50000,
  })

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

      {/* Disponibilidad */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Disponibilidad</h3>
        <div className="space-y-3">
          <Select onValueChange={(v) => setFiltros((p) => ({ ...p, dia: v }))}>
            <SelectTrigger className="h-9" aria-label="Día de la semana">
              <SelectValue placeholder="Día de la semana" />
            </SelectTrigger>
            <SelectContent>
              {DIAS_SEMANA.map((dia) => (
                <SelectItem key={dia} value={dia}>{dia}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(v) => setFiltros((p) => ({ ...p, horario: v }))}>
            <SelectTrigger className="h-9" aria-label="Horario">
              <SelectValue placeholder="Horario" />
            </SelectTrigger>
            <SelectContent>
              {HORARIOS.map((h) => (
                <SelectItem key={h} value={h}>{h}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <Separator />

      {/* Ubicación */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Ubicación</h3>
        <Input placeholder="Ingresa tu ubicación" className="h-9" aria-label="Ubicación" />
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Radio de distancia</span>
            <span className="font-medium text-foreground">{radio[0]} km</span>
          </div>
          <Slider
            value={radio}
            onValueChange={setRadio}
            min={0}
            max={10}
            step={1}
            aria-label="Radio de distancia"
          />
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