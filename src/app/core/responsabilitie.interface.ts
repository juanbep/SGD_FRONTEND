export interface Responsabilidad {
    codigoActividad:    string;
    nombre:             string;
    horas:              string;
    fechaCreacion:      string;
    fechaActualizacion: string;
    tipoActividad:      TipoActividad;
    fuentes:            Fuente[];
    evaluado:           Evaluado;
}

export interface Evaluado {
    oidUsuario:     number;
    identificacion: string;
    nombres:        string;
    apellidos:      string;
    roles:          Role[];
}

export interface Role {
    nombre: string;
    estado: string;
}

export interface Fuente {
    oidFuente:          number;
    tipoFuente:         string;
    calificacion:       number;
    nombreDocumento:    string;
    observacion:        string;
    fechaCreacion:      string;
    fechaActualizacion: string;
    estadoFuente:       string;
}

export interface TipoActividad {
    oidTipoActividad: number;
    nombre:           string;
    horasTotales:     number;
    descripcion:      string;
}

export interface ResponsabilidadesPorTipoActividad {
    nombreType: string;
    activities: Responsabilidad[];
}
