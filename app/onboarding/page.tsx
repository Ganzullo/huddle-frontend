"use client"

import { Suspense, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { GraduationCap, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StepDatosUsm } from "@/components/onboarding/step-datos-usm"
import { SuccessOverlay } from "@/components/onboarding/success-overlay"

function OnboardingFlow() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const sessionInfo = useMemo(() => {
    if (typeof window === "undefined") return { nombre: "", uid: "" }
    try {
      const raw = sessionStorage.getItem("huddle_onboarding")
      if (raw) return JSON.parse(raw) as { nombre: string; uid: string }
    } catch {
      // noop
    }
    return { nombre: "", uid: "" }
  }, [])

  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [datos, setDatos] = useState({ campus: "", carrera: "", anioIngreso: "" })

  const canContinue = Boolean(datos.campus && datos.carrera && datos.anioIngreso)

  const handleBack = () => router.push("/signup")

  const handleFinish = async () => {
    if (!canContinue) return

    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setSaving(false)
    setSuccess(true)

    setTimeout(() => {
      sessionStorage.removeItem("huddle_onboarding")
      router.push("/dashboard")
    }, 1600)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Barra de progreso — siempre al 100% porque es 1 solo paso */}
      <div className="h-1 w-full bg-muted">
        <div className="h-full bg-[#0070f3] w-full transition-all duration-500 ease-out" />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="size-6 text-[#0070f3]" />
          <span className="text-lg font-bold text-foreground">Huddle USM</span>
        </div>
        <span className="text-sm font-medium text-muted-foreground">
          Paso 1 de 1
        </span>
      </header>

      {/* Contenido */}
      <main className="flex flex-1 items-start justify-center px-6 py-8 sm:py-12">
        <div className="w-full max-w-xl">
          <StepDatosUsm
            nombre={sessionInfo.nombre}
            value={datos}
            onChange={setDatos}
          />

          {/* Navegación */}
          <div className="mt-8 flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              className="text-muted-foreground"
            >
              <ArrowLeft className="size-4" />
              Atrás
            </Button>
            <Button
              type="button"
              onClick={handleFinish}
              disabled={!canContinue || saving}
              className="min-w-32 bg-[#0070f3] text-white hover:bg-[#0070f3]/90"
            >
              {saving ? "Guardando..." : "Finalizar"}
            </Button>
          </div>
        </div>
      </main>

      <SuccessOverlay visible={success} />
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingFlow />
    </Suspense>
  )
}