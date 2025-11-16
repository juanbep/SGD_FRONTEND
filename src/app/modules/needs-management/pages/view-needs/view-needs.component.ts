import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    CommonModule,
    FormsModule,
    PaginatorComponent,
    FilterModalComponent,
  ],
  templateUrl: './view-needs.component.html',
  styleUrls: ['./view-needs.component.css'],
})
export class ViewNeedsComponent implements OnInit {
  private readonly necesidadesService = inject(NecesidadesService);
  private readonly TAMANIO_PAGINA = 20;

  necesidades: Necesidad[] = [];
  necesidadesFiltradas: Necesidad[] = [];

  cargando = false;
  mensajeError = '';

  filtroPeriodo = '';
  filtroDepartamento = '';
  filtroPrograma = '';
  filtroNombre = '';
  filtroSemestre = '';
  filtroCodigo = '';

  mostrarModalFiltros = false;
  camposFiltroModal: CampoFiltro[] = [];

  paginaActual = 1;
  totalElementos = 0;

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
    this.cargando = true;
    this.mensajeError = '';

    this.necesidadesService.listar().subscribe({
      next: (pageResponse) => {
        this.necesidades = pageResponse.content;
        this.totalElementos = pageResponse.totalElements;
        this.aplicarFiltrosLocales();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar necesidades:', error);
        this.mensajeError =
          'Error al cargar las necesidades. Por favor, intente nuevamente.';
        this.cargando = false;
      },
    });
  }

  trackByOid(index: number, item: Necesidad): number {
    return item.oidNecesidad;
  }

  get totalPaginas(): number {
    return Math.max(
      1,
      Math.ceil(this.necesidadesFiltradas.length / this.TAMANIO_PAGINA)
    );
  }

  get necesidadesVisibles(): Necesidad[] {
    const inicio = (this.paginaActual - 1) * this.TAMANIO_PAGINA;
    return this.necesidadesFiltradas.slice(
      inicio,
      inicio + this.TAMANIO_PAGINA
    );
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  aplicarFiltros(): void {
    this.paginaActual = 1;
    this.aplicarFiltrosLocales();
  }

  limpiarFiltros(): void {
    this.reiniciarFiltros();
    this.paginaActual = 1;
    this.aplicarFiltrosLocales();
  }

  private reiniciarFiltros(): void {
    this.filtroPeriodo = '';
    this.filtroDepartamento = '';
    this.filtroPrograma = '';
    this.filtroNombre = '';
    this.filtroSemestre = '';
    this.filtroCodigo = '';
  }

  abrirModalFiltros(): void {
    this.mostrarModalFiltros = true;
  }

  cerrarModalFiltros(): void {
    this.mostrarModalFiltros = false;
  }

  aplicarFiltrosModal(valores: ValoresFiltros): void {
    this.filtroNombre = (valores['nombre'] as string) || '';
    this.filtroSemestre = (valores['semestre'] as string) || '';
    this.filtroCodigo = (valores['codigo'] as string) || '';
    this.aplicarFiltros();
  }

  limpiarFiltrosModal(): void {
    this.filtroNombre = '';
    this.filtroSemestre = '';
    this.filtroCodigo = '';
    this.aplicarFiltros();
  }

  private aplicarFiltrosLocales(): void {
    this.necesidadesFiltradas = this.necesidades.filter((necesidad) =>
      this.cumpleFiltros(necesidad)
    );
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
      !this.filtroPeriodo ||
      necesidad.oidCalendario.toString() === this.filtroPeriodo
    );
  }

  private cumpleFiltroNombre(necesidad: Necesidad): boolean {
    if (!this.filtroNombre) return true;
    return necesidad.nombreMateria
      .toLowerCase()
      .includes(this.filtroNombre.toLowerCase());
  }

  private cumpleFiltroSemestre(necesidad: Necesidad): boolean {
    return (
      !this.filtroSemestre ||
      necesidad.semestreMateria.toString() === this.filtroSemestre
    );
  }

  private cumpleFiltroCodigo(necesidad: Necesidad): boolean {
    if (!this.filtroCodigo) return true;
    return necesidad.codigoMateria
      .toLowerCase()
      .includes(this.filtroCodigo.toLowerCase());
  }
}
