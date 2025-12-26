import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  signal,
  inject,
  ViewChild,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import {
  Fecha,
  Calendario,
  CreateFechaDto,
  UpdateFechaDto,
  CreateNombreFechaDto,
} from '../../../models';
import { ModalAgregarEditarFechaComponent } from '../../edit-academic-calendar/modal-agregar-editar-fecha/modal-agregar-editar-fecha.component';
import { ModalSeleccionarCalendarioComponent } from '../modal-seleccionar-calendario/modal-seleccionar-calendario.component';
import { ModalEliminarFechaComponent } from '../../edit-academic-calendar/modal-eliminar-fecha/modal-eliminar-fecha.component';
import {
  CalendarioHelperService,
  NombreFechaHelperService,
  FechaHelperService,
} from '../../../services';
import { Utils } from '../../../utils/calendario.utils';

@Component({
  selector: 'app-step-fechas',
  standalone: true,
  imports: [
    CommonModule,
    ModalAgregarEditarFechaComponent,
    ModalSeleccionarCalendarioComponent,
    ModalEliminarFechaComponent,
  ],
  templateUrl: './step-fechas.component.html',
  styleUrl: './step-fechas.component.css',
})
export class StepFechasComponent implements OnInit, OnChanges {
  private readonly toastr = inject(ToastrService);
  private readonly calendarioHelper = inject(CalendarioHelperService);
  private readonly nombreFechaHelper = inject(NombreFechaHelperService);
  private readonly fechaHelper = inject(FechaHelperService);

  @ViewChild(ModalAgregarEditarFechaComponent)
  modalAgregarEditarRef!: ModalAgregarEditarFechaComponent;

  @Input() oidCalendario: number | null = null;

  readonly fechas = signal<Fecha[]>([]);
  readonly modalAgregarVisible = signal<boolean>(false);
  readonly modalSeleccionarVisible = signal<boolean>(false);
  readonly modalEliminarVisible = signal<boolean>(false);
  readonly fechaAEditar = signal<Fecha | null>(null);
  readonly fechaAEliminar = signal<Fecha | null>(null);
  readonly calendariosDisponibles = signal<Calendario[]>([]);
  readonly cargandoCalendarios = signal<boolean>(false);
  readonly cargandoFechas = signal<boolean>(false);
  readonly guardandoFecha = signal<boolean>(false);
  readonly eliminandoFecha = signal<boolean>(false);

  // Signals para datos del calendario
  readonly calendarioActual = signal<Calendario | null>(null);
  readonly anioCalendario = computed(
    () => this.calendarioActual()?.anioCalendario || 0
  );
  readonly numeroCalendario = computed(
    () => this.calendarioActual()?.numeroCalendario || 0
  );

