export interface Oferta {
  id: string
  titulo: string
  tutor: string
  avatar: string
  rating: number
  reviews: number
  modalidad: "Presencial" | "Online"
  ubicacion: string
  descripcion: string
  precio: number
  area: string
  id_ramo: string
  nombre_ramo: string
}

export const FILTROS_RAPIDOS = [
  "Todos",
  "Matemáticas",
  "Física",

]

export const FILTROS_RAPIDOS_EXTRA = [
  "Cálculo",
  "Álgebra",
]

export const RAMOS_FILTRO = [
  { id: "mat060", nombre: "Álgebra y geometría" },
  { id: "mat061", nombre: "Álgebra Lineal" },
  { id: "mat070", nombre: "Introducción al cálculo" },
  { id: "mat071", nombre: "Cálculo en una Variable" },
  { id: "mat081", nombre: "Cálculo en Varias Variables" },
  { id: "mat270", nombre: "Análisis Numérico" },
  { id: "fis100", nombre: "Introducción a la física" },
  { id: "fis111", nombre: "Física General Mecánica" },
  { id: "fis120", nombre: "Física General 2" },
  { id: "fis130", nombre: "Física General 3" },
  { id: "fis131", nombre: "Calor y Ondas" },
  { id: "fis140", nombre: "Física General 4" },
]

export const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

export const HORARIOS = ["Mañana (08:00 - 12:00)", "Tarde (12:00 - 18:00)", "Noche (18:00 - 22:00)"]

export const OFERTAS: Oferta[] = []