import {
  Component,
  signal,
  computed,
  OnInit,
  inject,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import {
  CalendarioService,
  FechaHelperService,
  NombreFechaHelperService,
} from '../../services';
import {
  Calendario,
  CreateFechaDto,
  CreateNombreFechaDto,
  Fecha,
  UpdateFechaDto,
} from '../../models';
import { ModalEliminarFechaComponent } from './modal-eliminar-fecha/modal-eliminar-fecha.component';
import { DetalleCalendarioComponent } from './detalle-calendario/detalle-calendario.component';
import { Utils } from '../../utils/calendario.utils';
import { ModalAgregarEditarFechaComponent } from './modal-agregar-editar-fecha/modal-agregar-editar-fecha.component';

@Component({
  selector: 'app-edit-academic-calendar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ModalEliminarFechaComponent,
    ModalAgregarEditarFechaComponent,
    DetalleCalendarioComponent,
  ],
  templateUrl: './edit-academic-calendar.component.html',
  styleUrl: './edit-academic-calendar.component.css',
})
export class EditAcademicCalendarComponent implements OnInit {
  // ===== SERVICES =====
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly calendarioService = inject(CalendarioService);
  private readonly fechaHelper = inject(FechaHelperService);
  private readonly nombreFechaHelper = inject(NombreFechaHelperService);

  @ViewChild(ModalAgregarEditarFechaComponent)
  modalAgregarEditarRef!: ModalAgregarEditarFechaComponent;

  // OIDs de nombres de fechas que NO se pueden eliminar
  private readonly FECHAS_NO_ELIMINABLES = [1, 3, 7, 10, 26, 27, 28];

  // ===== SIGNALS =====
  readonly calendario = signal<Calendario | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly modalEliminarVisible = signal<boolean>(false);
  readonly fechaAEliminar = signal<Fecha | null>(null);
  readonly modalAgregarVisible = signal<boolean>(false);
  readonly guardandoFecha = signal<boolean>(false);
  readonly cargandoListaFechas = signal<boolean>(false);
  readonly fechaAEditar = signal<Fecha | null>(null);

  // ===== COMPUTED =====
  readonly tituloCalendario = computed(() => {
    const cal = this.calendario();
    return cal
      ? `Editar Calendario académico ${cal.anioCalendario}-${cal.numeroCalendario}`
      : 'Cargando...';
  });

  readonly fechasCalendario = computed(() => {
    const fechas = this.calendario()?.fechas || [];
    return fechas;
    //return Utils.ordenarFechasPorOid(fechas); //No ordenar las fechas, estas se ordenan automáticamente
  });

  // ===== CONSTANTES =====

  ngOnInit(): void {
    this.cargarCalendario();
  }

  // ===== CARGA DE DATOS =====
  private cargarCalendario(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id || isNaN(+id)) {
      this.toastr.error('ID de calendario inválido');
      this.router.navigate(['/app/gestion-calendario-academico']);
      return;
    }

    this.isLoading.set(true);

