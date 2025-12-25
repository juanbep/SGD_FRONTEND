import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  CreateNecesidadDTO,
  NecesidadResponse,
  UpdateNecesidadDTO,
} from '../../models';
import { NecesidadesService } from '../../services';
import { ToastrService } from 'ngx-toastr';
import { GRUPOS_DISPONIBLES } from '../../utils/necesidades.utils';

@Component({
  selector: 'app-modal-crear-editar-necesidad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './modal-crear-editar-necesidad.component.html',
  styleUrl: './modal-crear-editar-necesidad.component.css',
})
export class ModalCrearEditarNecesidadComponent implements OnInit, OnChanges {
  @Input() mostrar: boolean = false;
  @Input() modo: 'crear' | 'editar' = 'crear'; // Modo del modal
  @Input() necesidad: NecesidadResponse | null = null; // Necesidad a editar
  @Input() oidCalendario: number | string = '';
  @Input() nombreCalendario: string = '';
  @Output() onCerrar = new EventEmitter<void>();
  @Output() onNecesidadGuardada = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private necesidadesService = inject(NecesidadesService);
  private toastr = inject(ToastrService);

  // Formulario
  formulario!: FormGroup;
  guardando = false;

  // Dropdowns
  readonly gruposDisponibles = GRUPOS_DISPONIBLES.filter(
    (g) => g.value !== 'TODOS'
  );
  planesDisponibles: { value: number; label: string }[] = [];
  materiasDisponibles: { value: number; label: string; codigo: string }[] = [];