  ngOnInit(): void {
    this.cargarCalendariosDisponibles();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['oidCalendario'] && this.oidCalendario) {
      this.cargarFechas();
    }
  }

  private async cargarFechas(): Promise<void> {
    if (!this.oidCalendario) return;

    this.cargandoFechas.set(true);
    try {
      const calendario = await this.calendarioHelper.getById(
        this.oidCalendario
      );

      // Guardar el calendario completo
      this.calendarioActual.set(calendario);

      this.fechas.set(calendario?.fechas || []);
    } catch (error) {
      console.error('Error al cargar fechas:', error);
      this.toastr.error('Error al cargar las fechas');
    } finally {
      this.cargandoFechas.set(false);
    }
  }

  private async cargarCalendariosDisponibles(): Promise<void> {
    this.cargandoCalendarios.set(true);
    try {
      const calendarios = await this.calendarioHelper.getAll({ size: 50 });

      // Obtener el número de periodo del calendario actual
      const periodoActual = this.numeroCalendario();
      const anioActual = this.anioCalendario();

      // Filtrar solo calendarios del mismo periodo
      const calendariosMismoPeriodo = calendarios.filter((cal) => {
        // Mismo periodo y diferente año
        return (
          cal.numeroCalendario === periodoActual &&
          cal.anioCalendario !== anioActual
        );
      });

      // Ordenar por año descendente
      const ordenados = calendariosMismoPeriodo.sort((a, b) => {
        return b.anioCalendario - a.anioCalendario;
      });

      // Tomar los 10 más recientes
      this.calendariosDisponibles.set(ordenados.slice(0, 10));
    } catch (error) {
      console.error('Error al cargar calendarios:', error);
    } finally {
      this.cargandoCalendarios.set(false);
    }
  }

  abrirModalAgregar(): void {
    this.fechaAEditar.set(null);
    this.modalAgregarVisible.set(true);
  }

  abrirModalEditar(fecha: Fecha): void {
    this.fechaAEditar.set(fecha);
    this.modalAgregarVisible.set(true);
  }

  cerrarModalAgregar(): void {
    this.modalAgregarVisible.set(false);
    this.fechaAEditar.set(null);
    this.guardandoFecha.set(false);
  }

  async confirmarAgregarFecha(createDto: CreateFechaDto): Promise<void> {
    if (!this.oidCalendario) {
      this.toastr.error('No se puede agregar fecha sin calendario');
      return;
    }

    this.guardandoFecha.set(true);

    try {
      const nuevaFecha = await this.fechaHelper.create(createDto);

      if (nuevaFecha) {
        await this.cargarFechas();
        this.toastr.success('Fecha agregada correctamente');
        this.cerrarModalAgregar();
      } else {
        this.toastr.error('No se pudo agregar la fecha');
      }
    } catch (error: any) {
      console.error('Error al agregar fecha:', error);
      const mensaje = error?.error?.mensaje || 'Error al agregar la fecha';
      this.toastr.error(mensaje);
    } finally {
      this.guardandoFecha.set(false);
    }
  }

  async confirmarEditarFecha(updateDto: UpdateFechaDto): Promise<void> {
    this.guardandoFecha.set(true);

    try {
      const fechaActualizada = await this.fechaHelper.update(updateDto);

      if (fechaActualizada) {
        await this.cargarFechas();
        this.toastr.success('Fecha actualizada correctamente');
        this.cerrarModalAgregar();
      } else {
        this.toastr.error('No se pudo actualizar la fecha');
      }
    } catch (error: any) {
      console.error('Error al actualizar fecha:', error);
      const mensaje =
        error?.error?.mensaje ||
        error?.mensaje ||
        'Error al actualizar la fecha';
      this.toastr.error(mensaje);
    } finally {
      this.guardandoFecha.set(false);
    }
  }

  // Método para manejar la creación de nombres de fecha
  async handleCrearNombreFecha(dto: CreateNombreFechaDto): Promise<void> {
    this.guardandoFecha.set(true);

    try {
      const nuevoNombre = await this.nombreFechaHelper.create(dto);

      if (nuevoNombre) {
        this.toastr.success('Tipo de fecha creado correctamente');

        this.modalAgregarEditarRef?.recargarCatalogoNombresFechas();
      } else {
        this.toastr.error('No se pudo crear el tipo de fecha');
      }
    } catch (error: any) {
      const mensaje =
        error?.error?.mensaje || 'Error al crear el tipo de fecha';
      this.toastr.error(mensaje);
    } finally {
      this.guardandoFecha.set(false);
    }
  }

  abrirModalEliminar(fecha: Fecha): void {
    this.fechaAEliminar.set(fecha);
    this.modalEliminarVisible.set(true);
  }

  cerrarModalEliminar(): void {
    this.modalEliminarVisible.set(false);
    this.fechaAEliminar.set(null);
    this.eliminandoFecha.set(false);
  }

  async confirmarEliminarFecha(): Promise<void> {
    const fecha = this.fechaAEliminar();
    if (!fecha) return;

    this.eliminandoFecha.set(true);

    try {
      const resultado = await this.fechaHelper.delete(fecha.oidFecha);

      if (resultado) {
        // Recargar las fechas desde el backend para mantener sincronización
        await this.cargarFechas();

        this.toastr.success('Fecha eliminada con éxito');
        this.cerrarModalEliminar();
      }
    } catch (error: any) {
      this.cerrarModalEliminar();

      // Mostrar el mensaje que viene del backend
      const mensaje = error?.error?.mensaje || 'Error al eliminar la fecha';
      this.toastr.error(mensaje);
    } finally {
      this.eliminandoFecha.set(false);
    }
  }

  abrirModalSeleccionar(): void {
    this.modalSeleccionarVisible.set(true);
  }

  cerrarModalSeleccionar(): void {
    this.modalSeleccionarVisible.set(false);
  }

  async copiarFechas(calendarioOrigen: Calendario): Promise<void> {
    // contar solo fechas con datos
    const fechasConDatos = this.contarFechasConDatos(calendarioOrigen.fechas);

    if (fechasConDatos === 0) {
      this.toastr.warning(
        'El calendario seleccionado no tiene fechas con datos registrados'
      );
      this.cerrarModalSeleccionar();
      return;
    }

    if (!this.oidCalendario) return;

    this.guardandoFecha.set(true);

    try {
      const fechasActuales = this.fechas();
      let mapeadas = 0;

      const fechasActualizadas = fechasActuales.map((fechaActual) => {
        const fechaOrigen = calendarioOrigen.fechas!.find(
          (f) => f.oidNombreFecha === fechaActual.oidNombreFecha
        );

        // Solo copiar si la fecha origen tiene datos
        if (fechaOrigen) {
          const tieneFechaInicial =
            fechaOrigen.fechaInicial &&
            fechaOrigen.fechaInicial.toString().trim() !== '';
          const tieneFechaFin =
            fechaOrigen.fechaFin &&
            fechaOrigen.fechaFin.toString().trim() !== '';

          if (tieneFechaInicial || tieneFechaFin) {
            mapeadas++;
            return {
              ...fechaActual,
              fechaInicial: fechaOrigen.fechaInicial,
              fechaFin: fechaOrigen.fechaFin || '',
            } as Fecha;
          }
        }

        return { ...fechaActual } as Fecha;
      });

      this.fechas.set([...fechasActualizadas]);

      this.toastr.success(
        `${mapeadas} fechas mapeadas correctamente`,
        'Fechas copiadas'
      );
      this.cerrarModalSeleccionar();
    } catch (error) {
      console.error('Error al copiar fechas:', error);
      this.toastr.error('Error al copiar las fechas');
    } finally {
      this.guardandoFecha.set(false);
    }
  }

  /**
   * Cuenta las fechas que tienen al menos fechaInicial o fechaFin definidos
   */
  contarFechasConDatos(fechas: Fecha[] | undefined): number {
    if (!fechas || fechas.length === 0) return 0;

    return fechas.filter((fecha) => {
      const tieneFechaInicial =
        fecha.fechaInicial && fecha.fechaInicial.toString().trim() !== '';
      const tieneFechaFin =
        fecha.fechaFin && fecha.fechaFin.toString().trim() !== '';

      return tieneFechaInicial || tieneFechaFin;
    }).length;
  }

  formatearFecha(fecha: Fecha): string {
    return Utils.formatearFecha(
      fecha.fechaInicial,
      fecha.fechaFin,
      fecha.uniqueDate,
      fecha.oidNombreFecha
    );
  }
}
