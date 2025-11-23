import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CalendarioService } from '../../../services';
import {
  Calendario,
  EstadoCalendario,
  UpdateCalendarioDTO,
} from '../../../models';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-detalle-calendario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './detalle-calendario.component.html',
  styleUrl: './detalle-calendario.component.css',
})
export class DetalleCalendarioComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly calendarioService = inject(CalendarioService);

  // ===== INPUTS/OUTPUTS =====
  @Input() calendario: Calendario | null = null;
  @Output() calendarioActualizado = new EventEmitter<Calendario>();

  // ===== SIGNALS =====
  readonly modoEdicion = signal<boolean>(false);
  readonly guardando = signal<boolean>(false);

  // ===== CONSTANTES =====
  readonly ESTADOS_DISPONIBLES: EstadoCalendario[] = [
    'ACTIVO',
    'APROBADO',
    'PENDIENTE',
    'DESHABILITADO',
  ];

  // Configuración completa de campos editables
  readonly CAMPOS_EDITABLES = {
    anioCalendario: false, // Año
    numeroCalendario: false, // Periodo
    estado: true, // Estado
    semanasClase: false, // Semanas clase
    semanasPreparacion: false, // Semanas preparación
    horasPlanta: false, // Horas Planta
    horasCatedra: false, // Horas Cátedra
    horasOcasionales: false, // Horas Ocasionales
    horasBecarioPracticante: false, // Horas Becario/Practicante
    observacion: true, // Observación
  };

  // ===== FORMULARIO =====
  calendarioForm!: FormGroup;
  private backupCalendario: Calendario | null = null;

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  private inicializarFormulario(): void {
    this.calendarioForm = this.fb.group({
      anioCalendario: [null, [Validators.required, Validators.min(2000)]],
      numeroCalendario: [null, [Validators.required, Validators.min(1)]],
      semanasClase: [null, [Validators.min(0)]],
      semanasPreparacion: [null, [Validators.min(0)]],
      horasPlanta: [null, [Validators.min(0)]],
      horasCatedra: [null, [Validators.min(0)]],
      horasOcasionales: [null, [Validators.min(0)]],
      horasBecarioPracticante: [null, [Validators.min(0)]],
      estado: ['', Validators.required],
      observacion: [''],
      fechaCreacion: [''],
      fechaActualizacion: [''],
    });
  }

  // ===== HELPERS =====
  esCampoEditable(campo: keyof typeof this.CAMPOS_EDITABLES): boolean {
    return this.CAMPOS_EDITABLES[campo] && this.modoEdicion();
  }

  // ===== MODO EDICIÓN =====
  activarModoEdicion(): void {
    if (!this.calendario) return;

    // Guardar backup
    this.backupCalendario = structuredClone(this.calendario);

    // Cargar valores en el formulario
    this.calendarioForm.patchValue({
      anioCalendario: this.calendario.anioCalendario,
      numeroCalendario: this.calendario.numeroCalendario,
      semanasClase: this.calendario.semanasClase,
      semanasPreparacion: this.calendario.semanasPreparacion,
      horasPlanta: this.calendario.horasPlanta,
      horasCatedra: this.calendario.horasCatedra,
      horasOcasionales: this.calendario.horasOcasionales,
      horasBecarioPracticante: this.calendario.horasBecarioPracticante,
      estado: this.calendario.estado,
      observacion: this.calendario.observacion || '',
      fechaCreacion: this.calendario.fechaCreacion,
      fechaActualizacion: this.calendario.fechaActualizacion,
    });

    this.modoEdicion.set(true);
  }

  cancelarEdicion(): void {
    this.calendarioForm.reset();
    this.modoEdicion.set(false);
    this.backupCalendario = null;
  }

  guardarCambios(): void {
    if (!this.calendario) {
      this.toastr.error('No hay datos del calendario cargados');
      return;
    }

    if (this.calendarioForm.invalid) {
      this.toastr.warning('Por favor, completa todos los campos obligatorios');
      return;
    }

    if (this.guardando()) return;

    this.guardando.set(true);

    const formValues = this.calendarioForm.value;

    // Construir DTO con todos los campos editables
    const updateDto: UpdateCalendarioDTO = {
      oidcalendario: this.calendario.oidcalendario,
      // Incluir campos base o desde formulario si son editables
      anioCalendario: this.CAMPOS_EDITABLES.anioCalendario
        ? formValues.anioCalendario
        : this.calendario.anioCalendario,
      numeroCalendario: this.CAMPOS_EDITABLES.numeroCalendario
        ? formValues.numeroCalendario
        : this.calendario.numeroCalendario,
      ...(this.CAMPOS_EDITABLES.semanasClase && {
        semanasClase: formValues.semanasClase,
      }),
      ...(this.CAMPOS_EDITABLES.semanasPreparacion && {
        semanasPreparacion: formValues.semanasPreparacion,
      }),
      ...(this.CAMPOS_EDITABLES.horasPlanta && {
        horasPlanta: formValues.horasPlanta,
      }),
      ...(this.CAMPOS_EDITABLES.horasCatedra && {
        horasCatedra: formValues.horasCatedra,
      }),
      ...(this.CAMPOS_EDITABLES.horasOcasionales && {
        horasOcasionales: formValues.horasOcasionales,
      }),
      ...(this.CAMPOS_EDITABLES.horasBecarioPracticante && {
        horasBecarioPracticante: formValues.horasBecarioPracticante,
      }),
      ...(this.CAMPOS_EDITABLES.estado && { estado: formValues.estado }),
      ...(this.CAMPOS_EDITABLES.observacion && {
        observacion: formValues.observacion || '',
      }),
    };

    this.calendarioService.updateCalendarioAcademico(updateDto).subscribe({
      next: (response) => {
        if (response.codigo === 200 && response.data) {
          const calendarioActualizado = {
            ...response.data,
            fechas: this.calendario?.fechas || [],
          };

          this.calendarioActualizado.emit(calendarioActualizado);

          const mensaje =
            response.mensaje || 'Calendario actualizado con éxito';
          this.toastr.success(mensaje);

          this.modoEdicion.set(false);
          this.backupCalendario = null;
          this.calendarioForm.reset();
        } else {
          const mensaje =
            response.mensaje || 'Error al actualizar el calendario';
          this.toastr.error(mensaje);
        }

        this.guardando.set(false);
      },
      error: (error) => {
        console.error('Error al actualizar calendario:', error);
        const mensajeError =
          error?.error?.mensaje || 'Ocurrió un error inesperado';
        this.toastr.error(mensajeError);
        this.guardando.set(false);
      },
    });
  }
}
