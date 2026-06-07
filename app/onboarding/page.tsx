"use client"

import { Suspense, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { GraduationCap, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StepDatosUsm } from "@/components/onboarding/step-datos-usm"
import { StepAlumno } from "@/components/onboarding/step-alumno"
import { StepTutor, type PerfilTutor } from "@/components/onboarding/step-tutor"
import { StepHibrido, type PerfilHibrido } from "@/components/onboarding/step-hibrido"
import { StepDisponibilidad } from "@/components/onboarding/step-disponibilidad"
import { SuccessOverlay } from "@/components/onboarding/success-overlay"
import type { RolOnboarding } from "@/lib/usm-data"

function OnboardingFlow() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const rol = (searchParams.get("rol") as RolOnboarding) || "inexperto"

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

  // Pasos según el rol
  const steps = useMemo(() => {
    if (rol === "inexperto") return ["datos", "alumno"] as const
    if (rol === "experto") return ["datos", "tutor", "disponibilidad"] as const
    return ["datos", "hibrido", "disponibilidad"] as const
  }, [rol])

  const [currentStep, setCurrentStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  // Estado de los datos
  const [datos, setDatos] = useState({ campus: "", carrera: "", anioIngreso: "" })
  const [ramosAlumno, setRamosAlumno] = useState<string[]>([])
  const [perfilTutor, setPerfilTutor] = useState<PerfilTutor>({
    precio: "",
    ramosDomina: [],
    bio: "",
    certificado: null,
  })
  const [perfilHibrido, setPerfilHibrido] = useState<PerfilHibrido>({
    ramosNecesita: [],
    precio: "",
    ramosDomina: [],
    certificado: null,
  })
  const [disponibilidad, setDisponibilidad] = useState<string[]>([])

  const totalSteps = steps.length
  const progress = ((currentStep + 1) / totalSteps) * 100
  const stepKey = steps[currentStep]
  const isLastStep = currentStep === totalSteps - 1

  const canContinue = useMemo(() => {
    if (stepKey === "datos") return Boolean(datos.campus && datos.carrera && datos.anioIngreso)
    if (stepKey === "alumno") return ramosAlumno.length > 0
    if (stepKey === "tutor") return Boolean(perfilTutor.precio && perfilTutor.ramosDomina.length > 0)
    if (stepKey === "hibrido")
      return Boolean(perfilHibrido.precio && perfilHibrido.ramosDomina.length > 0)
    if (stepKey === "disponibilidad") return disponibilidad.length > 0
    return true
  }, [stepKey, datos, ramosAlumno, perfilTutor, perfilHibrido, disponibilidad])

  const handleBack = () => {
    if (currentStep === 0) {
      router.push("/signup")
      return
    }
    setCurrentStep((s) => s - 1)
  }

  const handleNext = async () => {
    if (!canContinue) return
    if (!isLastStep) {
      setCurrentStep((s) => s + 1)
      return
    }

    // Finalizar: simular guardado total en la base de datos
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setSaving(false)
    setSuccess(true)

    // Animación de éxito breve antes de redirigir al dashboard
    setTimeout(() => {
      sessionStorage.removeItem("huddle_onboarding")
      router.push("/dashboard")
    }, 1600)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Barra de progreso sutil */}
      <div className="h-1 w-full bg-muted">
        <div
          className="h-full bg-[#0070f3] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="size-6 text-[#0070f3]" />
          <span className="text-lg font-bold text-foreground">Huddle</span>
        </div>
        <span className="text-sm font-medium text-muted-foreground">
          Paso {currentStep + 1} de {totalSteps}
        </span>
      </header>

      {/* Contenido del paso */}
      <main className="flex flex-1 items-start justify-center px-6 py-8 sm:py-12">
        <div className="w-full max-w-xl">
          {stepKey === "datos" && (
            <StepDatosUsm nombre={sessionInfo.nombre} value={datos} onChange={setDatos} />
          )}
          {stepKey === "alumno" && (
            <StepAlumno ramos={ramosAlumno} onChange={setRamosAlumno} />
          )}
          {stepKey === "tutor" && <StepTutor value={perfilTutor} onChange={setPerfilTutor} />}
          {stepKey === "hibrido" && (
            <StepHibrido value={perfilHibrido} onChange={setPerfilHibrido} />
          )}
          {stepKey === "disponibilidad" && (
            <StepDisponibilidad selected={disponibilidad} onChange={setDisponibilidad} />
          )}

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
              onClick={handleNext}
              disabled={!canContinue || saving}
              className="min-w-32 bg-[#0070f3] text-white hover:bg-[#0070f3]/90"
            >
              {saving ? "Guardando..." : isLastStep ? "Finalizar" : "Continuar"}
              {!saving && !isLastStep && <ArrowRight className="size-4" />}
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
