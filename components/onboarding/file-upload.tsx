"use client"

import { useState, useRef } from "react"
import { UploadCloud, FileCheck2, X } from "lucide-react"

interface FileUploadProps {
  file: File | null
  onChange: (file: File | null) => void
  label?: string
}

export function FileUpload({ file, onChange, label }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const selected = files[0]
    if (selected.type === "application/pdf") {
      onChange(selected)
    }
  }

  if (file) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-green-500/40 bg-green-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-green-100">
            <FileCheck2 className="size-5 text-green-600" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB · PDF cargado
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Quitar archivo"
        >
          <X className="size-4" />
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
      className={`flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all ${
        isDragging ? "border-[#0070f3] bg-[#0070f3]/5" : "border-border hover:border-[#0070f3]/50 hover:bg-muted/50"
      }`}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-[#0070f3]/10">
        <UploadCloud className="size-6 text-[#0070f3]" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">
          {label || "Arrastra tu PDF aquí o haz clic para subir"}
        </p>
        <p className="text-xs text-muted-foreground">
          Certificado de Alumno Regular o Resumen de Notas (SIGA) · Solo PDF
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </button>
  )
}
