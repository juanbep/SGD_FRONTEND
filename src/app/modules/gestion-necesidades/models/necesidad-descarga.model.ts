// Filtros para descarga de necesidades
export interface NecesidadDescargaFilters {
  oidCalendario: number;
  oidDepartamento?: number; // Opcional para SECRETARIO y DECANO
}

// Respuesta de la descarga (metadata)
export interface NecesidadDescargaResponse {
  blob: Blob;
  filename: string;
}