"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, AlertCircle, BookOpen, HandHelping } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OfertaCard } from "@/components/dashboard/oferta-card"
import { OfertaDetalle } from "@/components/dashboard/oferta-detalle"
import { listarFavoritos } from "@/lib/favoritos"
import { solicitudComoOferta, type SolicitudAyudantia, type OfertaTutoria } from "@/lib/mappers"
import { cn } from "@/lib/utils"

type Tab = "ofertas" | "solicitudes"

export default function GuardadosPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("ofertas")
  const [ofertas, setOfertas] = useState<OfertaTutoria[]>([])
  // Las solicitudes guardadas se mapean a la misma forma de "Oferta" para reusar OfertaCard,
  // igual que hace dashboard-page.tsx con solicitudComoOferta().
  const [solicitudes, setSolicitudes] = useState<OfertaTutoria[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uid, setUid] = useState("")

  // Estado para el modal de "Ver disponibilidad", igual que en dashboard-page.tsx
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState<OfertaTutoria | null>(null)
  const [detalleAbierto, setDetalleAbierto] = useState(false)

  useEffect(() => {
    let cancelled = false
    const { auth } = require("@/lib/firebase")
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: any) => {
      if (!firebaseUser) {
        router.push("/")
        return
      }
      setUid(firebaseUser.uid)
      try {
        await cargarGuardados(firebaseUser.uid)
        if (!cancelled) setError(null)
      } catch (err) {
        console.error("Error cargando guardados:", err)
        if (!cancelled) setError("No se pudieron cargar tus publicaciones guardadas.")
      } finally {
        if (!cancelled) setCargando(false)
      }
    })
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  const cargarGuardados = async (userId: string) => {
    const { db } = require("@/lib/firebase")
    const { doc, getDoc } = await import("firebase/firestore")

    const favoritos = await listarFavoritos(userId)
    const favOfertas = favoritos.filter((f) => f.tipo === "oferta")
    const favSolicitudes = favoritos.filter((f) => f.tipo === "solicitud")

    const [ofertasDocs, solicitudesDocs] = await Promise.all([
      Promise.all(favOfertas.map((f) => getDoc(doc(db, "Ofertas_Tutoria", f.id_publicacion)))),
      Promise.all(favSolicitudes.map((f) => getDoc(doc(db, "Solicitudes_Ayudantia", f.id_publicacion)))),
    ])

    // Filtramos documentos que ya no existen (publicación borrada por su autor,
    // pero el favorito quedó huérfano) para no romper el render.
    setOfertas(
      ofertasDocs
        .filter((d) => d.exists())
        .map((d) => ({ id: d.id, ...(d.data() as any) }))
    )

    setSolicitudes(
      solicitudesDocs
        .filter((d) => d.exists())
        .map((d) => solicitudComoOferta({ id: d.id, ...(d.data() as any) } as SolicitudAyudantia))
    )
  }

  const quitarDeLista = (tipo: Tab, idPublicacion: string, esFavoritoAhora: boolean) => {
    // Solo nos interesa reaccionar cuando se DESMARCA, porque eso significa
    // que debe desaparecer de "Guardados".
    if (esFavoritoAhora) return
    if (tipo === "ofertas") {
      setOfertas((prev) => prev.filter((o) => o.id !== idPublicacion))
    } else {
      setSolicitudes((prev) => prev.filter((s) => s.id !== idPublicacion))
    }
  }

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-4">
          <Link href="/perfil" className="rounded-full p-1.5 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-base font-semibold text-foreground">Guardados</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-6 flex border-b border-border">
          <button
            onClick={() => setTab("ofertas")}
            className={cn(
              "flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
              tab === "ofertas" ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <BookOpen className="w-4 h-4" />
            Tutorías
            <span className="text-xs bg-muted rounded-full px-2 py-0.5">{ofertas.length}</span>
          </button>
          <button
            onClick={() => setTab("solicitudes")}
            className={cn(
              "flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
              tab === "solicitudes" ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <HandHelping className="w-4 h-4" />
            Solicitudes
            <span className="text-xs bg-muted rounded-full px-2 py-0.5">{solicitudes.length}</span>
          </button>
        </div>

        {cargando ? (
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 w-full animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <AlertCircle className="size-10 text-red-400" />
            <p className="text-sm text-red-600 max-w-sm">{error}</p>
            <Button
              variant="outline"
              onClick={() => {
                setCargando(true)
                setError(null)
                cargarGuardados(uid)
                  .catch(() => setError("No se pudieron cargar tus publicaciones guardadas."))
                  .finally(() => setCargando(false))
              }}
            >
              Reintentar
            </Button>
          </div>
        ) : tab === "ofertas" ? (
          ofertas.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <Heart className="size-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No tienes tutorías guardadas aún.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {ofertas.map((o) => (
                <OfertaCard
                  key={o.id}
                  oferta={o as any}
                  onVerDisponibilidad={(of) => {
                    setOfertaSeleccionada(of as OfertaTutoria)
                    setDetalleAbierto(true)
                  }}
                  onFavoritoChange={(id, esFav) => quitarDeLista("ofertas", id, esFav)}
                />
              ))}
            </div>
          )
        ) : solicitudes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <Heart className="size-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No tienes solicitudes guardadas aún.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {solicitudes.map((s) => (
              <OfertaCard
                key={s.id}
                oferta={s as any}
                esSolicitud
                onVerDisponibilidad={(of) => {
                  setOfertaSeleccionada(of as OfertaTutoria)
                  setDetalleAbierto(true)
                }}
                onFavoritoChange={(id, esFav) => quitarDeLista("solicitudes", id, esFav)}
              />
            ))}
          </div>
        )}
      </main>

      <OfertaDetalle
        oferta={ofertaSeleccionada as any}
        open={detalleAbierto}
        onOpenChange={setDetalleAbierto}
      />
    </div>
  )
}