"use client"

import { Check } from "lucide-react"

export function SuccessOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-5 px-6 text-center">
        <div className="relative flex size-24 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#0070f3]/30" />
          <span className="absolute inset-0 rounded-full bg-[#0070f3]/10" />
          <div className="relative flex size-20 items-center justify-center rounded-full bg-[#0070f3] animate-in zoom-in duration-300">
            <Check className="size-10 text-white" strokeWidth={3} />
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">¡Perfil completado!</h2>
          <p className="text-sm text-muted-foreground">Preparando tu experiencia Huddle...</p>
        </div>
      </div>
    </div>
  )
}
