import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  inject,
  effect,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import {
  Usuario,
  UsuarioFilters,
} from '../../../../../users-roles-management/models';
import { UsuarioService } from '../../../../../users-roles-management/services';

@Component({
  selector: 'app-step-asignar-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-asignar-usuarios.component.html',
  styleUrl: './step-asignar-usuarios.component.css',
})
export class StepAsignarUsuariosComponent implements OnInit, OnDestroy {
  private readonly toastr = inject(ToastrService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly destroy$ = new Subject<void>();

  @Input() usuariosSeleccionados: number[] = [];
  @Output() cambio = new EventEmitter<number[]>();
  @Output() validezCambiada = new EventEmitter<boolean>();

  // ===== CONSTANTES =====
  readonly MAX_USUARIOS = 50;
  readonly MIN_USUARIOS = 0;
  readonly USUARIOS_POR_PAGINA = 10;

  // ===== SIGNALS =====
  readonly tabActual = signal<'buscar' | 'seleccionados'>('buscar');
  readonly usuariosDisponibles = signal<Usuario[]>([]);
  readonly idsSeleccionados = signal<number[]>([]);
  readonly cargando = signal<boolean>(false);

  // Paginación
  readonly paginaActual = signal<number>(1);
  readonly totalPaginas = signal<number>(0);
  readonly totalUsuarios = signal<number>(0);

  // Búsqueda y filtros
  readonly terminoBusqueda = signal<string>('');
  readonly filtros = signal<UsuarioFilters>({});

  // ===== COMPUTED =====
  readonly formularioValido = computed(() => {
    return true; // Opcional
  });

  readonly haySeleccionados = computed(() => {
    return this.idsSeleccionados().length > 0;
  });

  readonly cantidadSeleccionados = computed(() => {
    return this.idsSeleccionados().length;
  });

  readonly usuariosSeleccionadosCompletos = computed(() => {
    const ids = this.idsSeleccionados();
    return this.usuariosDisponibles().filter((u) => ids.includes(u.oidUsuario));
  });

  readonly puedeSeleccionarMas = computed(() => {
    return this.idsSeleccionados().length < this.MAX_USUARIOS;
  });

  constructor() {
    // Effect para emitir cambios
    effect(() => {
      this.cambio.emit(this.idsSeleccionados());
    });

    // Effect para validez
    effect(() => {
      this.validezCambiada.emit(this.formularioValido());
    });
  }

  ngOnInit(): void {
    // Cargar usuarios seleccionados del wizard
    if (this.usuariosSeleccionados && this.usuariosSeleccionados.length > 0) {
      this.idsSeleccionados.set([...this.usuariosSeleccionados]);
    }

    // Cargar primera página
    this.cargarUsuarios();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ===== CARGA DE DATOS =====
  // ===== CARGA DE DATOS =====
  cargarUsuarios(): void {
    this.cargando.set(true);

    const filtrosActuales: UsuarioFilters = {
      ...this.filtros(),
      page: this.paginaActual() - 1,
      size: this.USUARIOS_POR_PAGINA,
    };

    this.usuarioService
      .getUsuarios(filtrosActuales)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const esExitoso = response.codigo >= 200 && response.codigo < 300;

          if (esExitoso && response.data) {
            this.usuariosDisponibles.set(response.data.content || []);
            this.totalPaginas.set(response.data.totalPages || 0);
            this.totalUsuarios.set(response.data.totalElements || 0);
          } else {
            this.toastr.error(response.mensaje || 'Error al cargar usuarios');
            this.usuariosDisponibles.set([]);
          }
          this.cargando.set(false);
        },
        error: (error) => {
          console.error('Error al cargar usuarios:', error);
          this.toastr.error('Error de conexión al cargar usuarios');
          this.usuariosDisponibles.set([]);
          this.cargando.set(false);
        },
      });
  }

  // ===== SELECCIÓN =====
  toggleSeleccion(oidUsuario: number): void {
    const ids = this.idsSeleccionados();

    if (ids.includes(oidUsuario)) {
      this.idsSeleccionados.set(ids.filter((id) => id !== oidUsuario));
    } else {
      if (!this.puedeSeleccionarMas()) {
        this.toastr.warning(`Máximo ${this.MAX_USUARIOS} usuarios permitidos`);
        return;
      }
      this.idsSeleccionados.set([...ids, oidUsuario]);
    }
  }

  estaSeleccionado(oidUsuario: number): boolean {
    return this.idsSeleccionados().includes(oidUsuario);
  }

  removerSeleccionado(oidUsuario: number): void {
    this.idsSeleccionados.set(
      this.idsSeleccionados().filter((id) => id !== oidUsuario)
    );
  }

  limpiarSeleccion(): void {
    if (confirm('¿Estás seguro de limpiar toda la selección?')) {
      this.idsSeleccionados.set([]);
      this.toastr.success('Selección limpiada');
    }
  }

  // ===== TABS =====
  cambiarTab(tab: 'buscar' | 'seleccionados'): void {
    this.tabActual.set(tab);
  }

  // ===== PAGINACIÓN =====
  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual.set(pagina);
      this.cargarUsuarios();
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual() > 1) {
      this.irAPagina(this.paginaActual() - 1);
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual() < this.totalPaginas()) {
      this.irAPagina(this.paginaActual() + 1);
    }
  }

  // ===== BÚSQUEDA =====
  onBusquedaChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.terminoBusqueda.set(input.value);
  }

  buscar(): void {
    this.filtros.update((f) => ({
      ...f,
      searchTerm: this.terminoBusqueda(),
    }));
    this.paginaActual.set(1);
    this.cargarUsuarios();
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda.set('');
    this.filtros.set({});
    this.paginaActual.set(1);
    this.cargarUsuarios();
  }

  // ===== UTILIDADES =====
  obtenerNombreCompleto(usuario: Usuario): string {
    return `${usuario.nombres} ${usuario.apellidos}`;
  }

  obtenerDepartamentoCorto(usuario: Usuario): string {
    const depto = usuario.usuarioDetalle?.departamento || 'N/A';
    return depto.length > 30 ? depto.substring(0, 27) + '...' : depto;
  }

  obtenerEstadoColor(estado: string): string {
    return estado === 'ACTIVO' ? 'success' : 'danger';
  }

  obtenerEstadoIcono(estado: string): string {
    return estado === 'ACTIVO' ? '🟢' : '🔴';
  }

  marcarTodoComoTocado(): void {
    // Opcional
  }

  // ===== TRACK BY =====
  trackByOid(index: number, usuario: Usuario): number {
    return usuario.oidUsuario;
  }
}
