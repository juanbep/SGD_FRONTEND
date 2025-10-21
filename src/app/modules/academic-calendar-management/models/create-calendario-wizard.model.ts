import { EstadoCalendario } from './calendario.model';
import { CreateFechaDto } from './fechas.model';

export interface CreateCalendarioWizardData {
  // Paso 1: Información Básica
  infoBasica: {
    anioCalendario: number | null;
    numeroCalendario: number | null;
    estado: EstadoCalendario;
    observacion: string;
  };

  // Paso 2: Configuración Académica
  configAcademica: {
    semanasClase: number | null;
    semanasPreparacion: number | null;
    horasPlanta: number | null;
    horasCatedra: number | null;
    horasOcasionales: number | null;
    horasBecarioPracticante: number | null;
  };

  // Paso 3: Fechas del Calendario
  fechas: CreateFechaDto[];

  // Meta información del wizard
  currentStep: number;
  stepsCompleted: boolean[];
}

// Estado inicial del wizard
export const INITIAL_WIZARD_DATA: CreateCalendarioWizardData = {
  infoBasica: {
    anioCalendario: null,
    numeroCalendario: null,
    estado: 'PENDIENTE',
    observacion: '',
  },
  configAcademica: {
    semanasClase: null,
    semanasPreparacion: null,
    horasPlanta: null,
    horasCatedra: null,
    horasOcasionales: null,
    horasBecarioPracticante: null,
  },
  fechas: [],
  currentStep: 1,
  stepsCompleted: [false, false, false, false],
};
