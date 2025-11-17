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
  TRABAJOS_DOCENCIA: {
    oidTipoActividad: 1, // Ajusta el ID correcto según el backend
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
        placeholder: 'Ej: Resolución 123 de 2024',
      },
      {
        nombre: 'IDESTUDIANTE',
        tipoValor: 'VARCHAR',
        label: 'ID Estudiante',
        tipoCampo: 'text',
        requerido: true,
        mostrarEnTabla: true,
        orden: 2,
        placeholder: 'Ej: 123456789',
      },
      {
        nombre: 'NOMBREESTUDIANTE',
        tipoValor: 'VARCHAR',
        label: 'Nombre Estudiante',
        tipoCampo: 'text',
        requerido: true,
        mostrarEnTabla: true,
        orden: 3,
        placeholder: 'Ej: Juan Pérez García',
      },
      {
        nombre: 'HORAS',
        tipoValor: 'NUMBER',
        label: 'Horas',
        tipoCampo: 'number',
        requerido: true,
        mostrarEnTabla: true,
        orden: 4,
        placeholder: 'Ej: 4',
      },
    ],
  },
  PROYECTOS_INVESTIGACION: {
    oidTipoActividad: 2, // Ajusta el ID correcto según el backend
    nombreTipo: 'Proyectos de Investigación',
    atributos: [
      {
        nombre: 'NOMBREPROYECTO',
        tipoValor: 'VARCHAR',
        label: 'Nombre del Proyecto',
        tipoCampo: 'text',
        requerido: true,
        mostrarEnTabla: true,
        orden: 1,
        placeholder: 'Ej: Análisis de Sistemas Convergentes',
        validaciones: { minLength: 3, maxLength: 200 },
      },
      {
        nombre: 'CODIGOVRI',
        tipoValor: 'VARCHAR',
        label: 'Código VRI',
        tipoCampo: 'text',
        requerido: false,
        mostrarEnTabla: true,
        orden: 2,
        placeholder: 'Ej: VRI-2024-001',
      },
      {
        nombre: 'FECHAINICIAL',
        tipoValor: 'DATE',
        label: 'Fecha Inicial',
        tipoCampo: 'date',
        requerido: true,
        mostrarEnTabla: true,
        orden: 3,
      },
      {
        nombre: 'FECHAFINAL',
        tipoValor: 'DATE',
        label: 'Fecha Final',
        tipoCampo: 'date',
        requerido: true,
        mostrarEnTabla: true,
        orden: 4,
      },
      {
        nombre: 'HAPROB',
        tipoValor: 'INT',
        label: 'H. APROB',
        tipoCampo: 'number',
        requerido: true,
        mostrarEnTabla: true,
        orden: 5,
        placeholder: 'Horas aprobadas',
        validaciones: { min: 1 },
      },
      {
        nombre: 'HLABOR',
        tipoValor: 'INT',
        label: 'H. LABOR',
        tipoCampo: 'number',
        requerido: true,
        mostrarEnTabla: true,
        orden: 6,
        placeholder: 'Horas de labor',
        validaciones: { min: 1 },
      },
    ],
  },
  SEMILLEROS_INVESTIGACION: {
    oidTipoActividad: 3, // Ajusta el ID correcto según el backend
    nombreTipo: 'Semilleros de Investigación',
    atributos: [
      {
        nombre: 'ACTOADMINISTRATIVO',
        tipoValor: 'VARCHAR',
        label: 'Acto Administrativo',
        tipoCampo: 'text',
        requerido: false,
        mostrarEnTabla: false,
        orden: 1,
        placeholder: 'Ej: Resolución 123 de 2024',
      },
      {
        nombre: 'ID',
        tipoValor: 'INT',
        label: 'ID',
        tipoCampo: 'number',
        requerido: true,
        mostrarEnTabla: true,
        orden: 2,
        placeholder: 'Número de identificación',
        validaciones: { min: 1 },
      },
      {
        nombre: 'SEMILLERO',
        tipoValor: 'VARCHAR',
        label: 'Semillero',
        tipoCampo: 'text',
        requerido: true,
        mostrarEnTabla: true,
        orden: 3,
        placeholder: 'Ej: Semillero de Inteligencia Artificial',
        validaciones: { minLength: 3, maxLength: 200 },
      },
      {
        nombre: 'ROL',
        tipoValor: 'VARCHAR',
        label: 'Rol',
        tipoCampo: 'text',
        requerido: true,
        mostrarEnTabla: true,
        orden: 4,
        placeholder: 'Ej: Director, Coordinador, Integrante',
        validaciones: { minLength: 2, maxLength: 100 },
      },
      {
        nombre: 'HORAS',
        tipoValor: 'INT',
        label: 'Horas',
        tipoCampo: 'number',
        requerido: true,
        mostrarEnTabla: true,
        orden: 5,
        placeholder: 'Número de horas',
        validaciones: { min: 1 },
      },
    ],
  },
  TRABAJOS_INVESTIGACION: {
    oidTipoActividad: 4, // Ajusta el ID correcto según el backend
    nombreTipo: 'Trabajos de Investigación',
    atributos: [
      {
        nombre: 'ACTOADMINISTRATIVO',
        tipoValor: 'VARCHAR',
        label: 'Acto Administrativo',
        tipoCampo: 'text',
        requerido: false,
        mostrarEnTabla: false,
        orden: 1,
        placeholder: 'Ej: Resolución 123 de 2024',
      },
      {
        nombre: 'IDESTUDIANTE',
        tipoValor: 'INT',
        label: 'ID Estudiante',
        tipoCampo: 'number',
        requerido: true,
        mostrarEnTabla: true,
        orden: 2,
        placeholder: 'Ej: 123456789',
        validaciones: { min: 1 },
      },
      {
        nombre: 'NOMBREESTUDIANTE',
        tipoValor: 'VARCHAR',
        label: 'Nombre Estudiante',
        tipoCampo: 'text',
        requerido: true,
        mostrarEnTabla: true,
        orden: 3,
        placeholder: 'Ej: Juan Pérez García',
        validaciones: { minLength: 3, maxLength: 200 },
      },
      {
        nombre: 'HORAS',
        tipoValor: 'INT',
        label: 'Horas',
        tipoCampo: 'number',
        requerido: true,
        mostrarEnTabla: true,
        orden: 4,
        placeholder: 'Número de horas',
        validaciones: { min: 1 },
      },
      {
        nombre: 'OBSERVACIONES',
        tipoValor: 'VARCHAR',
        label: 'Observaciones',
        tipoCampo: 'textarea',
        requerido: true,
        mostrarEnTabla: true,
        orden: 5,
        placeholder: 'Ingrese observaciones relevantes',
        validaciones: { minLength: 5, maxLength: 500 },
      },
    ],
  },
};
