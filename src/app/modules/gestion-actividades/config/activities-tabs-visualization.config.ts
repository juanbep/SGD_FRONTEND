export interface SubTabVisualizacion {
  id: string;
  label: string;
  icon: string;
  oidTipoActividad: number;
}

export interface TabPrincipalVisualizacion {
  id: string;
  label: string;
  icon: string;
  oidTipoActividad?: number; // Para tabs sin subtipos
  subTabs?: SubTabVisualizacion[];
}

export const TABS_VISUALIZACION_ACTIVIDADES: TabPrincipalVisualizacion[] = [
  {
    id: 'docencia',
    label: 'Docencia',
    icon: 'fa-chalkboard-teacher',
    subTabs: [
      {
        id: 'docencia-directa',
        label: 'Docencia Directa',
        icon: 'fa-chalkboard',
        oidTipoActividad: 9,
      },
      {
        id: 'trabajos-docencia',
        label: 'Trabajos de Docencia',
        icon: 'fa-file-alt',
        oidTipoActividad: 1,
      },
    ],
  },
  {
    id: 'investigacion',
    label: 'Investigación',
    icon: 'fa-flask',
    subTabs: [
      {
        id: 'proyectos',
        label: 'Proyectos de Investigación',
        icon: 'fa-project-diagram',
        oidTipoActividad: 2,
      },
      {
        id: 'semilleros',
        label: 'Semilleros de Investigación',
        icon: 'fa-users',
        oidTipoActividad: 11,
      },
      {
        id: 'trabajos',
        label: 'Trabajos de Investigación',
        icon: 'fa-file-alt',
        oidTipoActividad: 7,
      },
    ],
  },
  {
    id: 'administracion',
    label: 'Administración',
    icon: 'fa-briefcase',
    oidTipoActividad: 4,
  },
  {
    id: 'asesoria',
    label: 'Asesoría',
    icon: 'fa-user-tie',
    oidTipoActividad: 8,
  },
  {
    id: 'servicios',
    label: 'Servicios',
    icon: 'fa-hands-helping',
    oidTipoActividad: 10,
  },
  {
    id: 'extension',
    label: 'Extensión',
    icon: 'fa-expand-arrows-alt',
    oidTipoActividad: 6,
  },
  {
    id: 'capacitacion',
    label: 'Capacitación',
    icon: 'fa-graduation-cap',
    oidTipoActividad: 3,
  },
  {
    id: 'otros-servicios',
    label: 'Otros Servicios',
    icon: 'fa-ellipsis-h',
    oidTipoActividad: 5,
  },
];
