export interface Usuario {
    oidUsuario: number;
    identificacion: string;
    nombres: string;
    apellidos: string;
    username?: string;
    correo: string;
    fechaCreacion: string;
    ultimoIngreso: string;
}