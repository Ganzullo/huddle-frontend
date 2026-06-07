import { Button } from "@/components/ui/button"

export function BannerCta() {
  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-[#0070f3]/10 p-6 text-center sm:flex-row sm:text-left">
      <div>
        <h3 className="text-lg font-semibold text-[#0a2540] text-balance">¿No encuentras lo que buscas?</h3>
        <p className="mt-1 text-sm text-muted-foreground text-pretty">
          Publica tu solicitud y los tutores te contactarán directamente.
        </p>
      </div>
      <Button className="shrink-0 rounded-full bg-[#0070f3] px-6 text-white hover:bg-[#0070f3]/90">
        Publicar solicitud
      </Button>
    </div>
  )
}