    this.calendarioService.getCalendarioAcademicoById(+id).subscribe({
      next: (response) => {
        if (response.codigo === 200 && response.data) {
          this.calendario.set(response.data);
        } else {
          const mensaje = response.mensaje || 'No se pudo cargar el calendario';
          this.toastr.error(mensaje);
          this.router.navigate(['/app/gestion-calendario-academico']);
        }
      },
      error: (error) => {
        console.error('Error al cargar calendario:', error);
        const mensajeError =
          error?.error?.mensaje || 'Ocurrió un error inesperado';
        this.toastr.error(mensajeError);
        this.router.navigate(['/app/gestion-calendario-academico']);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  // ===== AGREGAR FECHA =====
  async confirmarAgregarFecha(createDto: CreateFechaDto): Promise<void> {
    if (this.guardandoFecha()) return;

    this.guardandoFecha.set(true);

    try {
      const nuevaFecha = await this.fechaHelper.create(createDto);

      if (nuevaFecha) {
        this.toastr.success('Fecha agregada con éxito');
        this.cerrarModalAgregar();

        this.recargarFechasCalendario();
      }
    } catch (error: any) {
      const mensaje = error?.error?.mensaje || 'Error al agregar la fecha';
      this.toastr.error(mensaje);
    } finally {
      this.guardandoFecha.set(false);
    }
  }

  // ===== ACTUALIZAR FECHA =====
  async confirmarEditarFecha(updateDto: UpdateFechaDto): Promise<void> {
    if (this.guardandoFecha()) return;

    this.guardandoFecha.set(true);

    try {
      const fechaActualizada = await this.fechaHelper.update(updateDto);

      if (fechaActualizada) {
        this.toastr.success('Fecha actualizada con éxito');
        this.cerrarModalAgregar();

        this.recargarFechasCalendario();
      }
    } catch (error: any) {
      const mensaje = error?.error?.mensaje || 'Error al actualizar la fecha';
      this.toastr.error(mensaje);
    } finally {
      this.guardandoFecha.set(false);
    }
  }

  // ===== ELIMINAR FECHA =====
  async confirmarEliminarFecha(): Promise<void> {
    const fecha = this.fechaAEliminar();
    if (!fecha) return;

    try {
      const resultado = await this.fechaHelper.delete(fecha.oidFecha);

      if (resultado) {
        this.toastr.success('Fecha eliminada con éxito');
        this.cerrarModalEliminar();

        this.recargarFechasCalendario();
      }
    } catch (error: any) {
      this.cerrarModalEliminar();
      const mensaje = error?.error?.mensaje || 'Error al eliminar la fecha';
      this.toastr.error(mensaje);
    }
  }

  private recargarFechasCalendario(): void {
    const calendarioActual = this.calendario();
    if (!calendarioActual?.oidcalendario) return;

    this.cargandoListaFechas.set(true);

    this.calendarioService
      .getCalendarioAcademicoById(calendarioActual.oidcalendario)
      .subscribe({
        next: (response) => {
          if (response.codigo === 200 && response.data) {
            // Actualizar solo las fechas, mantener el resto del calendario
            this.calendario.set({
              ...calendarioActual,
              fechas: response.data.fechas || [],
            });
          }
        },
        error: (error) => {
          console.error('Error al recargar fechas:', error);
          const mensaje =
            error?.error?.mensaje || 'Error al recargar las fechas';
          this.toastr.warning(mensaje);
        },
        complete: () => this.cargandoListaFechas.set(false),
      });
  }

  // ===== HANDLER PARA ACTUALIZACIÓN CALENDARIO DESDE COMPONENTE HIJO =====
  onCalendarioActualizado(calendarioActualizado: Calendario): void {
    this.calendario.set(calendarioActualizado);
  }

  // ===== HANDLER PARA CREAR UN FECHA DE CALENDARIO DESDE COMPONENTE HIJO =====

  async handleCrearNombreFecha(dto: CreateNombreFechaDto): Promise<void> {
    this.guardandoFecha.set(true);

    try {
      const nuevoNombre = await this.nombreFechaHelper.create(dto);

      if (nuevoNombre) {
        this.toastr.success('Tipo de fecha creado correctamente');

        // Recargar catálogo en el componente hijo
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

  // ===== MÉTODOS DE UTILIDAD =====
  readonly formatoFecha = (fecha: Fecha): string => {
    return Utils.formatearFecha(
      fecha.fechaInicial,
      fecha.fechaFin,
      fecha.uniqueDate,
      fecha.oidNombreFecha,
    );
  };

  readonly esFechaEliminable = (fecha: Fecha): boolean => {
    return !this.FECHAS_NO_ELIMINABLES.includes(fecha.oidNombreFecha);
  };

  // ===== CONTROL DE MODALES =====

  // ===== MODAL ELIMINAR FECHA =====
  abrirModalEliminar(fecha: Fecha): void {
    this.fechaAEliminar.set(fecha);
    this.modalEliminarVisible.set(true);
  }

  cerrarModalEliminar(): void {
    this.modalEliminarVisible.set(false);
    this.fechaAEliminar.set(null);
  }

  // ===== MODAL AGREGAR FECHA =====
  abrirModalAgregar(): void {
    this.fechaAEditar.set(null); // Asegurar que está en modo crear
    this.modalAgregarVisible.set(true);
  }

  cerrarModalAgregar(): void {
    this.modalAgregarVisible.set(false);
    this.fechaAEditar.set(null);
    this.guardandoFecha.set(false);
  }

  // ===== MODAL EDITAR FECHA =====
  abrirModalEditar(fecha: Fecha): void {
    this.fechaAEditar.set(fecha);
    this.modalAgregarVisible.set(true);
  }
}
