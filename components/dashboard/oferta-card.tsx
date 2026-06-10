"use client"

import { useState } from "react"
import { Star, Heart, MapPin, Wifi, Building2, Clock, User } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { cn } from "@/lib/utils"

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
  horarios?: string[]
}

const AVATAR_COLORS = [
  { bg: "bg-[#E6F1FB]", text: "text-[#185FA5]" },
  { bg: "bg-[#EAF3DE]", text: "text-[#3B6D11]" },
  { bg: "bg-[#FAEEDA]", text: "text-[#854F0B]" },
  { bg: "bg-[#EEEDFE]", text: "text-[#534AB7]" },
  { bg: "bg-[#E1F5EE]", text: "text-[#0F6E56]" },
]

function getAvatarColor(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function formatPrecio(precio?: number) {
  if (!precio && precio !== 0) return "$0"
  return "$" + precio.toLocaleString("es-CL")
}

const BLOQUE_HORA: Record<string, string> = {
  "1-2": "08:15",
  "3-4": "09:40",
  "5-6": "11:05",
  "7-8": "12:30",
  "9-10": "14:40",
  "11-12": "16:05",
  "13-14": "17:30",
}

const DIA_ABREV: Record<string, string> = {
  Lunes: "Lun",
  Martes: "Mar",
  "Miércoles": "Mié",
  Jueves: "Jue",
  Viernes: "Vie",
  "Sábado": "Sáb",
  Domingo: "Dom",
}

function parseBloque(key: string): string | null {
  const firstDash = key.indexOf("-")
  if (firstDash === -1) return null
  const dia = key.slice(0, firstDash)
  const bloqueId = key.slice(firstDash + 1)
  const abrev = DIA_ABREV[dia]
  const hora = BLOQUE_HORA[bloqueId]
  if (!abrev || !hora) return null
  return `${abrev} ${hora}`
}

const MAX_BLOQUES_VISIBLES = 4

function AvatarTutor({
  nombre,
  foto_url,
  id,
}: {
  nombre?: string
  foto_url?: string
  id: string
}) {
  const iniciales = nombre
    ? nombre.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase()
    : null
  const color = getAvatarColor(id)

  if (foto_url) {
    return (
      <div className="relative size-11 shrink-0 overflow-hidden rounded-full">
        <Image src={foto_url} alt={nombre ?? "Tutor"} fill className="object-cover" sizes="44px" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-medium",
        color.bg,
        color.text,
      )}
      aria-hidden="true"
    >
      {iniciales ?? <User className="size-5" />}
    </div>
  )
}

export function OfertaCard({ oferta, onVerDisponibilidad }: { oferta: Oferta; onVerDisponibilidad?: (oferta: Oferta) => void }) {
  const [favorito, setFavorito] = useState(false)

  const bloquesParseados = (oferta.horarios ?? [])
    .map(parseBloque)
    .filter(Boolean) as string[]

  const bloquesVisibles = bloquesParseados.slice(0, MAX_BLOQUES_VISIBLES)
  const bloquesSobrantes = bloquesParseados.length - bloquesVisibles.length

  return (
    <Card className="flex flex-row items-start gap-3 p-4 transition-shadow hover:shadow-sm sm:gap-4 sm:p-5">
      <AvatarTutor nombre={oferta.nombre_tutor} foto_url={oferta.foto_url} id={oferta.id} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Ramo + corazón */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#0070f3]">
              {oferta.id_ramo}
            </p>
            <h3 className="text-sm font-semibold leading-snug text-foreground text-pretty">
              {oferta.nombre_ramo ?? oferta.id_ramo}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setFavorito((f) => !f)}
            className="shrink-0 text-muted-foreground/50 transition-colors hover:text-[#0070f3]"
            aria-label={favorito ? "Quitar de favoritos" : "Guardar en favoritos"}
            aria-pressed={favorito}
          >
            <Heart className={cn("size-4", favorito && "fill-[#0070f3] text-[#0070f3]")} />
          </button>
        </div>

        {/* Tutor + rating */}
        <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs">
          <span className="text-muted-foreground">{oferta.nombre_tutor ?? "Tutor"}</span>
          {oferta.rating != null ? (
            <>
              <span className="text-muted-foreground/40">·</span>
              <span className="flex items-center gap-0.5 font-medium text-foreground">
                <Star className="size-3 fill-yellow-400 text-yellow-400" />
                {oferta.rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground/60">
                ({oferta.reviews ?? 0} {oferta.reviews === 1 ? "reseña" : "reseñas"})
              </span>
            </>
          ) : (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
              Sin reseñas aún
            </span>
          )}
        </div>

        {/* Pills: modalidad + sede */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
            {oferta.modalidad === "online" ? (
              <Wifi className="size-3" />
            ) : (
              <MapPin className="size-3" />
            )}
            <span className="capitalize">{oferta.modalidad}</span>
          </span>
          {oferta.sede && (
            <span className="flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
              <Building2 className="size-3" />
              {oferta.sede}
            </span>
          )}
        </div>

        {/* Descripción */}
        {oferta.descripcion && (
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground text-pretty">
            {oferta.descripcion}
          </p>
        )}

        {/* Horarios */}
        {bloquesVisibles.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1">
            <Clock className="size-3 shrink-0 text-muted-foreground/50" aria-hidden="true" />
            {bloquesVisibles.map((b) => (
              <span
                key={b}
                className="rounded-md border border-border bg-secondary/60 px-1.5 py-0.5 text-[11px] text-muted-foreground"
              >
                {b}
              </span>
            ))}
            {bloquesSobrantes > 0 && (
              <span className="text-[11px] text-muted-foreground/50">+{bloquesSobrantes} más</span>
            )}
          </div>
        )}

        {/* Footer: contador + precio */}
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-[11px] text-muted-foreground/60">
            {bloquesParseados.length}{" "}
            {bloquesParseados.length === 1 ? "bloque disponible" : "bloques disponibles"}
          </span>
          <div className="text-right">
            <span className="text-base font-semibold text-foreground">
              {formatPrecio(oferta.precio_referencial)}
            </span>
            <span className="ml-1 text-[11px] text-muted-foreground">/ hr</span>
          </div>
        </div>

        {/* Acción */}
        <Button
          type="button"
          onClick={() => onVerDisponibilidad?.(oferta)}
          className="mt-3 w-full rounded-full bg-[#0070f3] text-white hover:bg-[#0070f3]/90"
        >
          Ver disponibilidad
        </Button>
      </div>
    </Card>
  )
}
