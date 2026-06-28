"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { GraduationCap, Search, User, Send, ArrowLeft, MessageSquare, Check, CheckCheck } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { db, auth } from "@/lib/firebase"
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  or,
  and,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore"

interface Mensaje {
  id: string
  propio: boolean
  texto: string
  hora: string
  leido: boolean
}

interface Conversacion {
  clave: string
  id_oferta: string
  id_receptor: string
  nombre: string
  ramo: string
  ultimoMensaje: string
  foto_url?: string
}

function Avatar({ nombre, foto_url, size = 11 }: { nombre?: string; foto_url?: string; size?: 9 | 11 }) {
  const dimension = size === 9 ? "size-9" : "size-11"
  const iconSize = size === 9 ? "size-4" : "size-5"

  if (foto_url) {
    return (
      <div className={cn("relative shrink-0 overflow-hidden rounded-full", dimension)}>
        <Image src={foto_url} alt={nombre ?? "Usuario"} fill className="object-cover" sizes="44px" />
      </div>
    )
  }

  return (
    <div className={cn("flex shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground", dimension)}>
      <User className={iconSize} />
    </div>
  )
}

// Check simple = enviado, doble gris = entregado, doble azul = leído
function CheckStatus({ propio, leido }: { propio: boolean; leido: boolean }) {
  if (!propio) return null
  return leido ? (
    <CheckCheck className="ml-1 inline-block size-3.5 shrink-0 text-sky-300" />
  ) : (
    <Check className="ml-1 inline-block size-3.5 shrink-0 text-white/60" />
  )
}

async function fetchPerfilesPorUids(uids: string[]): Promise<Record<string, { nombre: string; foto_url?: string }>> {
  if (uids.length === 0) return {}
  const q = query(collection(db, "usuarios"), where("uid", "in", uids))
  const snap = await getDocs(q)
  const result: Record<string, { nombre: string; foto_url?: string }> = {}
  snap.docs.forEach((doc) => {
    const d = doc.data()
    if (d.uid) {
      result[d.uid] = {
        nombre: d.nombre_completo ?? "Usuario",
        foto_url: d.url_foto_perfil,
      }
    }
  })
  return result
}

