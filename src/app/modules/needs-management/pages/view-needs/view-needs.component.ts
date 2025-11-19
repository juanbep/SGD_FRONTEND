import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import {
  FilterModalComponent,
  CampoFiltro,
  ValoresFiltros,
} from '../../../../shared/components/filter-modal/filter-modal.component';
import { NecesidadesService } from '../../services/necesidades.service';
import { Necesidad } from '../../models/necesidad.interface';

@Component({
  selector: 'app-view-needs',
  standalone: true,
  imports: [
    FormsModule,
    PaginatorComponent,
    FilterModalComponent,
  ],
  templateUrl: './view-needs.component.html',
  styleUrl: './view-needs.component.css',
})
export class ViewNeedsComponent implements OnInit {
  private readonly necesidadesService = inject(NecesidadesService);
  private readonly TAMANIO_PAGINA = 20;

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

  totalPaginas = computed(() =>
    Math.max(
      1,
      Math.ceil(this.necesidadesFiltradas().length / this.TAMANIO_PAGINA)
    )
  );

  necesidadesVisibles = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.TAMANIO_PAGINA;
    return this.necesidadesFiltradas().slice(
      inicio,
      inicio + this.TAMANIO_PAGINA
    );
  });

  constructor() {
    this.configurarCamposModal();
  }

  ngOnInit(): void {
    this.cargarNecesidades();
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
        opciones: [], // TODO: Reemplazar con servicio de catálogos
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

  cargarNecesidades(): void {
    this.cargando.set(true);
    this.mensajeError.set('');

    this.necesidadesService.listar().subscribe({
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
