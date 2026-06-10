import Link from "next/link"
import { Button } from "@/components/ui/button"

export function BannerCta() {
  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-[#0070f3]/10 p-6 text-center sm:flex-row sm:text-left">
      <div>
        <h3 className="text-lg font-semibold text-[#0070f3] text-balance">¿No encuentras lo que buscas?</h3>
        <p className="mt-1 text-sm text-muted-foreground text-pretty">
          Publica tu solicitud y los tutores te contactarán directamente.
        </p>
      </div>
      <Button
        asChild
        className="shrink-0 rounded-full bg-[#0070f3] px-6 text-white hover:bg-[#0070f3]/90"
      >
        <Link href="/solicitar-ayudantia">Sugerir ayudantía</Link>
      </Button>
    </div>
  )
}
