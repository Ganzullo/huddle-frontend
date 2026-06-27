// Datos institucionales de la USM para el flujo de onboarding

export const CAMPUS_USM = [
  "Casa Central (Valparaíso)",
  "Campus San Joaquín",
  "Campus Vitacura",
  "Sede Viña del Mar",
  "Sede Concepción",
] as const

export const CARRERAS_USM = [
  "Ingeniería Civil Informática",
  "Ingeniería Civil Industrial",
  "Ingeniería Civil Electrónica",
  "Ingeniería Civil Mecánica",
  "Ingeniería Civil Eléctrica",
  "Ingeniería Civil Química",
  "Ingeniería Civil de Minas",
  "Ingeniería Civil Telemática",
  "Ingeniería Civil Matemática",
  "Ingeniería Comercial",
  "Arquitectura",
  "Ingeniería en Construcción",
  "Técnico Universitario en Informática",
] as const

export const ANIOS_INGRESO = Array.from({ length: 11 }, (_, i) => String(new Date().getFullYear() - i))

export const RAMOS_USM = [
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
] as const

export const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] as const

export const BLOQUES_USM = [
  { id: "1-2", horario: "08:15 - 09:25" },
  { id: "3-4", horario: "09:40 - 10:50" },
  { id: "5-6", horario: "11:05 - 12:15" },
  { id: "7-8", horario: "12:30 - 13:40" },
  { id: "9-10", horario: "14:40 - 15:50" },
  { id: "11-12", horario: "16:05 - 17:15" },
  { id: "13-14", horario: "17:30 - 18:40" },
] as const

export type RolOnboarding = "inexperto" | "experto" | "hibrido"

// ─── Exports para FiltersPanel ───────────────────────────────────────────────

export const RAMOS_FILTRO = RAMOS_USM.map((r) => ({ id: r.codigo, nombre: r.nombre }))

export const CAMPUS_FILTRO = [...CAMPUS_USM]

export const BLOQUES_FILTRO = BLOQUES_USM.map((b) => ({
  id: b.id,
  label: `Bloque ${b.id}`,
  horario: b.horario,
}))