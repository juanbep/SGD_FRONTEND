import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import {
  FilterModalComponent,
  CampoFiltro,
  ValoresFiltros,
} from '../../../../shared/components/filter-modal/filter-modal.component';
import { environment } from '../../../../../environments/environments_sgd';
import { NecesidadesService } from '../../services/necesidades.service';
import { Necesidad } from '../../models/necesidad.interface';
import { AsAuthServiceService } from '../../../../core/services/as-auth-service.service';

@Component({
  selector: 'app-view-needs',
  standalone: true,
  imports: [FormsModule, PaginatorComponent, FilterModalComponent],
  templateUrl: './view-needs.component.html',
  styleUrl: './view-needs.component.css',
})
export class ViewNeedsComponent implements OnInit {
  private readonly necesidadesService = inject(NecesidadesService);
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AsAuthServiceService);

  private readonly PAGE_SIZE = 20;
  private readonly TOKEN_STORAGE_KEYS = [
    'token',
    'authToken',
    'accessToken',
    'authorization',
    'Authorization',
  ];

  necesidades = signal<Necesidad[]>([]);
  necesidadesFiltradas = signal<Necesidad[]>([]);

  cargando = signal(false);
  mensajeError = signal('');

  filtroPeriodo = signal('');
  filtroDepartamento = signal('');
  filtroPrograma = signal('');
  filtroNombre = signal('');
  filtroSemestre = signal('');
  filtroCodigo = signal('');

  mostrarModalFiltros = signal(false);
  camposFiltroModal: CampoFiltro[] = [];

  paginaActual = signal(1);
  totalElementos = signal(0);

  private userData = JSON.parse(localStorage.getItem('userData') || '{}');
  private userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
  private oidPrograma = this.userData?.programaCoordinador?.oidPrograma || null;

  totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.necesidadesFiltradas().length / this.PAGE_SIZE))
  );

  necesidadesVisibles = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.PAGE_SIZE;
    return this.necesidadesFiltradas().slice(inicio, inicio + this.PAGE_SIZE);
  });

  constructor() {
    this.validarDatosUsuario();
    this.configurarCamposModal();
  }

  ngOnInit(): void {
    this.cargarCalendariosYNecesidades();
  }

  private validarDatosUsuario(): void {
    if (!this.userData?.programaCoordinador?.oidPrograma) {
      console.error(
        'Estructura de userData inválida o incompleta en localStorage'
      );
    }
  }

  private obtenerToken(): string {
    for (const key of this.TOKEN_STORAGE_KEYS) {
      const token = localStorage.getItem(key);
      if (token) {
        return token;
      }
    }

    if (this.userData && typeof this.userData === 'object') {
      return this.userData.token || this.userData.accessToken || '';
    }

    return '';
  }

  private cargarCalendariosYNecesidades(): void {
    const token = this.obtenerToken();

    if (!token) {
      console.warn(
        'Token no encontrado. Cargando necesidades sin filtro de calendario.'
      );
      this.cargarNecesidades();
      return;
    }

    this.obtenerCalendariosActivos(token);
  }

  private obtenerCalendariosActivos(token: string): void {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const params = new HttpParams().set('estado', 'ACTIVO');
    const url = `${environment.baseUrl}/calendarios`;

    this.http.get(url, { headers, params }).subscribe({
      next: (response: any) => {
        const calendarioId = this.extraerPrimerCalendarioId(response);
        this.cargarNecesidadesConCalendario(calendarioId);
      },
      error: (error) => {
        console.error('Error al obtener calendarios:', error);
        this.cargarNecesidades();
      },
    });
  }

  private extraerPrimerCalendarioId(response: any): number | null {
    const content = response?.data?.content;

    if (!Array.isArray(content) || content.length === 0) {
      return null;
    }

    const firstCalendar = content[0];
    return firstCalendar?.oidcalendario ?? firstCalendar?.oidCalendario ?? null;
  }

  private cargarNecesidadesConCalendario(calendarioId: number | null): void {
    if (calendarioId) {
      this.filtroPeriodo.set(String(calendarioId));
      this.cargarNecesidades(calendarioId);
    } else {
      this.cargarNecesidades();
    }
  }

  configurarCamposModal(): void {
    this.camposFiltroModal = [
      {
        nombre: 'nombre',
        etiqueta: 'Nombre',
        tipo: 'texto',
        placeholder: 'Ingrese el nombre de la necesidad',
        icono: 'fas fa-font',
      },
      {
        nombre: 'semestre',
        etiqueta: 'Semestre',
        tipo: 'select',
        opciones: [],
        icono: 'fas fa-list-ol',
      },
      {
        nombre: 'codigo',
        etiqueta: 'Código',
        tipo: 'texto',
        placeholder: 'Ingrese el código',
        icono: 'fas fa-code',
      },
    ];
  }

  cargarNecesidades(oidCalendario?: number): void {
    if (!this.tieneRolCoordinador()) {
      this.mensajeError.set('No tiene permisos para cargar las necesidades.');
      return;
    }

    const filtros = this.construirFiltros(oidCalendario);
    this.ejecutarCargaNecesidades(filtros);
  }

  private tieneRolCoordinador(): boolean {
    return this.userRoles.includes('COORDINADOR');
  }

  private construirFiltros(oidCalendario?: number): any {
    const filtros: any = {};

    if (this.oidPrograma) {
      filtros.programaOid = this.oidPrograma;
    }

    if (oidCalendario !== undefined && oidCalendario !== null) {
      filtros.oidCalendario = oidCalendario;
      filtros.calendarioOid = oidCalendario;
    }

    return filtros;
  }

  private ejecutarCargaNecesidades(filtros: any): void {
    this.cargando.set(true);
    this.mensajeError.set('');

    this.necesidadesService.listar(filtros).subscribe({
      next: (pageResponse) => {
        this.necesidades.set(pageResponse.content);
        this.totalElementos.set(pageResponse.totalElements);
        this.aplicarFiltrosLocales();
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar necesidades:', error);
        this.mensajeError.set(
          'Error al cargar las necesidades. Por favor, intente nuevamente.'
        );
        this.cargando.set(false);
      },
    });
  }

  trackByOid(index: number, item: Necesidad): number {
    return item.oidNecesidad;
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual.set(pagina);
  }

  aplicarFiltros(): void {
    this.paginaActual.set(1);
    this.aplicarFiltrosLocales();
  }

  limpiarFiltros(): void {
    this.reiniciarFiltros();
    this.paginaActual.set(1);
    this.aplicarFiltrosLocales();
  }

  private reiniciarFiltros(): void {
    this.filtroPeriodo.set('');
    this.filtroDepartamento.set('');
    this.filtroPrograma.set('');
    this.filtroNombre.set('');
    this.filtroSemestre.set('');
    this.filtroCodigo.set('');
  }

  abrirModalFiltros(): void {
    this.mostrarModalFiltros.set(true);
  }

  cerrarModalFiltros(): void {
    this.mostrarModalFiltros.set(false);
  }

  aplicarFiltrosModal(valores: ValoresFiltros): void {
    this.filtroNombre.set((valores['nombre'] as string) || '');
    this.filtroSemestre.set((valores['semestre'] as string) || '');
    this.filtroCodigo.set((valores['codigo'] as string) || '');
    this.aplicarFiltros();
  }

  limpiarFiltrosModal(): void {
    this.filtroNombre.set('');
    this.filtroSemestre.set('');
    this.filtroCodigo.set('');
    this.aplicarFiltros();
  }

  private aplicarFiltrosLocales(): void {
    const filtradas = this.necesidades().filter((necesidad) =>
      this.cumpleFiltros(necesidad)
    );
    this.necesidadesFiltradas.set(filtradas);
  }

  private cumpleFiltros(necesidad: Necesidad): boolean {
    return (
      this.cumpleFiltroCalendario(necesidad) &&
      this.cumpleFiltroNombre(necesidad) &&
      this.cumpleFiltroSemestre(necesidad) &&
      this.cumpleFiltroCodigo(necesidad)
    );
  }

  private cumpleFiltroCalendario(necesidad: Necesidad): boolean {
    return (
      !this.filtroPeriodo() ||
      necesidad.oidCalendario.toString() === this.filtroPeriodo()
    );
  }

  private cumpleFiltroNombre(necesidad: Necesidad): boolean {
    if (!this.filtroNombre()) return true;
    return necesidad.nombreMateria
      .toLowerCase()
      .includes(this.filtroNombre().toLowerCase());
  }

  private cumpleFiltroSemestre(necesidad: Necesidad): boolean {
    return (
      !this.filtroSemestre() ||
      necesidad.semestreMateria.toString() === this.filtroSemestre()
    );
  }

  private cumpleFiltroCodigo(necesidad: Necesidad): boolean {
    if (!this.filtroCodigo()) return true;
    return necesidad.codigoMateria
      .toLowerCase()
      .includes(this.filtroCodigo().toLowerCase());
  }
}
