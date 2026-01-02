import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CrearIndividualComponent } from './crear-individual/crear-individual.component';
import { CrearLoteComponent } from './crear-lote/crear-lote.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DepartamentoService } from '../../../gestion-planes/services';
import { hasRole } from '../../../auth/utils/user-storage.utils';

type TabActivo = 'individual' | 'lote';

export interface FiltrosMaterias {
  oidDepartamento?: number;
  semestre?: number;
  oidMateria?: string;
  codigo?: string;
  nombre?: string;
}

@Component({
  selector: 'app-crear-necesidades-desde-plan',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    CrearIndividualComponent,
    CrearLoteComponent,
  ],
  templateUrl: './crear-necesidades-desde-plan.component.html',
  styleUrl: './crear-necesidades-desde-plan.component.css',
})
export class CrearNecesidadesDesdePlanComponent implements OnInit {
  // ===== SERVICIOS =====
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private departamentoService = inject(DepartamentoService);

  // ===== PARÁMETROS DE RUTA =====
  oidPlan: number = 0;
  oidCalendario: number = 0;
  origenNavegacion: string = '';

  // ===== TABS =====
  activeTab: TabActivo = 'individual';

  // ===== FILTROS =====
  readonly semestresDisponibles: { value: number | 'TODOS'; label: string }[] =
    [
      { value: 'TODOS', label: 'TODOS' },
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7' },
      { value: 8, label: '8' },
      { value: 9, label: '9' },
      { value: 10, label: '10' },
    ];

  departamentosDisponibles: { value: number | 'TODOS'; label: string }[] = [
    { value: 'TODOS', label: 'TODOS' },
  ];

  filtroOid: string = '';
  filtroCodigo: string = '';
  filtroNombre: string = '';
  filtroSemestre: number | 'TODOS' = 'TODOS';
  filtroDepartamento: number | 'TODOS' = 'TODOS';

  // Filtros aplicados que se pasan a los hijos
  filtrosAplicados: FiltrosMaterias = {};

  ngOnInit(): void {
    this.obtenerParametrosRuta();
    this.cargarDepartamentos();
  }

  // ===== OBTENER PARÁMETROS DE RUTA =====
  private obtenerParametrosRuta(): void {
    // Obtener parámetros de la ruta (oidPlan, oidCalendario)
    this.route.params.subscribe((params) => {
      this.oidPlan = Number(params['oidPlan']);
      this.oidCalendario = Number(params['oidCalendario']);

      if (!this.oidPlan || !this.oidCalendario) {
        this.toastr.error(
          'Parámetros de navegación inválidos',
          'Error de navegación'
        );
        this.volverALista();
        return;
      }
    });

    this.route.queryParams.subscribe((queryParams) => {
      this.origenNavegacion = queryParams['origen'] || '';
    });
  }

  // ===== CARGAR DEPARTAMENTOS =====
  private cargarDepartamentos(): void {
    this.departamentoService.getDepartamentos({}).subscribe({
      next: (response) => {
        if (response.codigo >= 200 && response.codigo < 300) {
          const departamentos = response.data.content.map((d) => ({
            value: d.oidDepartamento,
            label: d.nombre,
          }));

          this.departamentosDisponibles = [
            { value: 'TODOS', label: 'TODOS' },
            ...departamentos,
          ];
        }
      },
      error: () => {
        this.toastr.warning(
          'No se pudieron cargar los departamentos',
          'Advertencia'
        );
      },
    });
  }

  // ===== APLICAR FILTROS =====
  aplicarFiltros(): void {
    const filtros: FiltrosMaterias = {};

    if (this.filtroDepartamento !== 'TODOS') {
      filtros.oidDepartamento = this.filtroDepartamento;
    }

    if (this.filtroSemestre !== 'TODOS') {
      filtros.semestre = this.filtroSemestre;
    }

    if (this.filtroOid.trim()) {
      filtros.oidMateria = this.filtroOid.trim();
    }

    if (this.filtroCodigo.trim()) {
      filtros.codigo = this.filtroCodigo.trim();
    }

    if (this.filtroNombre.trim()) {
      filtros.nombre = this.filtroNombre.trim();
    }

    this.filtrosAplicados = { ...filtros };
    this.toastr.success('Filtros aplicados correctamente', 'Búsqueda');
  }

  // ===== LIMPIAR FILTROS =====
  limpiarFiltros(): void {
    this.filtroOid = '';
    this.filtroCodigo = '';
    this.filtroNombre = '';
    this.filtroSemestre = 'TODOS';
    this.filtroDepartamento = 'TODOS';
    this.filtrosAplicados = {};
    this.toastr.info('Filtros limpiados', 'Información');
  }

  // ===== CAMBIAR TAB =====
  cambiarTab(tab: TabActivo): void {
    this.activeTab = tab;
  }

  // ===== NAVEGACIÓN =====
  volverALista(): void {
    let rutaDestino = '/app/gestion-necesidades/management';

    if (this.origenNavegacion === 'secretario') {
      rutaDestino = '/app/gestion-necesidades/management/secretario';
    } else if (this.origenNavegacion === 'coordinador') {
      rutaDestino = '/app/gestion-necesidades/management/coordinador';
    } else {
      if (hasRole('SECRETARIO')) {
        rutaDestino = '/app/gestion-necesidades/management/secretario';
      } else if (hasRole('COORDINADOR')) {
        rutaDestino = '/app/gestion-necesidades/management/coordinador';
      }
    }

    this.router.navigate([rutaDestino]);
  }
}
