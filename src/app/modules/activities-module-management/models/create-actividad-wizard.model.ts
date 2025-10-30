import { CreateAtributoDTO } from './actividad.model';

// ==================== WIZARD DATA ====================
export interface InfoBasicaData {
  oidTipoActividad: number | null;
  nombreActividad: string;
  oidCargoActividad: number | null;
  oidCalendario: number | null;
}

export interface DetallesTemporalesData {
  horas: number | null;
  semanas: number | null;
  oidEstadoActividad: number;
}

export interface CreateActividadWizardData {
  infoBasica: InfoBasicaData;
  detallesTemporales: DetallesTemporalesData;
  atributos: CreateAtributoDTO[];
  usuarios: number[];
  currentStep: number;
  stepsCompleted: boolean[];
}

// Definición de atributo predefinido (constante del front)
export interface AtributoPredefinido {
  oideatributo: number;
  nombre: string;
  tipoAtributo: 'VARCHAR' | 'DATE' | 'FLOAT' | 'INTEGER';
}

export const INITIAL_WIZARD_DATA: CreateActividadWizardData = {
  infoBasica: {
    oidTipoActividad: null,
    nombreActividad: '',
    oidCargoActividad: null,
    oidCalendario: null,
  },
  detallesTemporales: {
    horas: null,
    semanas: null,
    oidEstadoActividad: 3, // INCOMPLETA por defecto
  },
  atributos: [],
  usuarios: [],
  currentStep: 1,
  stepsCompleted: [false, false, false, false, false],
};