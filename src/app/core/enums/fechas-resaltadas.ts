import { EventoCalendario } from '../models/base/calendario-academico.model';

export const FECHAS_RESALTADAS: Omit<
  EventoCalendario,
  'fechaInicio' | 'fechaFin'
>[] = [
  {
    id: 1,
    titulo: 'Inicio del periodo',
    categoria: 'RESALTADA',
    destacado: true,
  },
  {
    id: 2,
    titulo: 'Matrículas académicas estudiantes regulares',
    categoria: 'RESALTADA',
    destacado: true,
  },
  {
    id: 3,
    titulo: 'Inicio de clases',
    categoria: 'RESALTADA',
    destacado: true,
  },
  {
    id: 4,
    titulo:
      'Plazo máximo para presentar solicitudes de cancelación de asignaturas y/o matrícula',
    categoria: 'RESALTADA',
    destacado: true,
  },
  {
    id: 5,
    titulo: 'Registro de Notas 70% en SIMCA',
    categoria: 'RESALTADA',
    destacado: true,
  },
  {
    id: 6,
    titulo: 'Evaluación docente',
    categoria: 'RESALTADA',
    destacado: true,
  },
  {
    id: 7,
    titulo: 'Finalización de clases',
    categoria: 'RESALTADA',
    destacado: true,
  },
  {
    id: 8,
    titulo: 'Plazo máximo para finales, supletorios y habilitaciones',
    categoria: 'RESALTADA',
    destacado: true,
  },
  {
    id: 9,
    titulo: 'Cierre de SIMCA para registro de calificaciones',
    categoria: 'RESALTADA',
    destacado: true,
  },
  {
    id: 10,
    titulo: 'Finalización del periodo académico',
    categoria: 'RESALTADA',
    destacado: true,
  },
];

export const FECHAS_NO_RESALTADAS: Omit<
  EventoCalendario,
  'fechaInicio' | 'fechaFin'
>[] = [
  {
    id: 101,
    titulo: 'Inducción a estudiantes de primer semestre',
    categoria: 'NO_RESALTADA',
  },
  { id: 102, titulo: 'Ajustes de matrícula SIMCA', categoria: 'NO_RESALTADA' },
  {
    id: 103,
    titulo: 'Adiciones matrícula a través del módulo SIMCA (KIRA)',
    categoria: 'NO_RESALTADA',
  },
  { id: 104, titulo: 'Listas definitivas de clase', categoria: 'NO_RESALTADA' },
  { id: 105, titulo: 'PRIMEROS PARCIALES', categoria: 'NO_RESALTADA' },
  {
    id: 106,
    titulo: 'Plazo para registro de notas primeros parciales',
    categoria: 'NO_RESALTADA',
  },
  { id: 107, titulo: 'SEGUNDOS PARCIALES', categoria: 'NO_RESALTADA' },
  {
    id: 108,
    titulo: 'Plazo máximo para recepción de solicitudes de Reingreso II',
    categoria: 'NO_RESALTADA',
  },
  {
    id: 109,
    titulo:
      'Exámenes finales/supletorios/habilitaciones/validaciones (planta y ocasionales)',
    categoria: 'NO_RESALTADA',
  },
  {
    id: 110,
    titulo: 'Planeación de cursos especiales',
    categoria: 'NO_RESALTADA',
  },
  {
    id: 111,
    titulo: 'Desarrollo de cursos especiales',
    categoria: 'NO_RESALTADA',
  },
];
