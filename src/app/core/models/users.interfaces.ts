/*
* Interface de usuarios para el manejo de los datos de los usuarios que se obtienen del backend
*/
export interface UsersResponse {
    content:          User[];
    pageable:         Pageable;
    last:             boolean;
    totalPages:       number;
    totalElements:    number;
    first:            boolean;
    size:             number;
    number:           number;
    sort:             Sort;
    numberOfElements: number;
    empty:            boolean;
}

export interface User {
    oidUsuario:     number;
    usuarioDetalle: UsuarioDetalle;
    estadoUsuario:  EstadoUsuario;
    identificacion: string;
    nombres:        string;
    apellidos:      string;
    username:       string;
    correo:         string;
    fechaCreacion:  Date;
    ultimoIngreso:  Date;
    roles:          Role[];
}

export interface EstadoUsuario {
    oidEstadoUsuario?:  number;
    nombre:             string;
    fechaCreacion:      Date;
    fechaActualizacion: Date;
    oid?:               number;
}

export interface Role {
    oid:                number;
    nombre:             string;
    fechaCreacion:      Date;
    fechaActualizacion: Date;
}

export interface UsuarioDetalle {
    oidUsuarioDetalle:  number;
    facultad:           string;
    departamento:       string;
    categoria:          null;
    contratacion:       null;
    dedicacion:         null;
    estudios:           null;
    fechaCreacion:      Date;
    fechaActualizacion: Date;
}

export interface Pageable {
    pageNumber: number;
    pageSize:   number;
    sort:       Sort;
    offset:     number;
    paged:      boolean;
    unpaged:    boolean;
}

export interface Sort {
    empty:    boolean;
    sorted:   boolean;
    unsorted: boolean;
}



//Nuevo usuarios

export interface NewUser {
    nombres:        string;
    apellidos:      string;
    correo:         string;
    username:       string;
    identificacion: string;
    estadoUsuario:  NewEstadoUsuario;
    usuarioDetalle: NewUsuarioDetalle;
    roles:          NewUserRole[];
}

export interface NewEstadoUsuario {
    oidEstadoUsuario: number;
}

export interface NewUserRole {
    oid: number;
}

export interface NewUsuarioDetalle {
    facultad:     string;
    departamento: string;
    categoria:    string;
    contratacion: string;
    dedicacion:   string;
    estudios:     string;
}

