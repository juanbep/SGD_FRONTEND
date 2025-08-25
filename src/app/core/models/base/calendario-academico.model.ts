export interface EventoCalendario {
  id: number;              // identificador único del evento
  titulo: string;          // nombre del evento (ej: "Inicio de Clases")
  descripcion?: string;    // detalle opcional
  fechaInicio: Date;       // inicio del evento
  fechaFin?: Date;         // fin del evento (si aplica, ej. "20 al 22 de enero")
}

export interface CalendarioAcademico {
  acuerdoAcademico: string; // acuerdo académico en donde se aprobó el calendario
  id: number;              // identificador del calendario
  anio: number;            // año académico (ej: 2025)
  periodo: string;         // ej: "2025-1"
  estado: 'Activo' | 'Finalizado' | 'Borrador';
  eventos: EventoCalendario[];
}