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
      console.log(calendario);

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
      const ordenados = calendarios.sort((a, b) => {
        if (a.anioCalendario !== b.anioCalendario) {
          return b.anioCalendario - a.anioCalendario;
        }
        return b.numeroCalendario - a.numeroCalendario;
      });
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
      await this.fechaHelper.create(createDto);
      await this.cargarFechas();
      this.toastr.success('Fecha agregada correctamente');
      this.cerrarModalAgregar();
    } catch (error) {
      console.error('Error al agregar fecha:', error);
      this.toastr.error('Error al agregar la fecha');
    } finally {
      this.guardandoFecha.set(false);
    }
  }

  async confirmarEditarFecha(updateDto: UpdateFechaDto): Promise<void> {
    this.guardandoFecha.set(true);

    try {
      await this.fechaHelper.update(updateDto);
      await this.cargarFechas();
      this.toastr.success('Fecha actualizada correctamente');
      this.cerrarModalAgregar();
    } catch (error) {
      console.error('Error al actualizar fecha:', error);
      this.toastr.error('Error al actualizar la fecha');
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
      console.log('ERROR CAPTURADO EN COMPONENTE:', error);
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
    if (!calendarioOrigen.fechas || calendarioOrigen.fechas.length === 0) {
      this.toastr.warning(
        'El calendario seleccionado no tiene fechas registradas'
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

        if (fechaOrigen) {
          mapeadas++;
          return {
            ...fechaActual,
            fechaInicial: fechaOrigen.fechaInicial,
            fechaFin: fechaOrigen.fechaFin || '',
          } as Fecha;
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

  formatearFecha(fecha: Fecha): string {
    return Utils.formatearFecha(
      fecha.fechaInicial,
      fecha.fechaFin,
      fecha.uniqueDate,
      fecha.oidNombreFecha
    );
  }
}
