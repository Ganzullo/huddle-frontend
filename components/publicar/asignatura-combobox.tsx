"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface Ramo {
  codigo: string
  nombre: string
}

interface AsignaturaComboboxProps {
  ramos: Ramo[]
  value: string
  onChange: (codigo: string) => void
}

export function AsignaturaCombobox({ ramos, value, onChange }: AsignaturaComboboxProps) {
  const [open, setOpen] = useState(false)
  const seleccionado = ramos.find((r) => r.codigo === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-11 w-full justify-between bg-background font-normal"
        >
          <span className="flex min-w-0 items-center gap-2">
            <BookOpen className="size-4 shrink-0 text-muted-foreground" />
            {seleccionado ? (
              <span className="truncate">
                <span className="font-semibold text-foreground">{seleccionado.codigo}</span>
                <span className="text-muted-foreground"> — {seleccionado.nombre}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">Busca o selecciona un ramo…</span>
            )}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar ramo (ej. MAT021)…" />
          <CommandList>
            <CommandEmpty>No se encontró el ramo.</CommandEmpty>
            <CommandGroup>
              {ramos.map((ramo) => (
                <CommandItem
                  key={ramo.codigo}
                  value={`${ramo.codigo} ${ramo.nombre}`}
                  onSelect={() => {
                    onChange(ramo.codigo)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4 text-[#0070f3]",
                      value === ramo.codigo ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="font-semibold text-foreground">{ramo.codigo}</span>
                  <span className="ml-1 text-muted-foreground">{ramo.nombre}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
