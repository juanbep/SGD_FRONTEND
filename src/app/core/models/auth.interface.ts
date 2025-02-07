export interface UserInfo {
    oidUsuario: number;
    usuarioDetalle: UsuarioDetalle;
    nombres: string;
    apellidos: string;
    correo: string;
    estado: number;
    fechaCreacion: Date;
    ultimoIngreso: Date;
    roles: Role[];
}

export interface Role {
    oid: number;
    nombre: string;
    estado: number;
}

export interface UsuarioDetalle {
    oidUsuarioDetalle: number;
    identificacion: string;
    facultad: string;
    departamento: string;
    categoria: null;
    contratacion: null;
    dedicacion: null;
    estudios: null;
    fechaCreacion: Date;
    fechaActualizacion: Date;
}


export const mockUserinfo: UserInfo = {
    oidUsuario: 1,
    usuarioDetalle: {
        oidUsuarioDetalle: 1,
        identificacion: '1234567890',
        facultad: 'Ingeniería',
        departamento: 'Sistemas',
        categoria: null,
        contratacion: null,
        dedicacion: null,
        estudios: null,
        fechaCreacion: new Date('2022-01-01'),
        fechaActualizacion: new Date('2022-01-02')
    },
    nombres: 'Juan',
    apellidos: 'Pérez',
    correo: 'juan.perez@example.com',
    estado: 1,
    fechaCreacion: new Date('2022-01-01'),
    ultimoIngreso: new Date('2022-01-10'),
    roles: [
        {
            oid: 1,
            nombre: 'Docente',
            estado: 1
        },
        {
            oid: 2,
            nombre: 'Estudiante',
            estado: 1
        }
    ]
};


