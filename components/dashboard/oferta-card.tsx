"use client"

import { useState } from "react"
import { Star, Heart, MapPin, Wifi, User, Building2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface Oferta {
  id: string
  id_tutor: string
  id_ramo: string
  nombre_ramo?: string
  sede?: string
  modalidad: string
  precio_referencial?: number
  lugar_especifico?: string
  descripcion?: string
  nombre_tutor?: string
  foto_url?: string
  rating?: number
  reviews?: number
}

function formatPrecio(precio?: number) {
  if (!precio && precio !== 0) return "$0"
  return "$" + precio.toLocaleString("es-CL")
}

function AvatarTutor({ nombre, foto_url }: { nombre?: string; foto_url?: string }) {
  const iniciales = nombre
    ? nombre.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase()
    : null

  if (foto_url) {
    return (
      <div className="relative size-14 shrink-0 overflow-hidden rounded-full sm:size-[72px]">
        <Image
          src={foto_url}
          alt={nombre ?? "Foto del tutor"}
          fill
          className="object-cover"
          sizes="72px"
        />
      </div>
    )
  }

  return (
    <div
      className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#0070f3]/10 sm:size-[72px]"
      aria-hidden="true"
    >
      {iniciales ? (
        <span className="text-base font-semibold text-[#0070f3] sm:text-lg">{iniciales}</span>
      ) : (
        <User className="size-7 text-[#0070f3]/60 sm:size-9" />
      )}
    </div>
  )
}

export function OfertaCard({ oferta }: { oferta: Oferta }) {
  const [favorito, setFavorito] = useState(false)

  return (
    <Card className="relative flex gap-4 p-4 transition-shadow hover:shadow-md sm:p-5">
      {/* Avatar */}
      <AvatarTutor nombre={oferta.nombre_tutor} foto_url={oferta.foto_url} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Fila superior: ramo + corazón */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 pr-6">
            <p className="text-xs font-medium uppercase tracking-wide text-[#0070f3]">
              {oferta.id_ramo}
            </p>
            <h3 className="font-semibold leading-tight text-foreground text-pretty">
              {oferta.nombre_ramo ?? oferta.id_ramo}
            </h3>
          </div>
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

        {/* Tutor + rating */}
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span className="font-medium text-foreground">
            {oferta.nombre_tutor ?? "Tutor"}
          </span>
          {oferta.rating != null ? (
            <>
              <span className="flex items-center gap-0.5 text-foreground">
                <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                {oferta.rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                ({oferta.reviews ?? 0} {oferta.reviews === 1 ? "reseña" : "reseñas"})
              </span>
            </>
          ) : (
            <span className="text-xs text-muted-foreground">Sin reseñas aún</span>
          )}
        </div>

        {/* Modalidad + sede */}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            {oferta.modalidad === "online" ? (
              <Wifi className="size-3.5" />
            ) : (
              <MapPin className="size-3.5" />
            )}
            <span className="capitalize">
              {oferta.modalidad}
              {oferta.lugar_especifico ? ` · ${oferta.lugar_especifico}` : ""}
            </span>
          </span>
          {oferta.sede && (
            <span className="flex items-center gap-1">
              <Building2 className="size-3.5" />
              {oferta.sede}
            </span>
          )}
        </div>

        {/* Descripción */}
        {oferta.descripcion && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground text-pretty">
            {oferta.descripcion}
          </p>
        )}

        {/* Footer: disponibilidad + precio */}
        <div className="mt-3 flex items-end justify-between gap-2">
          <button className="text-sm font-medium text-[#0070f3] hover:underline">
            Ver disponibilidad
          </button>
          <div className="text-right">
            <span className="text-lg font-bold text-foreground">
              {formatPrecio(oferta.precio_referencial)}
            </span>
            <span className="block text-xs text-muted-foreground">por hora</span>
          </div>
        </div>
      </div>
    </Card>
  )
}