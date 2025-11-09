import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CreateFechaDto, Fecha, Calendario } from '../../../models';
import { ModalAgregarEditarFechaComponent } from '../../edit-academic-calendar/modal-agregar-editar-fecha/modal-agregar-editar-fecha.component';
import { ModalSeleccionarCalendarioComponent } from '../modal-seleccionar-calendario/modal-seleccionar-calendario.component';
import {
  CalendarioHelperService,
  NombreFechaHelperService,
} from '../../../services';
import { Utils } from '../../../utils/calendario.utils';

export interface FechaLocal extends CreateFechaDto {
  id: string;
  nombre?: string;
}

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
export class StepFechasComponent implements OnInit {
  private readonly toastr = inject(ToastrService);
  private readonly nombreFechaHelper = inject(NombreFechaHelperService);
  private readonly calendarioHelper = inject(CalendarioHelperService);

  @Input() fechasIniciales: CreateFechaDto[] = [];
  @Output() cambioFechas = new EventEmitter<CreateFechaDto[]>();
  @Output() formularioValido = new EventEmitter<boolean>();

  // ===== SIGNALS =====
  readonly fechasLocales = signal<Fecha[]>([]);
  readonly modalAgregarVisible = signal<boolean>(false);
  readonly modalSeleccionarVisible = signal<boolean>(false);
  readonly fechaAEditar = signal<Fecha | null>(null);
  readonly catalogoNombresFecha = signal<
    {
      value: number;
      label: string;
      tieneTemplate: boolean;
      uniqueDate: boolean;
    }[]
  >([]);
  readonly calendariosDisponibles = signal<Calendario[]>([]);
  readonly cargandoCalendarios = signal<boolean>(false);
  readonly guardandoFecha = signal<boolean>(false);

  ngOnInit(): void {
    this.cargarCatalogoNombresFechas().then(() => {
      this.actualizarNombresFechas();
    });
    this.cargarCalendariosDisponibles();
    this.cargarFechasIniciales();

    // ✅ Emitir siempre true (sin validación obligatoria)
    this.formularioValido.emit(true);
  }

  private async cargarCatalogoNombresFechas(): Promise<void> {
    try {
      const catalogo = await this.nombreFechaHelper.getAllForDropdown();
      this.catalogoNombresFecha.set(catalogo);
    } catch (error) {
      console.error('Error al cargar catálogo:', error);
      this.toastr.error('Error al cargar el catálogo de tipos de fecha');
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
      this.toastr.error('Error al cargar calendarios disponibles');
    } finally {
      this.cargandoCalendarios.set(false);
    }
  }

  private actualizarNombresFechas(): void {
    const fechasActualizadas = this.fechasLocales().map((f) => ({
      ...f,
      nombre: this.obtenerNombreFecha(f.oidNombreFecha),
    }));

    this.fechasLocales.set(fechasActualizadas);
  }

  private cargarFechasIniciales(): void {
    if (this.fechasIniciales.length > 0) {
      const fechasComoModelo = this.fechasIniciales.map((f) =>
        this.convertirCreateDtoAFecha(f)
      );
      this.fechasLocales.set(fechasComoModelo);
      this.emitirCambios();
    }
  }

  private convertirCreateDtoAFecha(dto: CreateFechaDto): Fecha {
    return {
      oidFecha: this.generarOidTemporal(),
      oidNombreFecha: dto.oidNombreFecha,
      nombre: this.obtenerNombreFecha(dto.oidNombreFecha),
      uniqueDate: dto.uniqueDate,
      fechaInicial: dto.fechaInicial,
      fechaFin: dto.fechaFin || '',
      tipo: 'NO_RESALTADAS',
      oidCalendario: 0,
      nombreCalendario: '',
    };
  }

  private generarOidTemporal(): number {
    return -(Date.now() + Math.floor(Math.random() * 1000));
  }

