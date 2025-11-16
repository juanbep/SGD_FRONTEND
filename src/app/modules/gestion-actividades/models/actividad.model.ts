export interface AtributoActividad {
  nombre: string;
  tipo: string;
  valor: string;
}

export interface UsuarioActividad {
  oidUsuario: number;
  oidCargoActividad: number;
  horas: number;
}

export interface CreateActividadDto {
  oidTipoActividad: number;
  oidEstadoActividad: number;
  nombreActividad: string;
  semanas: number;
  oidCalendario: number;
  usuarios: UsuarioActividad[];
  atributos: AtributoActividad[];
}

export interface ActividadEnMemoria extends CreateActividadDto {
  id?: string; // ID temporal para manejo en memoria
}