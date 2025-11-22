import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Materia } from '../../models';

@Component({
  selector: 'app-list-materias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-materias.component.html',
  styleUrl: './list-materias.component.css',
})
export class ListMateriasComponent implements OnInit {
  @Input() oidPlan: number | undefined;
  @Input() numeroPlan: string | undefined;

  @Output() onNuevaMateria = new EventEmitter<void>();
  @Output() onModificar = new EventEmitter<Materia>();
  @Output() onEliminar = new EventEmitter<Materia>();
  @Output() onVerCorrequisitos = new EventEmitter<Materia>();

  // ===== SEMESTRES DISPONIBLES =====
  readonly semestresDisponibles: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // ===== FILTROS =====
  filtroOid: string = '';
  filtroCodigo: string = '';
  filtroNombre: string = '';
  filtroSemestre: number | '' = '';

  // ===== PAGINACIÓN =====
  page = 0;
  size = 10;
  totalElements = 0;

  // ===== DATOS =====
  materias: Materia[] = [];
  loading = false;
  error: string | null = null;

  // ===== UTILIDADES =====
  Math = Math;

  ngOnInit(): void {
    this.cargarMaterias();
  }

  // ===== CARGAR DATOS (CON MOCK) =====
  cargarMaterias(): void {
    this.loading = true;
    this.error = null;

    // Simulamos llamada asíncrona
    setTimeout(() => {
      // DATOS MOCK - Reemplazar con servicio real
      const todosMock: Materia[] = [
        {
          idMateria: 1,
          oidMateria: 'MAT-2024-001',
          codigo: 'CS101',
          nombre: 'Introducción a la Programación',
          semestre: 1,
          horasSemana: 4,
          oidDepartamento: 1,
          nombreDepartamento: 'Ciencias de la Computación',
          oidPlan: this.oidPlan || 1,
          numeroPlan: this.numeroPlan || '001',
          idCorrequisito: null,
          oidCorrequisito: null,
          nombreCorrequisito: null,
          fechaCreacion: '2024-01-10',
          usuarioCreacion: 'admin',
          fechaActualizacion: null,
          usuarioActualizacion: null,
        },
        {
          idMateria: 2,
          oidMateria: 'MAT-2024-002',
          codigo: 'MAT101',
          nombre: 'Cálculo Diferencial',
          semestre: 1,
          horasSemana: 5,
          oidDepartamento: 2,
          nombreDepartamento: 'Matemáticas',
          oidPlan: this.oidPlan || 1,
          numeroPlan: this.numeroPlan || '001',
          idCorrequisito: null,
          oidCorrequisito: null,
          nombreCorrequisito: null,
          fechaCreacion: '2024-01-10',
          usuarioCreacion: 'admin',
          fechaActualizacion: null,
          usuarioActualizacion: null,
        },
        {
          idMateria: 3,
          oidMateria: 'MAT-2024-003',
          codigo: 'CS102',
          nombre: 'Estructura de Datos',
          semestre: 2,
          horasSemana: 4,
          oidDepartamento: 1,
          nombreDepartamento: 'Ciencias de la Computación',
          oidPlan: this.oidPlan || 1,
          numeroPlan: this.numeroPlan || '001',
          idCorrequisito: 1,
          oidCorrequisito: 'MAT-2024-001',
          nombreCorrequisito: 'Introducción a la Programación',
          fechaCreacion: '2024-01-10',
          usuarioCreacion: 'admin',
          fechaActualizacion: null,
          usuarioActualizacion: null,
        },
        {
          idMateria: 4,
          oidMateria: 'MAT-2024-004',
          codigo: 'MAT102',
          nombre: 'Cálculo Integral',
          semestre: 2,
          horasSemana: 5,
          oidDepartamento: 2,
          nombreDepartamento: 'Matemáticas',
          oidPlan: this.oidPlan || 1,
          numeroPlan: this.numeroPlan || '001',
          idCorrequisito: 2,
          oidCorrequisito: 'MAT-2024-002',
          nombreCorrequisito: 'Cálculo Diferencial',
          fechaCreacion: '2024-01-10',
          usuarioCreacion: 'admin',
          fechaActualizacion: null,
          usuarioActualizacion: null,
        },
        {
          idMateria: 5,
          oidMateria: 'MAT-2024-005',
          codigo: 'CS201',
          nombre: 'Algoritmos y Complejidad',
          semestre: 3,
          horasSemana: 4,
          oidDepartamento: 1,
          nombreDepartamento: 'Ciencias de la Computación',
          oidPlan: this.oidPlan || 1,
          numeroPlan: this.numeroPlan || '001',
          idCorrequisito: 3,
          oidCorrequisito: 'MAT-2024-003',
          nombreCorrequisito: 'Estructura de Datos',
          fechaCreacion: '2024-01-10',
          usuarioCreacion: 'admin',
          fechaActualizacion: null,
          usuarioActualizacion: null,
        },
        {
          idMateria: 6,
          oidMateria: 'MAT-2024-006',
          codigo: 'CS301',
          nombre: 'Base de Datos',
          semestre: 4,
          horasSemana: 4,
          oidDepartamento: 1,
          nombreDepartamento: 'Ciencias de la Computación',
          oidPlan: this.oidPlan || 1,
          numeroPlan: this.numeroPlan || '001',
          idCorrequisito: 3,
          oidCorrequisito: 'MAT-2024-003',
          nombreCorrequisito: 'Estructura de Datos',
          fechaCreacion: '2024-01-10',
          usuarioCreacion: 'admin',
          fechaActualizacion: null,
          usuarioActualizacion: null,
        },
        {
          idMateria: 7,
          oidMateria: 'MAT-2024-007',
          codigo: 'CS302',
          nombre: 'Ingeniería de Software',
          semestre: 5,
          horasSemana: 4,
          oidDepartamento: 1,
          nombreDepartamento: 'Ciencias de la Computación',
          oidPlan: this.oidPlan || 1,
          numeroPlan: this.numeroPlan || '001',
          idCorrequisito: 6,
          oidCorrequisito: 'MAT-2024-006',
          nombreCorrequisito: 'Base de Datos',
          fechaCreacion: '2024-01-10',
          usuarioCreacion: 'admin',
          fechaActualizacion: null,
          usuarioActualizacion: null,
        },
        {
          idMateria: 8,
          oidMateria: 'MAT-2024-008',
          codigo: 'FIS101',
          nombre: 'Física I',
          semestre: 2,
          horasSemana: 4,
          oidDepartamento: 3,
          nombreDepartamento: 'Física',
          oidPlan: this.oidPlan || 1,
          numeroPlan: this.numeroPlan || '001',
          idCorrequisito: null,
          oidCorrequisito: null,
          nombreCorrequisito: null,
          fechaCreacion: '2024-01-10',
          usuarioCreacion: 'admin',
          fechaActualizacion: null,
          usuarioActualizacion: null,
        },
      ];

      // Aplicar filtros
      let materiasFiltradas = [...todosMock];

      if (this.filtroOid) {
        materiasFiltradas = materiasFiltradas.filter((m) =>
          m.oidMateria.toLowerCase().includes(this.filtroOid.toLowerCase())
        );
      }

      if (this.filtroCodigo) {
        materiasFiltradas = materiasFiltradas.filter((m) =>
          m.codigo.toLowerCase().includes(this.filtroCodigo.toLowerCase())
        );
      }

      if (this.filtroNombre) {
        materiasFiltradas = materiasFiltradas.filter((m) =>
          m.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
        );
      }

      if (this.filtroSemestre) {
        materiasFiltradas = materiasFiltradas.filter(
          (m) => m.semestre === this.filtroSemestre
        );
      }

      // Simular paginación
      this.totalElements = materiasFiltradas.length;
      const inicio = this.page * this.size;
      const fin = inicio + this.size;
      this.materias = materiasFiltradas.slice(inicio, fin);

      this.loading = false;
    }, 800);
  }