  private obtenerNombreFecha(oidNombreFecha: number): string {
    const item = this.catalogoNombresFecha().find(
      (c) => c.value === oidNombreFecha
    );
    return item?.label || 'Desconocido';
  }

  // ===== MODAL AGREGAR/EDITAR =====
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

  confirmarAgregarFecha(createDto: CreateFechaDto): void {
    const nuevaFecha = this.convertirCreateDtoAFecha(createDto);
    this.fechasLocales.update((fechas) => [...fechas, nuevaFecha]);
    this.emitirCambios();
    this.toastr.success('Fecha agregada correctamente');
    this.cerrarModalAgregar();
  }

  confirmarEditarFecha(updateDto: any): void {
    const fechaEditada = this.fechaAEditar();
    if (!fechaEditada) return;

    const fechaActualizada: Fecha = {
      ...fechaEditada,
      oidNombreFecha: updateDto.oidNombreFecha,
      nombre: this.obtenerNombreFecha(updateDto.oidNombreFecha),
      fechaInicial: updateDto.fechaInicial,
      fechaFin: updateDto.fechaFin || '',
    };

    this.fechasLocales.update((fechas) =>
      fechas.map((f) =>
        f.oidFecha === fechaEditada.oidFecha ? fechaActualizada : f
      )
    );
    this.emitirCambios();
    this.toastr.success('Fecha actualizada correctamente');
    this.cerrarModalAgregar();
  }

  // ✅ ELIMINADA VALIDACIÓN: Ahora se puede eliminar cualquier fecha
  eliminarFecha(fecha: Fecha): void {
    if (confirm(`¿Estás seguro de eliminar la fecha "${fecha.nombre}"?`)) {
      this.fechasLocales.update((fechas) =>
        fechas.filter((f) => f.oidFecha !== fecha.oidFecha)
      );
      this.emitirCambios();
      this.toastr.success('Fecha eliminada correctamente');
    }
  }

  // ===== COPIAR FECHAS =====
  abrirModalSeleccionar(): void {
    this.modalSeleccionarVisible.set(true);
  }

  cerrarModalSeleccionar(): void {
    this.modalSeleccionarVisible.set(false);
  }

  async copiarFechas(calendario: Calendario): Promise<void> {
    if (!calendario.fechas || calendario.fechas.length === 0) {
      this.toastr.warning(
        'El calendario seleccionado no tiene fechas registradas'
      );
      this.cerrarModalSeleccionar();
      return;
    }

    const fechasCopiadas: Fecha[] = calendario.fechas.map((f: Fecha) => ({
      ...f,
      oidFecha: this.generarOidTemporal(),
      oidCalendario: 0,
      nombreCalendario: '',
    }));

    this.fechasLocales.set(fechasCopiadas);
    this.emitirCambios();
    this.toastr.success(
      `${fechasCopiadas.length} fechas copiadas correctamente`,
      'Fechas copiadas'
    );
    this.cerrarModalSeleccionar();
  }

  private emitirCambios(): void {
    const fechasParaEmitir: CreateFechaDto[] = this.fechasLocales().map(
      (f) => ({
        oidCalendario: f.oidCalendario,
        oidNombreFecha: f.oidNombreFecha,
        uniqueDate: f.uniqueDate,
        fechaInicial: f.fechaInicial,
        fechaFin: f.fechaFin || null,
        tipo: f.tipo,
      })
    );
    this.cambioFechas.emit(fechasParaEmitir);
  }

  // ===== HELPERS =====
  formatearFecha(fecha: Fecha): string {
    return Utils.formatearFecha(
      fecha.fechaInicial,
      fecha.fechaFin,
      fecha.uniqueDate,
      fecha.oidNombreFecha
    );
  }

  marcarTodoComoTocado(): void {
    // No hay campos que tocar
  }

  // ✅ VALIDACIÓN ELIMINADA: Siempre válido
  esValido(): boolean {
    return true;
  }
}
