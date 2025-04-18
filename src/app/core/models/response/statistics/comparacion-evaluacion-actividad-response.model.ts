export interface ComparacionEvaluacionActividad {
    docente:                     Docente;
    evaluacionesPorDepartamento: EvaluacionesPorDepartamento[];
}

export interface Docente {
    oidUsuario:     number;
    usuarioDetalle: UsuarioDetalle;
    estadoUsuario:  EstadoUsuario;
    identificacion: string;
    nombres:        string;
    apellidos:      string;
    username:       string;
    correo:         string;
}

export interface EstadoUsuario {
    nombre: string;
}

export interface UsuarioDetalle {
    facultad:     string;
    departamento: string;
    categoria:    string;
    contratacion: string;
    dedicacion:   string;
    estudios:     string;
}

export interface EvaluacionesPorDepartamento {
    departamento:   string;
    tiposActividad: TiposActividad[];
}

export interface TiposActividad {
    tipoActividad: string;
    actividades:   Actividade[];
}

export interface Actividade {
    nombreActividad: string;
    fuente1:         number;
    fuente2:         number;
}
