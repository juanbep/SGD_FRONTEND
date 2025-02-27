export interface DetalleUsuarioConsolidadoResponse {
    nombreDocente:        string;
    correoElectronico:    string;
    numeroIdentificacion: string;
    periodoAcademico:     string;
    facultad:             string;
    departamento:         string;
    categoria:            string;
    tipoContratacion:     string;
    dedicacion:           string;
    horasTotales:         number;
    totalPorcentaje:      number;
    totalAcumulado:       number;
    currentPage:          number;
    pageSize:             number;
    totalItems:           number;
    totalPages:           number
}