"use client"

import { useState } from "react"
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

export function FiltersPanel() {
  const [radio, setRadio] = useState([5])

  return (
    <div className="flex flex-col gap-6">
      {/* Ramo */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Ramo</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar ramo..." className="h-9 pl-9" aria-label="Buscar ramo" />
        </div>
        <div className="space-y-2.5">
          {RAMOS_FILTRO.map((ramo) => (
            <div key={ramo} className="flex items-center gap-2">
              <Checkbox id={`ramo-${ramo}`} />
              <Label htmlFor={`ramo-${ramo}`} className="text-sm font-normal text-foreground">
                {ramo}
              </Label>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Modalidad */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Modalidad</h3>
        <div className="space-y-2.5">
          {["Presencial", "Online"].map((m) => (
            <div key={m} className="flex items-center gap-2">
              <Checkbox id={`mod-${m}`} />
              <Label htmlFor={`mod-${m}`} className="text-sm font-normal text-foreground">
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
          <Select>
            <SelectTrigger className="h-9" aria-label="Día de la semana">
              <SelectValue placeholder="Día de la semana" />
            </SelectTrigger>
            <SelectContent>
              {DIAS_SEMANA.map((dia) => (
                <SelectItem key={dia} value={dia}>
                  {dia}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="h-9" aria-label="Horario">
              <SelectValue placeholder="Horario" />
            </SelectTrigger>
            <SelectContent>
              {HORARIOS.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
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
          <Slider value={radio} onValueChange={setRadio} min={0} max={10} step={1} aria-label="Radio de distancia" />
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
            <Input id="precio-min" type="number" placeholder="$0" className="h-9" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="precio-max" className="text-xs font-normal text-muted-foreground">
              Máximo
            </Label>
            <Input id="precio-max" type="number" placeholder="$50.000" className="h-9" />
          </div>
        </div>
      </section>

      <Button className="w-full rounded-full bg-[#0070f3] text-white hover:bg-[#0070f3]/90">
        Aplicar filtros
      </Button>
    </div>
  )
}