function MensajesContent() {
  const searchParams = useSearchParams()
  const tutorParam = searchParams.get("tutor")
  const ramoParam = searchParams.get("ramo")
  const ofertaParam = searchParams.get("oferta")
  const tutorUidParam = searchParams.get("tutorUid")

  const [uid, setUid] = useState<string>("")
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([])
  const [activaId, setActivaId] = useState<string>(
    ofertaParam && tutorUidParam ? `${ofertaParam}::${tutorUidParam}` : ""
  )
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [borrador, setBorrador] = useState("")
  const [miPerfil, setMiPerfil] = useState<{ nombre: string; foto_url?: string } | null>(null)
  const mensajesEndRef = useRef<HTMLDivElement>(null)

  // Obtener uid y perfil del usuario actual
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) { setUid(""); return }
      setUid(user.uid)
      const perfiles = await fetchPerfilesPorUids([user.uid])
      setMiPerfil(perfiles[user.uid] ?? null)
    })
    return () => unsub()
  }, [])

  // Cargar conversaciones únicas
  useEffect(() => {
    if (!uid) return

    const q = query(
      collection(db, "Mensajeria"),
      or(
        where("id_emisor", "==", uid),
        where("id_receptor", "==", uid)
      ),
      orderBy("timestamp", "desc")
    )

    const unsub = onSnapshot(q, async (snap) => {
      const vistas = new Set<string>()
      const lista: (Conversacion & { _otroUid: string })[] = []

      snap.docs.forEach((docSnap) => {
        const d = docSnap.data()
        const esEmisor = d.id_emisor === uid
        const otroUid = esEmisor ? d.id_receptor : d.id_emisor
        const clave = `${d.id_oferta}::${otroUid}`
        if (vistas.has(clave)) return
        vistas.add(clave)

        lista.push({
          clave,
          id_oferta: d.id_oferta,
          id_receptor: otroUid,
          nombre: (esEmisor ? d.nombre_receptor : d.nombre_emisor) ?? tutorParam ?? "Usuario",
          ramo: d.id_ramo ?? ramoParam ?? "Ayudantía",
          ultimoMensaje: d.contenido_cifrado ?? "",
          _otroUid: otroUid,
        })
      })

      if (ofertaParam && tutorUidParam) {
        const claveNueva = `${ofertaParam}::${tutorUidParam}`
        if (!vistas.has(claveNueva)) {
          lista.unshift({
            clave: claveNueva,
            id_oferta: ofertaParam,
            id_receptor: tutorUidParam,
            nombre: tutorParam ?? "Tutor",
            ramo: ramoParam ?? "Ayudantía",
            ultimoMensaje: "Canal directo abierto. ¡Escribe tu primer mensaje!",
            _otroUid: tutorUidParam,
          })
        }
      }

      const otrosUids = [...new Set(lista.map((c) => c._otroUid).filter(Boolean))]
      const perfiles = await fetchPerfilesPorUids(otrosUids)

      const listaFinal: Conversacion[] = lista.map(({ _otroUid, ...c }) => ({
        ...c,
        nombre: perfiles[_otroUid]?.nombre ?? c.nombre,
        foto_url: perfiles[_otroUid]?.foto_url,
      }))

      setConversaciones(listaFinal)
    })

    return () => unsub()
  }, [uid, ofertaParam, tutorParam, ramoParam, tutorUidParam])

  const activa = conversaciones.find((c) => c.clave === activaId) ?? null

  // Cargar mensajes y marcar como leídos los recibidos
  useEffect(() => {
    if (!activa || !uid || !activa.id_receptor) {
      setMensajes([])
      return
    }

    const q = query(
      collection(db, "Mensajeria"),
      and(
        where("id_oferta", "==", activa.id_oferta),
        or(
          and(where("id_emisor", "==", uid), where("id_receptor", "==", activa.id_receptor)),
          and(where("id_emisor", "==", activa.id_receptor), where("id_receptor", "==", uid))
        )
      ),
      orderBy("timestamp", "asc")
    )

    const unsub = onSnapshot(q, (snap) => {
      const msgs: Mensaje[] = snap.docs.map((docSnap) => {
        const d = docSnap.data()
        const ts = d.timestamp?.toDate?.()

        // Marcar como leído si soy el receptor y aún no está leído
        if (d.id_receptor === uid && !d.leido) {
          updateDoc(doc(db, "Mensajeria", docSnap.id), { leido: true }).catch(() => {})
        }

        return {
          id: docSnap.id,
          propio: d.id_emisor === uid,
          texto: d.contenido_cifrado ?? "",
          hora: ts
            ? ts.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })
            : "",
          leido: d.leido ?? false,
        }
      })

      setMensajes(msgs)
      setTimeout(() => mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50)
    })

    return () => unsub()
  }, [activa?.id_oferta, activa?.id_receptor, uid])

  const conversacionesFiltradas = conversaciones.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.ramo.toLowerCase().includes(busqueda.toLowerCase()),
  )

  async function enviarMensaje(e: React.FormEvent) {
    e.preventDefault()
    if (!borrador.trim() || !activa || !uid) return

    const texto = borrador.trim()
    setBorrador("")

    await addDoc(collection(db, "Mensajeria"), {
      id_emisor: uid,
      id_receptor: activa.id_receptor ?? "",
      id_oferta: activa.id_oferta,
      id_ramo: activa.ramo,
      nombre_emisor: miPerfil?.nombre ?? "",
      nombre_receptor: activa.nombre,
      contenido_cifrado: texto,
      leido: false,  // siempre empieza sin leer
      timestamp: serverTimestamp(),
    })
  }

  return (
    <div className="flex h-screen flex-col bg-secondary/40">
      <header className="shrink-0 border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link href="/dashboard" className="flex shrink-0 items-center gap-2">
            <GraduationCap className="size-7 text-[#0070f3]" strokeWidth={2} />
            <span className="hidden text-lg font-bold text-[#0070f3] sm:inline">Huddle USM</span>
          </Link>
          <h1 className="text-base font-semibold text-foreground">Mensajes</h1>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 overflow-hidden px-0 sm:px-6 sm:py-4">
        <div className="flex w-full overflow-hidden rounded-none border-border bg-card sm:rounded-2xl sm:border">

          {/* Lista de conversaciones */}
          <aside className={cn("flex w-full flex-col border-r border-border sm:w-80 sm:shrink-0", activa && "hidden sm:flex")}>
            <div className="border-b border-border p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar conversación..."
                  className="h-9 rounded-full bg-secondary pl-9"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversacionesFiltradas.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
                  <div className="flex size-11 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                    <Search className="size-5" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {busqueda ? "Sin resultados" : "Sin mensajes nuevos"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {busqueda ? "Prueba con otro nombre o ramo." : "Cuando inicies una conversación aparecerá aquí."}
                  </p>
                </div>
              ) : (
                conversacionesFiltradas.map((c) => (
                  <button
                    key={c.clave}
                    type="button"
                    onClick={() => setActivaId(c.clave)}
                    className={cn(
                      "flex w-full items-center gap-3 border-b border-border/60 px-3 py-3 text-left transition-colors hover:bg-secondary/60",
                      activaId === c.clave && "bg-[#0070f3]/5",
                    )}
                  >
                    <Avatar nombre={c.nombre} foto_url={c.foto_url} size={11} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-foreground">{c.nombre}</span>
                        <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {c.ramo}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{c.ultimoMensaje}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </aside>

          {/* Conversación activa */}
          <section className={cn("flex min-w-0 flex-1 flex-col", !activa && "hidden sm:flex")}>
            {activa ? (
              <>
                <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3">
                  <Button variant="ghost" size="icon" className="rounded-full sm:hidden" onClick={() => setActivaId("")}>
                    <ArrowLeft className="size-5" />
                  </Button>
                  <Link href={`/perfil/${activa.id_receptor}`} className="shrink-0">
                    <Avatar nombre={activa.nombre} foto_url={activa.foto_url} size={9} />
                  </Link>
                  <Link href={`/perfil/${activa.id_receptor}`} className="min-w-0 hover:opacity-80 transition-opacity">
                    <p className="truncate text-sm font-semibold text-foreground">{activa.nombre}</p>
                    <p className="text-xs text-muted-foreground">{activa.ramo}</p>
                  </Link>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto bg-secondary/30 p-4">
                  {mensajes.length === 0 ? (
                    <p className="mt-8 text-center text-sm text-muted-foreground">
                      No hay mensajes aún. ¡Inicia la conversación!
                    </p>
                  ) : (
                    mensajes.map((m) => (
                      <div key={m.id} className={cn("flex items-end gap-2", m.propio ? "justify-end" : "justify-start")}>
                        {!m.propio && (
                          <Avatar nombre={activa.nombre} foto_url={activa.foto_url} size={9} />
                        )}
                        <div className={cn(
                          "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                          m.propio ? "bg-[#0070f3] text-white" : "border border-border bg-card text-foreground",
                        )}>
                          <p className="leading-relaxed">{m.texto}</p>
                          <span className={cn(
                            "mt-1 flex items-center justify-end gap-0.5 text-[10px]",
                            m.propio ? "text-white/70" : "text-muted-foreground"
                          )}>
                            {m.hora}
                            <CheckStatus propio={m.propio} leido={m.leido} />
                          </span>
                        </div>
                        {m.propio && (
                          <Avatar nombre={miPerfil?.nombre} foto_url={miPerfil?.foto_url} size={9} />
                        )}
                      </div>
                    ))
                  )}
                  <div ref={mensajesEndRef} />
                </div>

                <form onSubmit={enviarMensaje} className="flex shrink-0 items-center gap-2 border-t border-border bg-card p-3">
                  <Input
                    value={borrador}
                    onChange={(e) => setBorrador(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="h-11 flex-1 rounded-full bg-secondary"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!borrador.trim()}
                    className="size-11 shrink-0 rounded-full bg-[#0070f3] text-white hover:bg-[#0070f3]/90"
                  >
                    <Send className="size-5" />
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                  <MessageSquare className="size-6" />
                </div>
                <p className="text-sm font-medium text-foreground">Sin mensajes nuevos</p>
                <p className="max-w-xs text-sm text-muted-foreground">
                  Selecciona una conversación o inicia una nueva desde una oferta.
                </p>
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