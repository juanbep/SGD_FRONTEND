export type TipoCampo =
  | 'text'
  | 'number'
  | 'decimal'
  | 'date'
  | 'select'
  | 'textarea';

export interface AtributoMetadata {
  nombre: string;
  tipoValor: string;
  label: string;
  tipoCampo: TipoCampo;
  requerido: boolean;
  mostrarEnTabla: boolean;
  orden: number;
  placeholder?: string;
  esRepetible?: boolean; // NUEVO
  grupoRepetible?: string; // NUEVO
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

export interface GrupoRepetibleConfig {
  nombre: string; // 'ESTUDIANTES'
  labelSingular: string; // 'estudiante'
  labelPlural: string; // 'estudiantes'
  camposMostrar: string[]; // ['NOMBREESTUDIANTE', 'IDESTUDIANTE']
}

export interface SubtipoActividadConfig {
  oidTipoActividad: number;
  nombreTipo: string;
  atributos: AtributoMetadata[];
  gruposRepetibles?: GrupoRepetibleConfig[];
}

export const ACTIVIDADES_METADATA: Record<string, SubtipoActividadConfig> = {
  TRABAJOS_DOCENCIA: {
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
        placeholder: 'Ej: Resolución 123 de 2024',
      },
      {
        nombre: 'IDESTUDIANTE',
        tipoValor: 'INT',
        label: 'ID Estudiante',
        tipoCampo: 'number',
        requerido: true,
        mostrarEnTabla: false,
        orden: 2,
        placeholder: 'Ej: 123456789',
        esRepetible: true,
        grupoRepetible: 'ESTUDIANTES',
      },
      {
        nombre: 'NOMBREESTUDIANTE',
        tipoValor: 'VARCHAR',
        label: 'Nombre Estudiante',
        tipoCampo: 'text',
        requerido: true,
        mostrarEnTabla: false,
        orden: 3,
        placeholder: 'Ej: Juan Pérez García',
        esRepetible: true,
        grupoRepetible: 'ESTUDIANTES',
      },
    ],
    gruposRepetibles: [
      {
        nombre: 'ESTUDIANTES',
        labelSingular: 'estudiante',
        labelPlural: 'estudiantes',
        camposMostrar: ['NOMBREESTUDIANTE'],
      },
    ],
  },
  PROYECTOS_INVESTIGACION: {
    oidTipoActividad: 2, // ID que se envía al backend
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
      // {
      //   nombre: 'HAPROB',
      //   tipoValor: 'FLOAT',
      //   label: 'H. APROB',
      //   tipoCampo: 'decimal',
      //   requerido: true,
      //   mostrarEnTabla: true,
      //   orden: 5,
      //   placeholder: 'Horas aprobadas',
      //   validaciones: { min: 1 },
      // },
      // {
      //   nombre: 'HLABOR',
      //   tipoValor: 'FLOAT',
      //   label: 'H. LABOR',
      //   tipoCampo: 'decimal',
      //   requerido: true,
      //   mostrarEnTabla: true,
      //   orden: 6,
      //   placeholder: 'Horas de labor',
      //   validaciones: { min: 1 },
      // },
    ],
  },
  CAPACITACION: {
    oidTipoActividad: 3, // ID que se envía al backend
    nombreTipo: 'Capacitación',
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
        nombre: 'ANIOCOMISION',
        tipoValor: 'INT',
        label: 'Año Comisión',
        tipoCampo: 'number',
        requerido: true,
        mostrarEnTabla: true,
        orden: 2,
        placeholder: 'Ej: 2024',
        validaciones: { min: 2000, max: 2100 },
      },
      // {
      //   nombre: 'HORAS',
      //   tipoValor: 'INT',
      //   label: 'Horas',
      //   tipoCampo: 'number',
      //   requerido: true,
      //   mostrarEnTabla: true,
      //   orden: 3,
      //   placeholder: 'Número de horas',
      //   validaciones: { min: 1 },
      // },
    ],
  },
  ADMINISTRACION: {
    oidTipoActividad: 4, // ID que se envía al backend
    nombreTipo: 'Administración',
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
      // {
      //   nombre: 'CARGO',
      //   tipoValor: 'VARCHAR',
      //   label: 'Cargo',
      //   tipoCampo: 'text',
      //   requerido: true,
      //   mostrarEnTabla: true,
      //   orden: 2,
      //   placeholder: 'Ej: Director de Departamento',
      //   validaciones: { minLength: 3, maxLength: 200 },
      // },
      {
        nombre: 'AREA',
        tipoValor: 'VARCHAR',
        label: 'Área',
        tipoCampo: 'text',
        requerido: true,
        mostrarEnTabla: true,
        orden: 3,
        placeholder: 'Ej: Departamento de Sistemas',
        validaciones: { minLength: 3, maxLength: 200 },
      },
      // {
      //   nombre: 'HORAS',
      //   tipoValor: 'INT',
      //   label: 'Horas',
      //   tipoCampo: 'number',
      //   requerido: true,
      //   mostrarEnTabla: true,
      //   orden: 4,
      //   placeholder: 'Número de horas',
      //   validaciones: { min: 1 },
      // },
    ],
  },
  OTROS_SERVICIOS: {
    oidTipoActividad: 5, // ID que se envía al backend
    nombreTipo: 'Otros Servicios',
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
      // {
      //   nombre: 'HORAS',
      //   tipoValor: 'INT',
      //   label: 'Horas',
      //   tipoCampo: 'number',
      //   requerido: true,
      //   mostrarEnTabla: true,
      //   orden: 2,
      //   placeholder: 'Número de horas',
      //   validaciones: { min: 1 },
      // },
    ],
  },
  EXTENSION: {
    oidTipoActividad: 6, // ID que se envía al backend
    nombreTipo: 'Extensión',
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
        nombre: 'NOMBREPROYECTO',
        tipoValor: 'VARCHAR',
        label: 'Nombre del Proyecto',
        tipoCampo: 'text',
        requerido: true,
        mostrarEnTabla: true,
        orden: 2,
        placeholder: 'Ej: Proyecto de Extensión Comunitaria',
        validaciones: { minLength: 3, maxLength: 200 },
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
      // {
      //   nombre: 'HORAS',
      //   tipoValor: 'INT',
      //   label: 'Horas',
      //   tipoCampo: 'number',
      //   requerido: true,
      //   mostrarEnTabla: true,
      //   orden: 5,
      //   placeholder: 'Número de horas',
      //   validaciones: { min: 1 },
      // },
      {
        nombre: 'OBSERVACIONES',
        tipoValor: 'VARCHAR',
        label: 'Observación',
        tipoCampo: 'textarea',
        requerido: true,
        mostrarEnTabla: true,
        orden: 6,
        placeholder: 'Ingrese observaciones relevantes',
        validaciones: { minLength: 5, maxLength: 500 },
      },
    ],
  },
  TRABAJOS_INVESTIGACION: {
    oidTipoActividad: 7, // ID que se envía al backend
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
      // {
      //   nombre: 'HORAS',
      //   tipoValor: 'INT',
      //   label: 'Horas',
      //   tipoCampo: 'number',
      //   requerido: true,
      //   mostrarEnTabla: true,
      //   orden: 4,
      //   placeholder: 'Número de horas',
      //   validaciones: { min: 1 },
      // },
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
  ASESORIA: {
    oidTipoActividad: 8, // ID que se envía al backend
    nombreTipo: 'Asesoría',
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
        nombre: 'UNIDADACADEMICA',
        tipoValor: 'VARCHAR',
        label: 'Unidad Académica',
        tipoCampo: 'text',
        requerido: true,
        mostrarEnTabla: true,
        orden: 2,
        placeholder: 'Ej: Facultad de Ingeniería',
        validaciones: { minLength: 3, maxLength: 200 },
      },
      // {
      //   nombre: 'HORAS',
      //   tipoValor: 'INT',
      //   label: 'Horas',
      //   tipoCampo: 'number',
      //   requerido: true,
      //   mostrarEnTabla: true,
      //   orden: 3,
      //   placeholder: 'Número de horas',
      //   validaciones: { min: 1 },
      // },
    ],
  },
  SERVICIOS: {
    oidTipoActividad: 10, // ID que se envía al backend
    nombreTipo: 'Servicios',
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
      // {
      //   nombre: 'HORAS',
      //   tipoValor: 'INT',
      //   label: 'Horas',
      //   tipoCampo: 'number',
      //   requerido: true,
      //   mostrarEnTabla: true,
      //   orden: 2,
      //   placeholder: 'Número de horas',
      //   validaciones: { min: 1 },
      // },
    ],
  },
  SEMILLEROS_INVESTIGACION: {
    oidTipoActividad: 11, // ID que se envía al backend
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
      // {
      //   nombre: 'HORAS',
      //   tipoValor: 'INT',
      //   label: 'Horas',
      //   tipoCampo: 'number',
      //   requerido: true,
      //   mostrarEnTabla: true,
      //   orden: 5,
      //   placeholder: 'Número de horas',
      //   validaciones: { min: 1 },
      // },
    ],
  },
};
