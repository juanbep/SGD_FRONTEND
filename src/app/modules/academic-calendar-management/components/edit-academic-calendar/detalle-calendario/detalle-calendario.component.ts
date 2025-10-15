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

@Component({
  selector: 'app-detalle-calendario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

  // ===== FORMULARIO =====
  calendarioForm!: FormGroup;
  private backupCalendario: Calendario | null = null;

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  private inicializarFormulario(): void {
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

  // ===== MODO EDICIÓN =====
  activarModoEdicion(): void {
    if (!this.calendario) return;

    // Guardar backup
    this.backupCalendario = structuredClone(this.calendario);

    // Cargar valores en el formulario
    this.calendarioForm.patchValue({
      semanasClase: this.calendario.semanasClase,
      semanasPreparacion: this.calendario.semanasPreparacion,
      horasPlanta: this.calendario.horasPlanta,
      horasCatedra: this.calendario.horasCatedra,
      horasOcasionales: this.calendario.horasOcasionales,
      horasBecarioPracticante: this.calendario.horasBecarioPracticante,
      estado: this.calendario.estado,
      observacion: this.calendario.observacion || '',
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

    // Prevención de doble clic
    if (this.guardando()) return;

    this.guardando.set(true);

    const formValues = this.calendarioForm.value;

    const updateDto: UpdateCalendarioDTO = {
      oidcalendario: this.calendario.oidcalendario,
      anioCalendario: this.calendario.anioCalendario,
      numeroCalendario: this.calendario.numeroCalendario,
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
          // Preservar las fechas del calendario original
          const calendarioActualizado = {
            ...response.data,
            fechas: this.calendario?.fechas || [],
          };

          // Emitir el calendario actualizado al componente padre
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