  // Loading states
  loadingPlanes = false;
  loadingMaterias = false;

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Cuando cambie el modo o la necesidad, recargar el formulario
    if (changes['necesidad'] || changes['modo']) {
      if (this.formulario) {
        this.cargarDatosFormulario();
      }
    }
  }

  private inicializarFormulario(): void {
    this.formulario = this.fb.group({
      oidCalendario: [this.oidCalendario],
      oidPlan: [null, Validators.required],
      idMateria: [null, Validators.required],
      grupo: [null, Validators.required],
      cupo: [
        null,
        [Validators.required, Validators.min(1), Validators.max(999)],
      ],
    });

    // Cargar datos si es modo editar
    this.cargarDatosFormulario();
  }

  private cargarDatosFormulario(): void {
    if (this.modo === 'editar' && this.necesidad) {
      console.log('Cargando datos para editar:', this.necesidad);

      // Pre-cargar el plan (del objeto materia)
      const oidPlan = this.necesidad.materia?.oidPlan;

      this.formulario.patchValue({
        oidCalendario: this.necesidad.oidCalendario,
        oidPlan: oidPlan || null,
        idMateria: this.necesidad.idMateria,
        grupo: this.necesidad.grupo,
        cupo: this.necesidad.cupo,
      });

      // TODO: Cargar planes y luego materias para que aparezcan en los dropdowns
      if (oidPlan) {
        // Simular que se carga el plan y las materias
        // Esto lo haremos cuando integremos los servicios
      }
    } else {
      // Modo crear: limpiar formulario
      this.formulario.reset({
        oidCalendario: this.oidCalendario,
        oidPlan: null,
        idMateria: null,
        grupo: null,
        cupo: null,
      });
      this.materiasDisponibles = [];
    }
  }

  // ===== MANEJO DE PLAN =====
  onPlanChange(): void {
    const oidPlan = this.formulario.get('oidPlan')?.value;

    // Resetear materia cuando cambie el plan (solo si no estamos cargando datos iniciales)
    if (this.modo === 'crear') {
      this.formulario.patchValue({ idMateria: null });
      this.materiasDisponibles = [];
    }

    if (oidPlan) {
      console.log('Plan seleccionado:', oidPlan);
      // TODO: Cargar materias del plan
    }
  }

  // ===== GUARDAR =====
  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.toastr.warning('Por favor complete todos los campos obligatorios');
      return;
    }

    if (!this.oidCalendario) {
      this.toastr.error('No se ha seleccionado un calendario');
      return;
    }

    if (this.modo === 'crear') {
      this.crearNecesidad();
    } else {
      this.editarNecesidad();
    }
  }

  private crearNecesidad(): void {
    this.guardando = true;

    const dto: CreateNecesidadDTO = {
      oidCalendario: Number(this.oidCalendario),
      idMateria: this.formulario.value.idMateria,
      grupo: this.formulario.value.grupo,
      cupo: this.formulario.value.cupo,
    };

    console.log('DTO crear:', dto);

    this.necesidadesService.createNecesidad(dto).subscribe({
      next: (response) => {
        if (response.codigo >= 200 && response.codigo < 300) {
          this.toastr.success('Necesidad creada correctamente');
          this.onNecesidadGuardada.emit();
          this.cerrar();
        } else {
          this.toastr.warning(
            response.mensaje || 'Respuesta inesperada del servidor'
          );
        }
        this.guardando = false;
      },
      error: (error) => {
        this.handleError(error, 'crear');
        this.guardando = false;
      },
    });
  }

  private editarNecesidad(): void {
    if (!this.necesidad) {
      this.toastr.error('No hay necesidad seleccionada para editar');
      return;
    }

    this.guardando = true;

    const dto: UpdateNecesidadDTO = {
      oidNecesidad: this.necesidad.oidNecesidad,
      oidCalendario: Number(this.oidCalendario),
      idMateria: this.formulario.value.idMateria,
      grupo: this.formulario.value.grupo,
      cupo: this.formulario.value.cupo,
    };

    console.log('DTO editar:', dto);

    this.necesidadesService.updateNecesidad(dto).subscribe({
      next: (response) => {
        if (response.codigo >= 200 && response.codigo < 300) {
          this.toastr.success('Necesidad actualizada correctamente');
          this.onNecesidadGuardada.emit();
          this.cerrar();
        } else {
          this.toastr.warning(
            response.mensaje || 'Respuesta inesperada del servidor'
          );
        }
        this.guardando = false;
      },
      error: (error) => {
        this.handleError(error, 'actualizar');
        this.guardando = false;
      },
    });
  }

  // ===== CERRAR MODAL =====
  cerrar(): void {
    this.formulario.reset();
    this.materiasDisponibles = [];
    this.planesDisponibles = [];
    this.onCerrar.emit();
  }

  cerrarSiClickFuera(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.cerrar();
    }
  }

  // ===== GETTERS PARA TÍTULO Y TEXTOS =====
  get tituloModal(): string {
    return this.modo === 'crear' ? 'Crear Nueva Necesidad' : 'Editar Necesidad';
  }

  get iconoTitulo(): string {
    return this.modo === 'crear' ? 'fa-plus-circle' : 'fa-edit';
  }

  get textoBotonGuardar(): string {
    if (this.guardando) {
      return this.modo === 'crear' ? 'Creando...' : 'Actualizando...';
    }
    return this.modo === 'crear' ? 'Crear' : 'Actualizar';
  }

  // ===== VALIDACIONES =====
  get planInvalido(): boolean {
    const control = this.formulario.get('oidPlan');
    return !!(control?.invalid && control?.touched);
  }

  get materiaInvalida(): boolean {
    const control = this.formulario.get('idMateria');
    return !!(control?.invalid && control?.touched);
  }

  get grupoInvalido(): boolean {
    const control = this.formulario.get('grupo');
    return !!(control?.invalid && control?.touched);
  }

  get cupoInvalido(): boolean {
    const control = this.formulario.get('cupo');
    return !!(control?.invalid && control?.touched);
  }

  // ===== MANEJO DE ERRORES =====
  private handleError(error: any, operacion: string): void {
    const codigoBackend = error?.error?.codigo || error.status || '—';
    const mensajeBackend =
      error?.error?.mensaje ||
      error?.message ||
      `Error al ${operacion} la necesidad. Intenta de nuevo.`;

    this.toastr.error(
      `Status Code: ${codigoBackend} - ${mensajeBackend}`,
      'Error'
    );
  }
}
