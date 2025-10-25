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
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  TiposActividadHelperService,
  CargosActividadHelperService,
} from '../../../../services';
import { CalendarioHelperService } from '../../../../../academic-calendar-management/services';
import { InfoBasicaData } from '../../../../models/create-actividad-wizard.model';

interface DropdownOption {
  value: number;
  label: string;
}

interface CargoDropdownOption extends DropdownOption {
  maxHoras: number;
}

interface CalendarioDropdownOption extends DropdownOption {
  estado: string;
}

@Component({
  selector: 'app-step-info-basica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-info-basica.component.html',
  styleUrl: './step-info-basica.component.css',
})
export class StepInfoBasicaComponent implements OnInit {
  private readonly toastr = inject(ToastrService);
  private readonly tipoActividadHelper = inject(TiposActividadHelperService);
  private readonly cargoActividadHelper = inject(CargosActividadHelperService);
  private readonly calendarioHelper = inject(CalendarioHelperService);

  @Input() datos!: InfoBasicaData;
  @Output() cambio = new EventEmitter<InfoBasicaData>();
  @Output() validezCambiada = new EventEmitter<boolean>();

  // ===== SIGNALS =====
  readonly formData = signal<InfoBasicaData>({
    oidTipoActividad: null,
    nombreActividad: '',
    oidCargoActividad: null,
    oidCalendario: null,
  });

  readonly tiposActividad = signal<DropdownOption[]>([]);
  readonly cargos = signal<CargoDropdownOption[]>([]);
  readonly calendarios = signal<CalendarioDropdownOption[]>([]);

  readonly cargandoTipos = signal<boolean>(false);
  readonly cargandoCargos = signal<boolean>(false);
  readonly cargandoCalendarios = signal<boolean>(false);

  readonly camposTocados = signal<{ [key: string]: boolean }>({
    oidTipoActividad: false,
    oidCargoActividad: false,
    oidCalendario: false,
  });

  // ===== COMPUTED =====
  readonly tipoSeleccionado = computed(() => {
    const oid = this.formData().oidTipoActividad;
    return this.tiposActividad().find((t) => t.value === oid);
  });

  readonly cargoSeleccionado = computed(() => {
    const oid = this.formData().oidCargoActividad;
    return this.cargos().find((c) => c.value === oid);
  });

  readonly calendarioSeleccionado = computed(() => {
    const oid = this.formData().oidCalendario;
    return this.calendarios().find((c) => c.value === oid);
  });

  readonly formularioValido = computed(() => {
    const form = this.formData();
    return !!(
      form.oidTipoActividad &&
      form.nombreActividad &&
      form.oidCargoActividad &&
      form.oidCalendario
    );
  });

  readonly hayCargosDisponibles = computed(() => this.cargos().length > 0);

  constructor() {
    // Effect para emitir cambios
    effect(() => {
      this.cambio.emit(this.formData());
    });

    // Effect para validez
    effect(() => {
      this.validezCambiada.emit(this.formularioValido());
    });
  }

  ngOnInit(): void {
    if (this.datos) {
      this.formData.set({ ...this.datos });
    }

    this.cargarTiposActividad();
    this.cargarCalendarios();

    // Validar que no sea null antes de llamar
    const oidTipo = this.formData().oidTipoActividad;
    if (oidTipo !== null) {
      this.cargarCargosPorTipo(oidTipo);
    }
  }

  // ===== CARGA DE DATOS =====

  async cargarTiposActividad(): Promise<void> {
    this.cargandoTipos.set(true);
    try {
      const tipos = await this.tipoActividadHelper.getAllForDropdown();
      this.tiposActividad.set(tipos);
    } catch (error) {
      console.error('Error al cargar tipos:', error);
      this.toastr.error('Error al cargar tipos de actividad');
    } finally {
      this.cargandoTipos.set(false);
    }
  }

  async cargarCalendarios(): Promise<void> {
    this.cargandoCalendarios.set(true);
    try {
      const todos = await this.calendarioHelper.getAllForDropdown();
      // Filtrar solo ACTIVOS
      const activos = todos.filter((c) => c.estado === 'ACTIVO');
      this.calendarios.set(activos);
    } catch (error) {
      console.error('Error al cargar calendarios:', error);
      this.toastr.error('Error al cargar calendarios');
    } finally {
      this.cargandoCalendarios.set(false);
    }
  }

  async cargarCargosPorTipo(oidTipo: number): Promise<void> {
    this.cargandoCargos.set(true);
    try {
      const todosCargos = await this.cargoActividadHelper.getAllForDropdown();
      // TODO: Implementar servicio que traiga los cargos por el oid de la actividad 
      const cargosFiltrados = todosCargos; 
      this.cargos.set(cargosFiltrados);
    } catch (error) {
      console.error('Error al cargar cargos:', error);
      this.toastr.error('Error al cargar cargos de actividad');
    } finally {
      this.cargandoCargos.set(false);
    }
  }

  // ===== EVENTOS =====

  async alCambiarTipoActividad(): Promise<void> {
    this.marcarComoTocado('oidTipoActividad');

    const form = this.formData();

    if (form.oidTipoActividad) {
      const tipo = this.tipoSeleccionado();
      if (tipo) {
        // Asignar nombre automáticamente
        this.formData.update((data) => ({
          ...data,
          nombreActividad: tipo.label,
        }));
      }

      // Reset cargo
      this.formData.update((data) => ({
        ...data,
        oidCargoActividad: null,
      }));
      this.cargos.set([]);

      // Cargar cargos
      await this.cargarCargosPorTipo(form.oidTipoActividad);
    } else {
      this.formData.update((data) => ({
        ...data,
        nombreActividad: '',
        oidCargoActividad: null,
      }));
      this.cargos.set([]);
    }
  }

  alCambiarCargo(): void {
    this.marcarComoTocado('oidCargoActividad');
  }

  alCambiarCalendario(): void {
    this.marcarComoTocado('oidCalendario');
  }

  // ===== VALIDACIÓN =====

  marcarComoTocado(campo: string): void {
    this.camposTocados.update((tocados) => ({
      ...tocados,
      [campo]: true,
    }));
  }

  marcarTodoComoTocado(): void {
    this.camposTocados.set({
      oidTipoActividad: true,
      oidCargoActividad: true,
      oidCalendario: true,
    });
  }

  mostrarError(campo: string): boolean {
    const form = this.formData();
    const tocado = this.camposTocados()[campo];

    if (!tocado) return false;

    switch (campo) {
      case 'oidTipoActividad':
        return !form.oidTipoActividad;
      case 'oidCargoActividad':
        return !form.oidCargoActividad;
      case 'oidCalendario':
        return !form.oidCalendario;
      default:
        return false;
    }
  }

  obtenerMensajeError(campo: string): string {
    switch (campo) {
      case 'oidTipoActividad':
        return 'Debe seleccionar el tipo de actividad';
      case 'oidCargoActividad':
        return 'Debe seleccionar el cargo de actividad';
      case 'oidCalendario':
        return 'Debe seleccionar el calendario académico';
      default:
        return '';
    }
  }
}
