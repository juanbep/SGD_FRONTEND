import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  CalendarioService,
  FechaHelperService,
  FechasService,
  NombresFechasService,
} from '../../../services';
import {
  Calendario,
  EstadoCalendario,
  Fecha,
  NombreFecha,
  UpdateCalendarioDTO,
} from '../../../models';

@Component({
  selector: 'app-edit-academic-calendar',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './edit-academic-calendar.component.html',
  styleUrl: './edit-academic-calendar.component.css',
})
export class EditAcademicCalendarComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly calendarioService = inject(CalendarioService);
  private readonly fechaService = inject(FechasService);
  private readonly fechaHelper = inject(FechaHelperService);
  private readonly nombreFechaService = inject(NombresFechasService);

  readonly calendario = signal<Calendario | null>(null);
  readonly catalogoNombresFecha = signal<NombreFecha[]>([]);

  // ===== ESTADOS UI =====
  readonly isLoading = signal<boolean>(false);
  readonly modoEdicionCalendario = signal<boolean>(false);
  readonly mostrarFormularioNuevaFecha = signal<boolean>(false);
  readonly filaEnEdicionId = signal<number | null>(null);

  readonly tituloCalendario = computed(() => {
    const cal = this.calendario();
    return cal
      ? `Calendario académico ${cal.anioCalendario}-${cal.numeroCalendario}`
      : 'Cargando...';
  });

  readonly fechasCalendario = computed(() => this.calendario()?.fechas || []);

  // ===== CONSTANTES =====
  readonly ESTADOS_DISPONIBLES: EstadoCalendario[] = [
    'ACTIVO',
    'APROBADO',
    'PENDIENTE',
    'DESHABILITADO',
  ];

  readonly OIDS_FECHA_UNICA = [1, 3, 4, 5, 7, 8, 9, 10];

  // ===== FORMULARIOS REACTIVOS =====
  calendarioForm!: FormGroup;
  nuevaFechaForm!: FormGroup;

  // ===== BACKUPS PARA CANCELAR EDICIÓN =====
  private backupCalendario: Calendario | null = null;
  private backupFecha: Fecha | null = null;

  ngOnInit(): void {
    this.inicializarFormularios();
    this.cargarCalendario();
  }

  private inicializarFormularios(): void {
    // Formulario para editar calendario
    this.calendarioForm = this.fb.group({
      semanasClase: [null, [Validators.min(0)]],
      semanasPreparacion: [null, [Validators.min(0)]],
      horasPlanta: [null, [Validators.min(0)]],
      horasCatedra: [null, [Validators.min(0)]],
      horasOcasionales: [null, [Validators.min(0)]],
      horasBecarioPracticante: [null, [Validators.min(0)]],
      estado: ['', Validators.required],
      observacion: [''],
    });
  }

  // ===== MANEJO DE ERRORES =====
  private obtenerMensajeError(error: any): string {
    // Tu backend siempre devuelve BaseResponse con mensaje
    // En errores HTTP, viene en error.error.mensaje
    return error?.error?.mensaje || 'Ocurrió un error inesperado';
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
          // Opcional: mostrar mensaje de éxito del backend
          // this.toastr.success(response.mensaje);
        } else {
          // Mensaje específico del backend
          const mensaje = response.mensaje || 'No se pudo cargar el calendario';
          this.toastr.error(mensaje);
          this.router.navigate(['/app/gestion-calendario-academico']);
        }
      },
      error: (error) => {
        console.error('Error al cargar calendario:', error);
        const mensajeError = this.obtenerMensajeError(error);
        this.toastr.error(mensajeError);
        this.router.navigate(['/app/gestion-calendario-academico']);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  // ===== EDICIÓN DE CALENDARIO =====
  activarModoEdicion(): void {
    const cal = this.calendario();
    if (!cal) return;

    // Guardar backup para poder cancelar
    this.backupCalendario = structuredClone(cal);

    // Cargar valores actuales en el formulario
    this.calendarioForm.patchValue({
      semanasClase: cal.semanasClase,
      semanasPreparacion: cal.semanasPreparacion,
      horasPlanta: cal.horasPlanta,
      horasCatedra: cal.horasCatedra,
      horasOcasionales: cal.horasOcasionales,
      horasBecarioPracticante: cal.horasBecarioPracticante,
      estado: cal.estado,
      observacion: cal.observacion || '',
    });

    // Activar modo edición
    this.modoEdicionCalendario.set(true);
  }

  cancelarEdicionCalendario(): void {
    if (this.backupCalendario) {
      // Restaurar desde el backup
      this.calendario.set(this.backupCalendario);
      this.backupCalendario = null;
    }

    // Resetear formulario
    this.calendarioForm.reset();

    // Desactivar modo edición
    this.modoEdicionCalendario.set(false);
  }

  guardarCambiosCalendario(): void {
    const cal = this.calendario();

    if (!cal) {
      this.toastr.error('No hay datos del calendario cargados');
      return;
    }

    if (this.calendarioForm.invalid) {
      this.toastr.warning('Por favor, completa todos los campos obligatorios');
      return;
    }

    // Construir el DTO con los valores del formulario
    const formValues = this.calendarioForm.value;

    const updateDto: UpdateCalendarioDTO = {
      oidcalendario: cal.oidcalendario,
      anioCalendario: cal.anioCalendario,
      numeroCalendario: cal.numeroCalendario,
      semanasClase: formValues.semanasClase,
      semanasPreparacion: formValues.semanasPreparacion,
      horasPlanta: formValues.horasPlanta,
      horasCatedra: formValues.horasCatedra,
      horasOcasionales: formValues.horasOcasionales,
      horasBecarioPracticante: formValues.horasBecarioPracticante,
      estado: formValues.estado,
      observacion: formValues.observacion || '',
    };

    this.calendarioService.updateCalendarioAcademico(updateDto).subscribe({
      next: (response) => {
        if (response.codigo === 200 && response.data) {
          // Actualizar el signal con los nuevos datos
          this.calendario.set(response.data);

          // Mensaje del backend
          const mensaje =
            response.mensaje || 'Calendario actualizado con éxito';
          this.toastr.success(mensaje);

          // Desactivar modo edición
          this.modoEdicionCalendario.set(false);
          this.backupCalendario = null;
          this.calendarioForm.reset();
        } else {

          const mensaje =
            response.mensaje || 'Error al actualizar el calendario';
          this.toastr.error(mensaje);
        }
      },
      error: (error) => {
        console.error('Error al actualizar calendario:', error);
        const mensajeError = this.obtenerMensajeError(error);
        this.toastr.error(mensajeError);
      },
    });
  }

  // ===== CRUD FECHAS =====
  async eliminarFecha(oidFecha: number): Promise<void> {
    if (!oidFecha) {
      this.toastr.warning('ID de fecha no válido');
      return;
    }

    const confirmar = confirm(
      '¿Estás seguro de que deseas eliminar esta fecha?'
    );
    if (!confirmar) return;

    try {
  
      const resultado = await this.fechaHelper.delete(oidFecha);

      if (resultado) {

        const calendarioActual = this.calendario();
        if (calendarioActual?.fechas) {
          const fechasActualizadas = calendarioActual.fechas.filter(
            (fecha) => fecha.oidFecha !== oidFecha
          );

          this.calendario.set({
            ...calendarioActual,
            fechas: fechasActualizadas,
          });
        }

        this.toastr.success('Fecha eliminada con éxito');
      }
    } catch (error: any) {
      console.log('ERROR CAPTURADO EN COMPONENTE:', error);
      const mensaje = error?.error?.mensaje || 'Error al eliminar la fecha';
      this.toastr.error(mensaje);
    }
  }
}
