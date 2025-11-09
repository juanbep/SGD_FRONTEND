import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import {
  Fecha,
  Calendario,
  CreateFechaDto,
  UpdateFechaDto,
} from '../../../models';
import { ModalAgregarEditarFechaComponent } from '../../edit-academic-calendar/modal-agregar-editar-fecha/modal-agregar-editar-fecha.component';
import { ModalSeleccionarCalendarioComponent } from '../modal-seleccionar-calendario/modal-seleccionar-calendario.component';
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
  ],
  templateUrl: './step-fechas.component.html',
  styleUrl: './step-fechas.component.css',
})
export class StepFechasComponent implements OnInit, OnChanges {
  private readonly toastr = inject(ToastrService);
  private readonly calendarioHelper = inject(CalendarioHelperService);
  private readonly nombreFechaHelper = inject(NombreFechaHelperService);
  private readonly fechaHelper = inject(FechaHelperService);

  @Input() oidCalendario: number | null = null;

  // ===== SIGNALS =====
  readonly fechas = signal<Fecha[]>([]);
  readonly modalAgregarVisible = signal<boolean>(false);
  readonly modalSeleccionarVisible = signal<boolean>(false);
  readonly fechaAEditar = signal<Fecha | null>(null);
  readonly catalogoNombresFecha = signal<any[]>([]);
  readonly calendariosDisponibles = signal<Calendario[]>([]);
  readonly cargandoCalendarios = signal<boolean>(false);
  readonly cargandoFechas = signal<boolean>(false);
  readonly guardandoFecha = signal<boolean>(false);

  ngOnInit(): void {
    this.cargarCatalogoNombresFechas();
    this.cargarCalendariosDisponibles();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['oidCalendario'] && this.oidCalendario) {
      this.cargarFechas();
    }
  }

  // ===== CARGAR FECHAS DEL CALENDARIO =====
  private async cargarFechas(): Promise<void> {
    if (!this.oidCalendario) return;

    this.cargandoFechas.set(true);
    try {
      const calendario = await this.calendarioHelper.getById(
        this.oidCalendario
      );
      console.log(calendario);
      this.fechas.set(calendario?.fechas || []);
    } catch (error) {
      console.error('Error al cargar fechas:', error);
      this.toastr.error('Error al cargar las fechas');
    } finally {
      this.cargandoFechas.set(false);
    }
  }

  private async cargarCatalogoNombresFechas(): Promise<void> {
    try {
      const catalogo = await this.nombreFechaHelper.getAllForDropdown();
      this.catalogoNombresFecha.set(catalogo);
    } catch (error) {
      console.error('Error al cargar catálogo:', error);
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

  // ===== MODALES =====
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

  // ===== AGREGAR FECHA (RECIBE DTO Y GUARDA EN BACKEND) =====
  async confirmarAgregarFecha(createDto: CreateFechaDto): Promise<void> {
    if (!this.oidCalendario) {
      this.toastr.error('No se puede agregar fecha sin calendario');
      return;
    }

    this.guardandoFecha.set(true);

    try {
      // Crear fecha en el backend
      await this.fechaHelper.create(createDto);

      // Refrescar lista desde el backend
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

  // ===== EDITAR FECHA (RECIBE DTO Y ACTUALIZA EN BACKEND) =====
  async confirmarEditarFecha(updateDto: UpdateFechaDto): Promise<void> {
    this.guardandoFecha.set(true);

    try {
      // Actualizar fecha en el backend
      await this.fechaHelper.update(updateDto);

      // Refrescar lista desde el backend
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

  // ===== ELIMINAR FECHA =====
  async eliminarFecha(fecha: Fecha): Promise<void> {
    if (!confirm(`¿Estás seguro de eliminar la fecha "${fecha.nombre}"?`)) {
      return;
    }

    try {
      await this.fechaHelper.delete(fecha.oidFecha);
      this.cargarFechas(); // Refrescar lista
      this.toastr.success('Fecha eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar fecha:', error);
      this.toastr.error('Error al eliminar la fecha');
    }
  }

  // ===== COPIAR FECHAS =====
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

      // Crear NUEVAS instancias de TODOS los objetos (inmutabilidad completa)
      const fechasActualizadas = fechasActuales.map((fechaActual) => {
        const fechaOrigen = calendarioOrigen.fechas!.find(
          (f) => f.oidNombreFecha === fechaActual.oidNombreFecha
        );

        if (fechaOrigen) {
          mapeadas++;
          // Crear NUEVO objeto con todas las propiedades
          return {
            ...fechaActual, // Copiar todas las propiedades
            fechaInicial: fechaOrigen.fechaInicial,
            fechaFin: fechaOrigen.fechaFin || '',
          } as Fecha;
        }

        // Importante: Crear NUEVO objeto incluso si no cambió
        return { ...fechaActual } as Fecha;
      });

      console.log('Fechas antes:', fechasActuales);
      console.log('Fechas después:', fechasActualizadas);
      console.log('Mapeadas:', mapeadas);

      // Forzar actualización del signal con nuevo array
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
