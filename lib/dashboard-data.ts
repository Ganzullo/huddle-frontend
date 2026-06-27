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
  { codigo: "MAT060", nombre: "Álgebra y Geometría" },
  { codigo: "MAT061", nombre: "Álgebra Lineal" },
  { codigo: "MAT070", nombre: "Introducción al Cálculo" },
  { codigo: "MAT071", nombre: "Cálculo en una Variable" },
  { codigo: "MAT081", nombre: "Cálculo en Varias Variables" },
  { codigo: "MAT270", nombre: "Análisis Numérico" },
  { codigo: "FIS100", nombre: "Introducción a la Física" },
  { codigo: "FIS111", nombre: "Física General Mecánica" },
  { codigo: "FIS120", nombre: "Física General 2" },
  { codigo: "FIS130", nombre: "Física General 3" },
  { codigo: "FIS131", nombre: "Calor y Ondas" },
  { codigo: "FIS140", nombre: "Física General 4" },
  { codigo: "IWI131", nombre: "Programación" },
  { codigo: "IWI191", nombre: "Estructuras de Datos" },
  { codigo: "ELO320", nombre: "Estructuras de Datos y Algoritmos" },
  { codigo: "INF239", nombre: "Bases de Datos" },
  { codigo: "QUI010", nombre: "Química" },
]

export const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

export const HORARIOS = ["Mañana (08:00 - 12:00)", "Tarde (12:00 - 18:00)", "Noche (18:00 - 22:00)"]

// Campus físicos oficiales de la USM (para filtros)
export const CAMPUS_FILTRO = [
  "Casa Central (Valparaíso)",
  "Campus San Joaquín",
  "Campus Vitacura",
  "Sede Viña del Mar",
  "Sede Concepción",
] as const

// Bloques oficiales de 70 minutos de la USM
export const BLOQUES_FILTRO = [
  { id: "1-2", label: "Bloque 1-2", horario: "08:15 - 09:25" },
  { id: "3-4", label: "Bloque 3-4", horario: "09:40 - 10:50" },
  { id: "5-6", label: "Bloque 5-6", horario: "11:05 - 12:15" },
  { id: "7-8", label: "Bloque 7-8", horario: "12:30 - 13:40" },
  { id: "9-10", label: "Bloque 9-10", horario: "14:40 - 15:50" },
  { id: "11-12", label: "Bloque 11-12", horario: "16:05 - 17:15" },
  { id: "13-14", label: "Bloque 13-14", horario: "17:30 - 18:40" },
] as const

export const OFERTAS: Oferta[] = []
