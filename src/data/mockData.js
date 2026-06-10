const municipios = [
  { id: "monterrey", nombre: "Monterrey" },
  { id: "san-pedro", nombre: "San Pedro Garza García" },
  { id: "guadalupe", nombre: "Guadalupe" },
  { id: "apodaca", nombre: "Apodaca" },
  { id: "escobedo", nombre: "General Escobedo" },
  { id: "santa-catarina", nombre: "Santa Catarina" },
  { id: "san-nicolas", nombre: "San Nicolás de los Garza" },
  { id: "juarez", nombre: "Ciudad Benito Juárez" },
  { id: "garza-garcia", nombre: "García" },
];

const zonas = {
  monterrey: [
    { id: "centro", nombre: "Centro" },
    { id: "sur", nombre: "Sur" },
    { id: "norte", nombre: "Norte" },
    { id: "poniente", nombre: "Poniente" },
    { id: "oriente", nombre: "Oriente" },
  ],
  "san-pedro": [
    { id: "zona-1", nombre: "Zona 1 (Centro)" },
    { id: "zona-2", nombre: "Zona 2 (Residencial)" },
    { id: "zona-3", nombre: "Zona 3 (Industrial)" },
  ],
  guadalupe: [
    { id: "sector-1", nombre: "Sector 1" },
    { id: "sector-2", nombre: "Sector 2" },
    { id: "sector-3", nombre: "Sector 3" },
  ],
  apodaca: [
    { id: "sector-a", nombre: "Sector A" },
    { id: "sector-b", nombre: "Sector B" },
  ],
  escobedo: [
    { id: "sector-norte", nombre: "Sector Norte" },
    { id: "sector-sur", nombre: "Sector Sur" },
  ],
  "santa-catarina": [
    { id: "sector-1", nombre: "Sector 1" },
    { id: "sector-2", nombre: "Sector 2" },
  ],
  "san-nicolas": [
    { id: "zona-norte", nombre: "Zona Norte" },
    { id: "zona-sur", nombre: "Zona Sur" },
  ],
  juarez: [
    { id: "sector-a", nombre: "Sector A" },
    { id: "sector-b", nombre: "Sector B" },
  ],
  "garza-garcia": [
    { id: "zona-1", nombre: "Zona 1" },
    { id: "zona-2", nombre: "Zona 2" },
  ],
};

const colonias = {
  centro: [
    { id: "col-1", nombre: "Colonia Centro" },
    { id: "col-2", nombre: "Colonia Obispado" },
    { id: "col-3", nombre: "Colonia Roma" },
  ],
  sur: [
    { id: "col-4", nombre: "Colonia Del Valle" },
    { id: "col-5", nombre: "Colonia Las Palmas" },
    { id: "col-6", nombre: "Colonia Vista Hermosa" },
  ],
  norte: [
    { id: "col-7", nombre: "Colonia Mitras Norte" },
    { id: "col-8", nombre: "Colonia Cumbres" },
  ],
  poniente: [
    { id: "col-9", nombre: "Colonia Independencia" },
    { id: "col-10", nombre: "Colonia Buenos Aires" },
  ],
  oriente: [
    { id: "col-11", nombre: "Colonia Linda Vista" },
    { id: "col-12", nombre: "Colonia Nuevo Repueblo" },
  ],
  "zona-1": [
    { id: "col-13", nombre: "Colonia San Pedro Centro" },
    { id: "col-14", nombre: "Colonia Del Valle" },
  ],
  "zona-2": [
    { id: "col-15", nombre: "Colonia Chipinque" },
    { id: "col-16", nombre: "Colonia La Sierra" },
  ],
  "zona-3": [
    { id: "col-17", nombre: "Colonia Industrial" },
  ],
  "sector-1": [
    { id: "col-18", nombre: "Colonia La Pastora" },
    { id: "col-19", nombre: "Colonia San Miguel" },
  ],
  "sector-2": [
    { id: "col-20", nombre: "Colonia Pueblo Nuevo" },
  ],
  "sector-3": [
    { id: "col-21", nombre: "Colonia San Rafael" },
  ],
  "sector-a": [
    { id: "col-22", nombre: "Colonia Santa Rosa" },
    { id: "col-23", nombre: "Colonia San Francisco" },
  ],
  "sector-b": [
    { id: "col-24", nombre: "Colonia Los Encinos" },
  ],
  "sector-norte": [
    { id: "col-25", nombre: "Colonia Raúl Caballero" },
  ],
  "sector-sur": [
    { id: "col-26", nombre: "Colonia Alianza Real" },
  ],
};

