"use client"

import { useRef, useState } from "react"
import { Camera, UserCircle2, X } from "lucide-react"

interface StepFotoProps {
  preview: string | null
  onChange: (file: File | null, preview: string | null) => void
}

export function StepFoto({ preview, onChange }: StepFotoProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith("image/")) return
    const url = URL.createObjectURL(file)
    onChange(file, url)
  }

  const handleRemove = () => {
    onChange(null, null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#0070f3]/10">
          <Camera className="size-6 text-[#0070f3]" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Agrega una foto de perfil
          </h2>
          <p className="text-sm text-muted-foreground">
            Opcional — puedes agregarla después desde tu perfil.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        {/* Avatar preview */}
        <div className="relative">
          <div className="size-32 overflow-hidden rounded-full border-4 border-border bg-muted flex items-center justify-center">
            {preview ? (
              <img
                src={preview}
                alt="Foto de perfil"
                className="size-full object-cover"
              />
            ) : (
              <UserCircle2 className="size-20 text-muted-foreground/40" />
            )}
          </div>
          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -right-1 -top-1 flex size-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm hover:text-foreground"
              aria-label="Quitar foto"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Drop zone */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            handleFile(e.dataTransfer.files?.[0] ?? null)
          }}
          className={`flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all ${
            isDragging
              ? "border-[#0070f3] bg-[#0070f3]/5"
              : "border-border hover:border-[#0070f3]/50 hover:bg-muted/50"
          }`}
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-[#0070f3]/10">
            <Camera className="size-5 text-[#0070f3]" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {preview ? "Cambiar foto" : "Sube tu foto aquí o haz clic para elegir"}
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG o WEBP · Máx. 5 MB</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
        </button>

        {/* Saltar paso */}
        {!preview && (
          <p className="text-xs text-muted-foreground">
            Este paso es opcional. Puedes omitirlo con el botón "Finalizar".
          </p>
        )}
      </div>
    </div>
  )
}