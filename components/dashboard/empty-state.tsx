import { SearchX } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-[#0070f3]/10 text-[#0070f3]">
        <SearchX className="size-7" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-foreground text-balance">
        No hay ofertas disponibles en este momento
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground text-pretty">
        ¡Sé el primero en publicar una oferta de tutoría! También puedes explorar otras categorías o
        intentar limpiar los filtros aplicados.
      </p>
    </div>
  )
}
