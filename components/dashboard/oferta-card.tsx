"use client"

import { useState } from "react"
import { Star, Heart, MapPin, Wifi, User } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { Oferta } from "@/lib/dashboard-data"

function formatPrecio(precio: number) {
  return "$" + precio.toLocaleString("es-CL")
}

export function OfertaCard({ oferta }: { oferta: Oferta }) {
  const [favorito, setFavorito] = useState(false)

  return (
    <Card className="relative flex gap-4 p-4 transition-shadow hover:shadow-md sm:p-5">
      {/* Avatar genérico */}
      <div className="shrink-0">
        <div
          className="flex size-14 items-center justify-center rounded-full bg-secondary text-muted-foreground sm:size-[72px]"
          aria-hidden="true"
        >
          <User className="size-7 sm:size-9" />
        </div>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="pr-6 font-semibold leading-tight text-foreground text-pretty">{oferta.titulo}</h3>
          <button
            type="button"
            onClick={() => setFavorito((f) => !f)}
            className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-[#0070f3]"
            aria-label={favorito ? "Quitar de favoritos" : "Guardar en favoritos"}
            aria-pressed={favorito}
          >
            <Heart className={`size-5 ${favorito ? "fill-[#0070f3] text-[#0070f3]" : ""}`} />
          </button>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span className="font-medium text-foreground">{oferta.tutor}</span>
          <span className="flex items-center gap-0.5 text-foreground">
            <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
            {oferta.rating}
          </span>
          <span className="text-muted-foreground">({oferta.reviews} reseñas)</span>
        </div>

        <div className="mt-1.5 flex items-center gap-1 text-sm text-muted-foreground">
          {oferta.modalidad === "Online" ? <Wifi className="size-3.5" /> : <MapPin className="size-3.5" />}
          <span>
            {oferta.modalidad} · {oferta.ubicacion}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground text-pretty">{oferta.descripcion}</p>

        <div className="mt-3 flex items-end justify-between gap-2">
          <button className="text-sm font-medium text-[#0070f3] hover:underline">Ver disponibilidad</button>
          <div className="text-right">
            <span className="text-lg font-bold text-foreground">{formatPrecio(oferta.precio)}</span>
            <span className="block text-xs text-muted-foreground">por hora</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
