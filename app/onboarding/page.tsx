"use client"

import { Suspense, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StepDatosUsm } from "@/components/onboarding/step-datos-usm"
import { StepFoto } from "@/components/onboarding/step-foto"
import { SuccessOverlay } from "@/components/onboarding/success-overlay"
import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

const STEPS = ["datos", "foto"] as const
type Step = typeof STEPS[number]

function OnboardingFlow() {
  const router = useRouter()

  const sessionInfo = useMemo(() => {
    if (typeof window === "undefined") return { nombre: "", uid: "" }
    try {
      const raw = sessionStorage.getItem("huddle_onboarding")
      if (raw) return JSON.parse(raw) as { nombre: string; uid: string }
    } catch { /* noop */ }
    return { nombre: "", uid: "" }
  }, [])

  const [currentStep, setCurrentStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const [datos, setDatos] = useState({ campus: "", carrera: "", anioIngreso: "" })
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)

  const totalSteps = STEPS.length
  const progress = ((currentStep + 1) / totalSteps) * 100
  const stepKey: Step = STEPS[currentStep]
  const isLastStep = currentStep === totalSteps - 1

  const canContinue = useMemo(() => {
    if (stepKey === "datos") return Boolean(datos.campus && datos.carrera && datos.anioIngreso)
    if (stepKey === "foto") return true
    return true
  }, [stepKey, datos])

  const handleBack = () => {
    if (currentStep === 0) { router.push("/signup"); return }
    setCurrentStep((s) => s - 1)
  }

  const handleNext = async () => {
    if (!canContinue) return

    if (!isLastStep) {
      setCurrentStep((s) => s + 1)
      return
    }

    setSaving(true)
    try {
      let url_foto_perfil = ""

      if (fotoFile) {
        const storageRef = ref(storage, `fotos-perfil/${sessionInfo.uid}`)
        await uploadBytes(storageRef, fotoFile)
        url_foto_perfil = await getDownloadURL(storageRef)
      }

      await fetch("/api/usuarios", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: sessionInfo.uid,
          campus: datos.campus,
          carrera: datos.carrera,
          anioIngreso: datos.anioIngreso,
          url_foto_perfil,
        }),
      })
    } catch (e) {
      console.error("Error guardando perfil:", e)
    } finally {
      setSaving(false)
    }

    // Guardar campus en sessionStorage para prefiltrar el dashboard
    if (typeof window !== "undefined") {
      const raw = sessionStorage.getItem("huddle_onboarding")
      const prev = raw ? JSON.parse(raw) : {}
      sessionStorage.setItem(
        "huddle_session",
        JSON.stringify({
          ...prev,
          campus: datos.campus,
          carrera: datos.carrera,
        })
      )
    }

    setSuccess(true)
    setTimeout(() => {
      sessionStorage.removeItem("huddle_onboarding")
      router.push("/dashboard")
    }, 1600)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="h-1 w-full bg-muted">
        <div
          className="h-full bg-[#0070f3] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="size-6 text-[#0070f3]" />
          <span className="text-lg font-bold text-foreground">Huddle USM</span>
        </div>
        <span className="text-sm font-medium text-muted-foreground">
          Paso {currentStep + 1} de {totalSteps}
        </span>
      </header>

      <main className="flex flex-1 items-start justify-center px-6 py-8 sm:py-12">
        <div className="w-full max-w-xl">
          {stepKey === "datos" && (
            <StepDatosUsm
              nombre={sessionInfo.nombre}
              value={datos}
              onChange={setDatos}
            />
          )}
          {stepKey === "foto" && (
            <StepFoto
              preview={fotoPreview}
              onChange={(file, preview) => {
                setFotoFile(file)
                setFotoPreview(preview)
              }}
            />
          )}

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
              {saving ? (
                "Guardando..."
              ) : isLastStep ? (
                "Finalizar"
              ) : (
                <>
                  Continuar
                  <ArrowRight className="size-4" />
                </>
              )}
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