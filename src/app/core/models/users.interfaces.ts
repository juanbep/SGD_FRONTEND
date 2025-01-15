/*
* Interface de usuarios para el manejo de los datos de los usuarios que se obtienen del backend
*/
export interface UsersResponse {
    content:          User[];
    pageable:         Pageable;
    last:             boolean;
    totalPages:       number;
    totalElements:    number;
    size:             number;
    number:           number;
    sort:             Sort;
    numberOfElements: number;
    first:            boolean;
    empty:            boolean;
}

export interface User {
    oidUsuario:     number;
    usuarioDetalle: UsuarioDetalle;
    nombres:        string;
    apellidos:      string;
    correo:         string;
    estado:         number;
    fechaCreacion:  Date;
    ultimoIngreso:  Date;
    roles:          Role[];
}

export interface Role {
    oid:    number;
    nombre: string;
    estado: number;
}

export interface UsuarioDetalle {
    oidUsuarioDetalle:  number;
    identificacion:     string;
    facultad:           string;
    departamento:       string;
    categoria:          null | string;
    contratacion:       null | string;
    dedicacion:         null | string;
    estudios:           null | string;
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
    estado:         number;
    usuarioDetalle: NewUsuarioDetalle;
    roles:          NewUserRole[];
}

export interface NewUserRole {
    oid: number;
}

export interface NewUsuarioDetalle {
    identificacion: string;
    facultad:       string;
    departamento:   string;
    categoria:      string;
    contratacion:   string;
    dedicacion:     string;
    estudios:       string;
}
