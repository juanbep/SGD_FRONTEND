// edit-academic-calendar.component.ts (SIMPLIFICADO)

import { Component, signal, computed, OnInit, inject } from '@angular/core';
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

  // ===== SIGNALS =====
  readonly calendario = signal<Calendario | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly modalEliminarVisible = signal<boolean>(false);
  readonly fechaAEliminar = signal<Fecha | null>(null);
  readonly modalAgregarVisible = signal<boolean>(false);
  readonly listaNombreFechas = signal<
    { value: number; label: string; tieneTemplate: boolean }[]
  >([]);
  readonly guardandoFecha = signal<boolean>(false);
  readonly cargandoListaFechas = signal<boolean>(false);
  readonly fechaAEditar = signal<Fecha | null>(null);

  // ===== COMPUTED =====
  readonly tituloCalendario = computed(() => {
    const cal = this.calendario();
    return cal
      ? `Calendario académico ${cal.anioCalendario}-${cal.numeroCalendario}`
      : 'Cargando...';
  });

  readonly fechasCalendario = computed(() => {
    const fechas = this.calendario()?.fechas || [];
    return Utils.ordenarFechasPorOid(fechas);
  });

  // ===== CONSTANTES =====

  ngOnInit(): void {
    this.cargarCalendario();
    this.cargarCatalogoNombresFechas();
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

  // ===== CARGAR NOMBRES FECHAS =====
  private async cargarCatalogoNombresFechas(): Promise<void> {
    this.cargandoListaFechas.set(true);

    try {
      const nombresFechas = await this.nombreFechaHelper.getAllForDropdown();
      // Ordenar antes de asignar al signal
      const listaOrdenada = Utils.ordenarListaNombresFecha(nombresFechas);
      this.listaNombreFechas.set(listaOrdenada);
    } catch (error) {
      console.error('Error al cargar catálogo de fechas:', error);
      this.toastr.error('Error al cargar el catálogo de tipos de fecha');
    } finally {
      this.cargandoListaFechas.set(false);
    }
  }

  // ===== ELIMINAR FECHA =====
  async confirmarEliminarFecha(): Promise<void> {
    const fecha = this.fechaAEliminar();
    if (!fecha) return;

    try {
      const resultado = await this.fechaHelper.delete(fecha.oidFecha);

      if (resultado) {
        const calendarioActual = this.calendario();
        if (calendarioActual?.fechas) {
          const fechasActualizadas = calendarioActual.fechas.filter(
            (f) => f.oidFecha !== fecha.oidFecha
          );

          this.calendario.set({
            ...calendarioActual,
            fechas: fechasActualizadas,
          });
        }

        this.toastr.success('Fecha eliminada con éxito');
        this.cerrarModalEliminar();
      }
    } catch (error: any) {
      console.log('ERROR CAPTURADO EN COMPONENTE:', error);
      this.cerrarModalEliminar();
      const mensaje = error?.error?.mensaje || 'Error al eliminar la fecha';
      this.toastr.error(mensaje);
    }
  }

  // ===== AGREGAR FECHA =====
  async confirmarAgregarFecha(createDto: CreateFechaDto): Promise<void> {
    // Prevención de doble clic
    if (this.guardandoFecha()) return;

    this.guardandoFecha.set(true);

    try {
      const nuevaFecha = await this.fechaHelper.create(createDto);

      if (nuevaFecha) {
        const calendarioActual = this.calendario();
        if (calendarioActual) {
          // Agregar la nueva fecha al array de fechas
          const fechasActualizadas = [
            ...(calendarioActual.fechas || []),
            nuevaFecha,
          ];

          this.calendario.set({
            ...calendarioActual,
            fechas: fechasActualizadas,
          });
        }

        this.toastr.success('Fecha agregada con éxito');
        this.cerrarModalAgregar();
      }
    } catch (error: any) {
      console.log('ERROR CAPTURADO EN COMPONENTE:', error);
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
        const calendarioActual = this.calendario();
        if (calendarioActual) {
          const fechasActualizadas = calendarioActual.fechas?.map((f) =>
            f.oidFecha === fechaActualizada.oidFecha ? fechaActualizada : f
          );

          this.calendario.set({
            ...calendarioActual,
            fechas: fechasActualizadas,
          });
        }

        this.toastr.success('Fecha actualizada con éxito');
        this.cerrarModalAgregar();
      }
    } catch (error: any) {
      console.log('ERROR CAPTURADO EN COMPONENTE:', error);
      const mensaje = error?.error?.mensaje || 'Error al actualizar la fecha';
      this.toastr.error(mensaje);
    } finally {
      this.guardandoFecha.set(false);
    }
  }

  // ===== HANDLER PARA ACTUALIZACIÓN CALENDARIO DESDE COMPONENTE HIJO =====
  onCalendarioActualizado(calendarioActualizado: Calendario): void {
    this.calendario.set(calendarioActualizado);
  }

  // ===== MÉTODOS DE UTILIDAD =====
  readonly formatoFecha = (fecha: Fecha): string => {
    return Utils.formatearFecha(
      fecha.fechaInicial,
      fecha.fechaFin,
      fecha.uniqueDate,
      fecha.oidNombreFecha
    );
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
