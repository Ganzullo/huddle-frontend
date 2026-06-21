"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, AlertCircle, BookOpen, HandHelping } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OfertaCard } from "@/components/ofertas/oferta-card" // ajusta esta ruta a donde tengas tu OfertaCard real
import { listarFavoritos } from "@/lib/favoritos"
import { cn } from "@/lib/utils"

interface OfertaGuardada {
  id: string
  id_tutor: string
  id_ramo: string
  nombre_ramo?: string
  sede?: string
  modalidad: string
  precio_referencial?: number
  descripcion?: string
  nombre_tutor?: string
  foto_url?: string
  horarios?: string[]
}

interface SolicitudGuardada {
  id: string
  id_alumno: string
  id_ramo: string
  sede?: string
  modalidad: string
  presupuesto?: number
  descripcion?: string
  nombre_alumno?: string
  horarios?: string[]
}

type Tab = "ofertas" | "solicitudes"

export default function GuardadosPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("ofertas")
  const [ofertas, setOfertas] = useState<OfertaGuardada[]>([])
  const [solicitudes, setSolicitudes] = useState<SolicitudGuardada[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uid, setUid] = useState("")

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

    // Filtramos documentos que ya no existen (oferta/solicitud borrada por su autor
    // pero el favorito quedó huérfano) para no romper el render.
    setOfertas(
      ofertasDocs
        .filter((d) => d.exists())
        .map((d) => ({ id: d.id, ...(d.data() as any) }))
    )
    setSolicitudes(
      solicitudesDocs
        .filter((d) => d.exists())
        .map((d) => ({ id: d.id, ...(d.data() as any) }))
    )
  }

  const quitarDeLista = (tipo: Tab, idPublicacion: string, esFavoritoAhora: boolean) => {
    // Solo nos interesa reaccionar cuando se DESMARCA (deja de ser favorito),
    // porque eso significa que debe desaparecer de "Guardados".
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
            {/*
              TODO: reemplazar este bloque por tu componente <SolicitudCard /> real,
              pasándole onFavoritoChange={(id, esFav) => quitarDeLista("solicitudes", id, esFav)}
              igual que en OfertaCard, una vez que me compartas ese archivo.
            */}
            {solicitudes.map((s) => (
              <div key={s.id} className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#0070f3]">{s.id_ramo}</p>
                <p className="mt-1 text-xs text-muted-foreground capitalize">
                  {s.modalidad} · {s.sede}
                </p>
                {s.presupuesto != null && (
                  <p className="text-xs text-muted-foreground">${s.presupuesto.toLocaleString("es-CL")} / hr</p>
                )}
                {s.descripcion && (
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground border-t border-border pt-2">
                    {s.descripcion}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}