import { EstadoUsuario } from "../base/estado-usuario.model";
import { Rol } from "../base/rol.model";
import { UsuarioDetalle } from "../base/usuario-detalle.model";


export interface UsuarioResponse {
  oidUsuario: number;
  identificacion: string;
  nombres: string;
  apellidos: string;
  username?: string;
  correo: string;
  fechaCreacion: string;
  ultimoIngreso: string;
  estadoUsuario: EstadoUsuario;
  usuarioDetalle: UsuarioDetalle; // Relación con el detalle del usuario
  roles: Rol[]; // Lista de roles asociados
}