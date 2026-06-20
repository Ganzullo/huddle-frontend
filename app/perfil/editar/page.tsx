"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CAMPUS_USM, CARRERAS_USM, ANIOS_INGRESO } from "@/lib/usm-data"
import { StepFoto } from "@/components/onboarding/step-foto"
import { SuccessOverlay } from "@/components/onboarding/success-overlay"
import { auth, db } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"

interface PerfilForm {
  nombreCompleto: string
  campus: string
  carrera: string
  anioIngreso: string
  descripcion: string
}

export default function EditarPerfilPage() {
  const router = useRouter()
  const [uid, setUid] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<PerfilForm>({
    nombreCompleto: "",
    campus: "",
    carrera: "",
    anioIngreso: "",
    descripcion: "",
  })
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/")
        return
      }
      setUid(firebaseUser.uid)
      const q = query(collection(db, "usuarios"), where("uid", "==", firebaseUser.uid))
      const snap = await getDocs(q)
      const data = snap.docs[0]?.data()
      if (cancelled) return
      if (data) {
        setForm({
          nombreCompleto: data.nombre_completo ?? "",
          campus: data.campus ?? "",
          carrera: data.carrera ?? "",
          anioIngreso: data.anio_ingreso ?? "",
          descripcion: data.descripcion_perfil ?? "",
        })
        setFotoPreview(data.url_foto_perfil || null)
      }
      setLoading(false)
    })
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [router])

  const canSave = Boolean(
    form.nombreCompleto && form.campus && form.carrera && form.anioIngreso
  )

  const handleSave = async () => {
    if (!uid || !canSave) return
    setSaving(true)
    setError(null)
    try {
      let url_foto_perfil: string | undefined = undefined

      if (fotoFile) {
        const uploadRes = await fetch(`/api/upload?uid=${uid}`, {
          method: "POST",
          headers: { "Content-Type": fotoFile.type },
          body: fotoFile,
        })
        if (uploadRes.ok) {
          const data = await uploadRes.json()
          url_foto_perfil = data.url
        }
      }

      const res = await fetch("/api/usuarios", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          nombre_completo: form.nombreCompleto,
          campus: form.campus,
          carrera: form.carrera,
          anioIngreso: form.anioIngreso,
          descripcion_perfil: form.descripcion,
          ...(url_foto_perfil ? { url_foto_perfil } : {}),
        }),
      })

      if (!res.ok) throw new Error("No se pudo guardar")

      setSuccess(true)
      setTimeout(() => {
        router.push("/perfil")
      }, 1200)
    } catch (e) {
      console.error("Error guardando perfil:", e)
      setError("No se pudo guardar tu perfil. Intenta nuevamente.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/40">
        <p className="text-sm text-muted-foreground">Cargando perfil...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/40 pb-10">
      
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-4xl items-center gap-2 px-4 md:h-16 md:gap-4">
          
          {/* Botón de regreso para Móvil */}
          <Link href="/perfil" className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden">
            <ArrowLeft className="size-5" />
          </Link>
          
          {/* Branding interactivo para PC */}
          <Link href="/dashboard" className="hidden shrink-0 items-center gap-2 md:flex transition-opacity hover:opacity-80">
            <GraduationCap className="size-6 text-[#0070f3]" strokeWidth={2.5} />
            <span className="text-lg font-bold text-[#0070f3]">Huddle USM</span>
          </Link>

          <h1 className="text-base font-semibold text-foreground md:text-lg md:ml-2">Editar perfil</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 md:py-8">
        
        {/* Contenedor Flex: 1 columna en móvil, 2 columnas en PC */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
          
          {/* ========================================== */}
          {/* COLUMNA IZQUIERDA: Selector de Foto        */}
          {/* ========================================== */}
          <div className="flex w-full flex-col md:w-[320px] md:shrink-0 md:sticky md:top-24">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <StepFoto
                preview={fotoPreview}
                onChange={(file, preview) => {
                  setFotoFile(file)
                  setFotoPreview(preview)
                }}
              />
            </div>
          </div>

          {/* ========================================== */}
          {/* COLUMNA DERECHA: Formulario de Datos       */}
          {/* ========================================== */}
          <div className="flex w-full flex-1 flex-col gap-6">
            
            <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="space-y-2">
                <Label>Nombre completo</Label>
                <Input
                  value={form.nombreCompleto}
                  onChange={(e) => setForm((f) => ({ ...f, nombreCompleto: e.target.value }))}
                  placeholder="Tu nombre completo"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label>Campus USM</Label>
                <Select value={form.campus} onValueChange={(v) => setForm((f) => ({ ...f, campus: v }))}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecciona tu campus" />
                  </SelectTrigger>
                  <SelectContent>
                    {CAMPUS_USM.map((campus) => (
                      <SelectItem key={campus} value={campus}>
                        {campus}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Carrera</Label>
                <Select value={form.carrera} onValueChange={(v) => setForm((f) => ({ ...f, carrera: v }))}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecciona tu carrera" />
                  </SelectTrigger>
                  <SelectContent>
                    {CARRERAS_USM.map((carrera) => (
                      <SelectItem key={carrera} value={carrera}>
                        {carrera}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Año de ingreso</Label>
                <Select
                  value={form.anioIngreso}
                  onValueChange={(v) => setForm((f) => ({ ...f, anioIngreso: v }))}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecciona tu año de ingreso" />
                  </SelectTrigger>
                  <SelectContent>
                    {ANIOS_INGRESO.map((anio) => (
                      <SelectItem key={anio} value={anio}>
                        {anio}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Descripción de perfil</Label>
                <Textarea
                  value={form.descripcion}
                  onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                  placeholder="Cuéntale a la comunidad USM un poco sobre ti..."
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>

            {error && <p className="text-sm font-medium text-red-500">{error}</p>}

            <Button
              type="button"
              onClick={handleSave}
              disabled={!canSave || saving}
              className="w-full h-12 rounded-xl bg-[#0070f3] text-base font-medium text-white shadow-sm hover:bg-[#0070f3]/90 transition-all active:scale-[0.98]"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
            
          </div>
        </div>
      </main>

      <SuccessOverlay visible={success} />
    </div>
  )
}