const horarios = [
  { coloniaId: "col-1", horaInicio: "08:00", horaFin: "12:00", fecha: "2026-06-15" },
  { coloniaId: "col-2", horaInicio: "10:00", horaFin: "14:00", fecha: "2026-06-15" },
  { coloniaId: "col-3", horaInicio: "13:00", horaFin: "17:00", fecha: "2026-06-15" },
  { coloniaId: "col-4", horaInicio: "09:00", horaFin: "13:00", fecha: "2026-06-16" },
  { coloniaId: "col-5", horaInicio: "14:00", horaFin: "18:00", fecha: "2026-06-16" },
  { coloniaId: "col-6", horaInicio: "06:00", horaFin: "10:00", fecha: "2026-06-16" },
  { coloniaId: "col-7", horaInicio: "08:00", horaFin: "12:00", fecha: "2026-06-17" },
  { coloniaId: "col-8", horaInicio: "11:00", horaFin: "15:00", fecha: "2026-06-17" },
  { coloniaId: "col-9", horaInicio: "07:00", horaFin: "11:00", fecha: "2026-06-17" },
  { coloniaId: "col-10", horaInicio: "12:00", horaFin: "16:00", fecha: "2026-06-18" },
  { coloniaId: "col-11", horaInicio: "09:00", horaFin: "13:00", fecha: "2026-06-18" },
  { coloniaId: "col-12", horaInicio: "14:00", horaFin: "18:00", fecha: "2026-06-18" },
  { coloniaId: "col-13", horaInicio: "08:00", horaFin: "12:00", fecha: "2026-06-19" },
  { coloniaId: "col-14", horaInicio: "10:00", horaFin: "14:00", fecha: "2026-06-19" },
  { coloniaId: "col-15", horaInicio: "06:00", horaFin: "10:00", fecha: "2026-06-19" },
  { coloniaId: "col-16", horaInicio: "11:00", horaFin: "15:00", fecha: "2026-06-20" },
  { coloniaId: "col-17", horaInicio: "09:00", horaFin: "13:00", fecha: "2026-06-20" },
  { coloniaId: "col-18", horaInicio: "08:00", horaFin: "12:00", fecha: "2026-06-20" },
  { coloniaId: "col-19", horaInicio: "13:00", horaFin: "17:00", fecha: "2026-06-21" },
  { coloniaId: "col-20", horaInicio: "07:00", horaFin: "11:00", fecha: "2026-06-21" },
  { coloniaId: "col-21", horaInicio: "10:00", horaFin: "14:00", fecha: "2026-06-21" },
  { coloniaId: "col-22", horaInicio: "09:00", horaFin: "13:00", fecha: "2026-06-22" },
  { coloniaId: "col-23", horaInicio: "14:00", horaFin: "18:00", fecha: "2026-06-22" },
  { coloniaId: "col-24", horaInicio: "06:00", horaFin: "10:00", fecha: "2026-06-22" },
  { coloniaId: "col-25", horaInicio: "08:00", horaFin: "12:00", fecha: "2026-06-23" },
  { coloniaId: "col-26", horaInicio: "11:00", horaFin: "15:00", fecha: "2026-06-23" },
];

export function getMunicipios() {
  return municipios;
}

export function getZonas(municipioId) {
  return zonas[municipioId] || [];
}

export function getColonias(zonaId) {
  return colonias[zonaId] || [];
}

export function getHorario(coloniaId) {
  return horarios.find((h) => h.coloniaId === coloniaId) || null;
}
