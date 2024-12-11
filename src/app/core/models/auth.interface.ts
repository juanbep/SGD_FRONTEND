export interface Userinfo {
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
    categoria:          null;
    contratacion:       null;
    dedicacion:         null;
    estudios:           null;
    fechaCreacion:      Date;
    fechaActualizacion: Date;
}
