export type TipoCampo = 'text' | 'number' | 'date' | 'select' | 'textarea';

export interface AtributoMetadata {
  nombre: string;
  tipoValor: string;
  label: string;
  tipoCampo: TipoCampo;
  requerido: boolean;
  mostrarEnTabla: boolean;
  orden: number;
  placeholder?: string;
  opcionesSelect?: {
    endpoint?: string;
    estatico?: { value: string; label: string }[];
  };
  validaciones?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface SubtipoActividadConfig {
  oidTipoActividad: number;
  nombreTipo: string;
  atributos: AtributoMetadata[];
}

export const ACTIVIDADES_METADATA: Record<string, SubtipoActividadConfig> = {
  'TRABAJOS_DOCENCIA': {
    oidTipoActividad: 1,
    nombreTipo: 'Trabajos de Docencia',
    atributos: [
      {
        nombre: 'ACTOADMINISTRATIVO',
        tipoValor: 'VARCHAR',
        label: 'Acto Administrativo',
        tipoCampo: 'text',
        requerido: false,
        mostrarEnTabla: false,
        orden: 1,
        placeholder: 'Ej: Resolución 123 de 2024'
      },
      {
        nombre: 'IDESTUDIANTE',
        tipoValor: 'VARCHAR',
        label: 'ID Estudiante',
        tipoCampo: 'text',
        requerido: true,
        mostrarEnTabla: true,
        orden: 2,
        placeholder: 'Ej: 123456789'
      },
      {
        nombre: 'NOMBREESTUDIANTE',
        tipoValor: 'VARCHAR',
        label: 'Nombre Estudiante',
        tipoCampo: 'text',
        requerido: true,
        mostrarEnTabla: true,
        orden: 3,
        placeholder: 'Ej: Juan Pérez García'
      }
    ]
  }
};
