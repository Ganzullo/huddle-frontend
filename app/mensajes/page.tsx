"use client"

import { Suspense, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { GraduationCap, Search, User, Send, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Mensaje {
  id: string
  propio: boolean
  texto: string
  hora: string
}

interface Conversacion {
  id: string
  nombre: string
  ramo: string
  ultimoMensaje: string
  mensajes: Mensaje[]
}

// Datos de ejemplo (estructura lista para conectar con la base de datos)
const CONVERSACIONES_INICIALES: Conversacion[] = [
  {
    id: "c1",
    nombre: "Camila Rojas",
    ramo: "MAT021",
    ultimoMensaje: "Perfecto, nos vemos el martes en el bloque 3-4.",
    mensajes: [
      { id: "m1", propio: false, texto: "Hola! Vi que necesitas ayuda con cálculo.", hora: "10:24" },
      { id: "m2", propio: true, texto: "Sí, justamente para el certamen 2.", hora: "10:26" },
      { id: "m3", propio: false, texto: "Perfecto, nos vemos el martes en el bloque 3-4.", hora: "10:28" },
    ],
  },
  {
    id: "c2",
    nombre: "Diego Fuentes",
    ramo: "FIS110",
    ultimoMensaje: "Te paso las guías de ejercicios resueltas.",
    mensajes: [
      { id: "m1", propio: false, texto: "Te paso las guías de ejercicios resueltas.", hora: "Ayer" },
    ],
  },
  {
    id: "c3",
    nombre: "Valentina Soto",
    ramo: "IWI131",
    ultimoMensaje: "¿Tienes disponibilidad esta semana?",
    mensajes: [
      { id: "m1", propio: true, texto: "Hola Valentina, ¿tienes disponibilidad esta semana?", hora: "Lun" },
    ],
  },
]

function MensajesContent() {
  const searchParams = useSearchParams()
  const tutorParam = searchParams.get("tutor")
  const ramoParam = searchParams.get("ramo")

  const conversaciones = useMemo<Conversacion[]>(() => {
    if (tutorParam) {
      const nueva: Conversacion = {
        id: "nuevo",
        nombre: tutorParam,
        ramo: ramoParam || "Ayudantía",
        ultimoMensaje: "Canal directo abierto. ¡Escribe tu primer mensaje!",
        mensajes: [],
      }
      return [nueva, ...CONVERSACIONES_INICIALES]
    }
    return CONVERSACIONES_INICIALES
  }, [tutorParam, ramoParam])

  const [activaId, setActivaId] = useState<string>(conversaciones[0]?.id ?? "")
  const [busqueda, setBusqueda] = useState("")
  const [borrador, setBorrador] = useState("")
  const [mensajesPorChat, setMensajesPorChat] = useState<Record<string, Mensaje[]>>(() =>
    Object.fromEntries(conversaciones.map((c) => [c.id, c.mensajes])),
  )

  const conversacionesFiltradas = conversaciones.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.ramo.toLowerCase().includes(busqueda.toLowerCase()),
  )

  const activa = conversaciones.find((c) => c.id === activaId) ?? null
  const mensajesActivos = activa ? mensajesPorChat[activa.id] ?? [] : []

  function enviarMensaje(e: React.FormEvent) {
    e.preventDefault()
    if (!borrador.trim() || !activa) return
    const nuevo: Mensaje = {
      id: `m-${Date.now()}`,
      propio: true,
      texto: borrador.trim(),
      hora: new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }),
    }
    setMensajesPorChat((prev) => ({
      ...prev,
      [activa.id]: [...(prev[activa.id] ?? []), nuevo],
    }))
    setBorrador("")
  }

  return (
    <div className="flex h-screen flex-col bg-secondary/40">
      {/* Header */}
      <header className="shrink-0 border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link href="/dashboard" className="flex shrink-0 items-center gap-2">
            <GraduationCap className="size-7 text-[#0070f3]" strokeWidth={2} />
            <span className="hidden text-lg font-bold text-[#0070f3] sm:inline">Huddle USM</span>
          </Link>
          <h1 className="text-base font-semibold text-foreground">Mensajes</h1>
        </div>
      </header>

      {/* Split view */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 overflow-hidden px-0 sm:px-6 sm:py-4">
        <div className="flex w-full overflow-hidden rounded-none border-border bg-card sm:rounded-2xl sm:border">
          {/* Columna izquierda: lista de chats */}
          <aside
            className={cn(
              "flex w-full flex-col border-r border-border sm:w-80 sm:shrink-0",
              activa && "hidden sm:flex",
            )}
          >
            <div className="border-b border-border p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar conversación..."
                  className="h-9 rounded-full bg-secondary pl-9"
                  aria-label="Buscar conversación"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversacionesFiltradas.length === 0 ? (
                <p className="p-4 text-center text-sm text-muted-foreground">Sin conversaciones</p>
              ) : (
                conversacionesFiltradas.map((c) => {
                  const ultimo = (mensajesPorChat[c.id] ?? []).at(-1)?.texto ?? c.ultimoMensaje
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActivaId(c.id)}
                      className={cn(
                        "flex w-full items-center gap-3 border-b border-border/60 px-3 py-3 text-left transition-colors hover:bg-secondary/60",
                        activaId === c.id && "bg-[#0070f3]/5",
                      )}
                    >
                      <div
                        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground"
                        aria-hidden="true"
                      >
                        <User className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-semibold text-foreground">{c.nombre}</span>
                          <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {c.ramo}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">{ultimo}</p>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </aside>

          {/* Columna derecha: conversación activa */}
          <section className={cn("flex min-w-0 flex-1 flex-col", !activa && "hidden sm:flex")}>
            {activa ? (
              <>
                {/* Cabecera conversación */}
                <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full sm:hidden"
                    onClick={() => setActivaId("")}
                    aria-label="Volver a la lista"
                  >
                    <ArrowLeft className="size-5" />
                  </Button>
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground"
                    aria-hidden="true"
                  >
                    <User className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{activa.nombre}</p>
                    <p className="text-xs text-muted-foreground">{activa.ramo}</p>
                  </div>
                </div>

                {/* Mensajes */}
                <div className="flex-1 space-y-3 overflow-y-auto bg-secondary/30 p-4">
                  {mensajesActivos.length === 0 ? (
                    <p className="mt-8 text-center text-sm text-muted-foreground">
                      No hay mensajes aún. ¡Inicia la conversación!
                    </p>
                  ) : (
                    mensajesActivos.map((m) => (
                      <div
                        key={m.id}
                        className={cn("flex", m.propio ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                            m.propio
                              ? "bg-[#0070f3] text-white"
                              : "border border-border bg-card text-foreground",
                          )}
                        >
                          <p className="leading-relaxed">{m.texto}</p>
                          <span
                            className={cn(
                              "mt-1 block text-right text-[10px]",
                              m.propio ? "text-white/70" : "text-muted-foreground",
                            )}
                          >
                            {m.hora}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input */}
                <form
                  onSubmit={enviarMensaje}
                  className="flex shrink-0 items-center gap-2 border-t border-border bg-card p-3"
                >
                  <Input
                    value={borrador}
                    onChange={(e) => setBorrador(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="h-11 flex-1 rounded-full bg-secondary"
                    aria-label="Escribe un mensaje"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!borrador.trim()}
                    className="size-11 shrink-0 rounded-full bg-[#0070f3] text-white hover:bg-[#0070f3]/90"
                    aria-label="Enviar mensaje"
                  >
                    <Send className="size-5" />
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-muted-foreground">
                Selecciona una conversación para empezar a chatear.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default function MensajesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-secondary/40" />}>
      <MensajesContent />
    </Suspense>
  )
}
