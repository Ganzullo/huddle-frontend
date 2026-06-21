import { RAMOS_USM } from "@/lib/usm-data"

export interface SolicitudAyudantia {
  id: string
  id_alumno: string
  id_ramo: string
  nombre_alumno?: string
  foto_url?: string
  sede: string
  modalidad: string
  presupuesto: number
  descripcion?: string
  horarios?: string[]
  fecha_creacion?: any
}

export interface OfertaTutoria {
  id: string
  id_tutor: string
  id_ramo: string
  nombre_ramo?: string
  modalidad: string
  precio_referencial?: number
  lugar_especifico?: string
  descripcion?: string
  nombre_tutor?: string
  foto_url?: string
  sede?: string
  horarios?: string[]
  rating?: number
  reviews?: number
  fecha_creacion?: any
}

/**
 * Convierte una Solicitud_Ayudantia a la forma de Oferta que espera <OfertaCard />,
 * para reusar el mismo componente visual en ambos casos.
 * IMPORTANTE: siempre úsalo junto con la prop `esSolicitud` en OfertaCard,
 * para que el botón de favorito guarde el tipo correcto ("solicitud" en vez de "oferta").
 *
 * Esta es la misma lógica que ya tenías inline en dashboard-page.tsx (solicitudComoOferta);
 * la movimos aquí para no duplicarla también en la página de Guardados.
 */
export function solicitudComoOferta(s: SolicitudAyudantia): OfertaTutoria {
  const ramoInfo = RAMOS_USM.find((r) => r.codigo === s.id_ramo)
  return {
    id: s.id,
    id_tutor: s.id_alumno,
    id_ramo: s.id_ramo,
    nombre_ramo: ramoInfo?.nombre ?? s.id_ramo,
    modalidad: s.modalidad,
    precio_referencial: s.presupuesto,
    lugar_especifico: s.sede,
    descripcion: s.descripcion,
    nombre_tutor: s.nombre_alumno,
    foto_url: s.foto_url,
    sede: s.sede,
    horarios: s.horarios,
    fecha_creacion: s.fecha_creacion,
  }
}