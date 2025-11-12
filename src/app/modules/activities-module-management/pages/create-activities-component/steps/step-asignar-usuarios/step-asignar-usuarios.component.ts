import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  inject,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil, forkJoin, of, catchError } from 'rxjs';
import {
  Usuario,
  UsuarioFilters,
} from '../../../../../sgd-users-management/models';
import { UsuarioService } from '../../../../../sgd-users-management//services';
import { UsuarioCarouselComponent } from '../../../../components/activities-component/explore-activities-component/usuario-carousel/usuario-carousel.component';

@Component({
  selector: 'app-step-asignar-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, UsuarioCarouselComponent],
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
  readonly MAX_USUARIOS = 4;
  readonly MIN_USUARIOS = 0;

  // ===== SIGNALS =====
  readonly tabActual = signal<'buscar' | 'seleccionados'>('buscar');
  readonly usuariosDisponibles = signal<Usuario[]>([]);
  readonly idsSeleccionados = signal<number[]>([]);
  readonly usuariosSeleccionadosCache = signal<Usuario[]>([]);
  readonly cargando = signal<boolean>(false);
  readonly usuariosPorPagina = signal<number>(10);
  // Modal de detalles
  readonly usuarioIdModal = signal<number | null>(null);
  readonly modalAbierto = signal<boolean>(false);

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
    return this.usuariosSeleccionadosCache();
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

      // Cargar información completa de usuarios pre-seleccionados
      this.cargarUsuariosSeleccionados(this.usuariosSeleccionados);
    }

    // Cargar primera página
    this.cargarUsuarios();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ===== CARGA DE DATOS =====
  cargarUsuarios(): void {
    this.cargando.set(true);

    const filtrosActuales: UsuarioFilters = {
      ...this.filtros(),
      page: this.paginaActual() - 1,
      size: this.usuariosPorPagina(),
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

  /**
   * Carga la información completa de usuarios pre-seleccionados desde el backend
   */
  private cargarUsuariosSeleccionados(oidUsuarios: number[]): void {
    if (!oidUsuarios || oidUsuarios.length === 0) {
      return;
    }

    this.cargando.set(true);

    // Crear array de observables para cargar todos los usuarios
    const requests = oidUsuarios.map((oid) =>
      this.usuarioService.getUsuarioById(oid).pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error(`Error al cargar usuario ${oid}:`, error);
          // Continuar con los demás usuarios aunque uno falle
          return of(null);
        })
      )
    );

    // Ejecutar todas las peticiones en paralelo
    forkJoin(requests).subscribe({
      next: (responses) => {
        const usuariosCargados: Usuario[] = [];

        responses.forEach((response) => {
          if (
            response &&
            response.codigo >= 200 &&
            response.codigo < 300 &&
            response.data
          ) {
            usuariosCargados.push(response.data);
          }
        });

        // Actualizar el cache con los usuarios cargados
        this.usuariosSeleccionadosCache.set(usuariosCargados);

        if (usuariosCargados.length < oidUsuarios.length) {
          this.toastr.warning(
            'Algunos usuarios seleccionados no pudieron ser cargados',
            'Advertencia'
          );
        }

        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar usuarios seleccionados:', error);
        this.toastr.error(
          'Error al cargar información de usuarios seleccionados'
        );
        this.cargando.set(false);
      },
    });
  }

  // ===== SELECCIÓN =====
  toggleSeleccion(oidUsuario: number): void {
    const ids = this.idsSeleccionados();

    if (ids.includes(oidUsuario)) {
      // DESELECCIONAR
      this.idsSeleccionados.set(ids.filter((id) => id !== oidUsuario));

      // Quitar del cache
      this.usuariosSeleccionadosCache.update((cache) =>
        cache.filter((u) => u.oidUsuario !== oidUsuario)
      );
    } else {
      // SELECCIONAR
      if (!this.puedeSeleccionarMas()) {
        this.toastr.warning(`Máximo ${this.MAX_USUARIOS} usuarios permitidos`);
        return;
      }

      this.idsSeleccionados.set([...ids, oidUsuario]);

      // Agregar al cache (buscar en usuariosDisponibles)
      const usuario = this.usuariosDisponibles().find(
        (u) => u.oidUsuario === oidUsuario
      );
      if (usuario) {
        this.usuariosSeleccionadosCache.update((cache) => [...cache, usuario]);
      }
    }
  }

  estaSeleccionado(oidUsuario: number): boolean {
    return this.idsSeleccionados().includes(oidUsuario);
  }

  removerSeleccionado(oidUsuario: number): void {
    this.idsSeleccionados.set(
      this.idsSeleccionados().filter((id) => id !== oidUsuario)
    );

    // Quitar del cache
    this.usuariosSeleccionadosCache.update((cache) =>
      cache.filter((u) => u.oidUsuario !== oidUsuario)
    );
  }

  limpiarSeleccion(): void {
    if (confirm('¿Estás seguro de limpiar toda la selección?')) {
      this.idsSeleccionados.set([]);
      this.usuariosSeleccionadosCache.set([]); // Limpiar cache
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

  // ===== CAMBIO DE TAMAÑO DE PÁGINA =====
  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const nuevoTamanio = parseInt(select.value, 10);

    this.usuariosPorPagina.set(nuevoTamanio);
    this.paginaActual.set(1); // Volver a primera página
    this.cargarUsuarios();
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

  // ===== MODAL DE DETALLES =====
  abrirModalDetalles(oidUsuario: number): void {
    this.usuarioIdModal.set(oidUsuario);
    this.modalAbierto.set(true);
  }

  cerrarModalDetalles(): void {
    this.modalAbierto.set(false);
    setTimeout(() => {
      this.usuarioIdModal.set(null);
    }, 300);
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