  // ===== MANEJADORES DE FILTROS =====
  onFiltroChange(): void {
    this.page = 0;
    this.cargarMaterias();
  }

  limpiarFiltros(): void {
    this.filtroOid = '';
    this.filtroCodigo = '';
    this.filtroNombre = '';
    this.filtroSemestre = '';
    this.page = 0;
    this.cargarMaterias();
  }

  onPageSizeChange(event: any): void {
    this.size = parseInt(event.target.value);
    this.page = 0;
    this.cargarMaterias();
  }

  // ===== PAGINACIÓN =====
  irAPagina(nuevaPagina: number): void {
    this.page = nuevaPagina;
    this.cargarMaterias();
  }

  getTotalPaginas(): number {
    return Math.ceil(this.totalElements / this.size);
  }

  getPaginasVisibles(): number[] {
    const totalPaginas = this.getTotalPaginas();
    if (totalPaginas <= 1) return [];

    const paginas: number[] = [];
    const inicio = Math.max(0, this.page - 2);
    const fin = Math.min(totalPaginas - 1, this.page + 2);

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }

    return paginas;
  }

  getInfoPaginacion(): string {
    if (this.totalElements === 0) return '0 registros';

    const inicio = this.page * this.size + 1;
    const fin = Math.min((this.page + 1) * this.size, this.totalElements);

    return `${inicio} - ${fin} de ${this.totalElements} registros`;
  }

  // ===== UTILIDADES =====
  trackByMateria(index: number, item: Materia): any {
    return item.idMateria;
  }

  // ===== ACCIONES =====
  crearNuevaMateria(): void {
    console.log('Crear nueva materia');
    this.onNuevaMateria.emit();
  }

  modificarMateria(materia: Materia): void {
    console.log('Modificar materia:', materia);
    this.onModificar.emit(materia);
  }

  eliminarMateria(materia: Materia): void {
    console.log('Eliminar materia:', materia);
    this.onEliminar.emit(materia);
  }

  verCorrequisitos(materia: Materia): void {
    console.log('Ver correquisitos de:', materia);
    this.onVerCorrequisitos.emit(materia);
  }

  descargarPlanilla(): void {
    console.log('Descargar planilla Excel');
    // TODO: Implementar descarga de Excel
    alert('Funcionalidad de descarga de planilla - Por implementar');
  }

  cargarPlanilla(): void {
    console.log('Cargar planilla Excel');
    // TODO: Implementar carga de Excel
    alert('Funcionalidad de carga de planilla - Por implementar');
  }

  reintentar(): void {
    this.cargarMaterias();
  }
}
