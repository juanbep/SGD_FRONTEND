export interface UsuarioCreate {
    nombres: string;
    apellidos: string;
    correo: string;
    username: string;
    identificacion: string;
    estadoUsuario:{
        oidEstadoUsuario:number;
    };
    usuarioDetalle:{
        oidUsuarioDetalle ? :number;
        facultad:string;
        departamento:string;
        categoria:string;
        contratacion:string;
        dedicacion:string;
        estudios:string;
    }
    roles:[{
        oid:number;
    }];

}