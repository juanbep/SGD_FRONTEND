import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreatePlanDto, EstadoPlan, Plan } from '../../models';
import { PlanService } from '../../services';
import { ToastrService } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-crear-plan-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './crear-plan-modal.component.html',
  styleUrl: './crear-plan-modal.component.css',
})
export class CrearPlanModalComponent implements OnInit {
  @Input() oidPrograma!: number; // El programa al que pertenece el plan
  @Output() onPlanCreado = new EventEmitter<Plan>();
  @Output() onCancelar = new EventEmitter<void>();

  // Servicios
  private fb = inject(FormBuilder);
  private planService = inject(PlanService);
  private toastr = inject(ToastrService);

  // Formulario
  planForm!: FormGroup;

  // Estados
  loading = false;
  loadingPlanes = false;

  // Datos
  planesDisponibles: Plan[] = [];

  readonly estadosDisponibles: EstadoPlan[] = ['ACTIVO', 'INACTIVO'];

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarPlanesDisponibles();
  }

  inicializarFormulario(): void {
    this.planForm = this.fb.group({
      numero: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(10),
        ],
      ],
      estado: ['ACTIVO', [Validators.required]],
      fechaAprobacion: [''],
      acuerdo: ['', [Validators.maxLength(100)]],
      oidPlanBase: [null],
    });
  }

  cargarPlanesDisponibles(): void {
    this.loadingPlanes = true;

    // Deshabilitar el control mientras carga
    this.planForm.get('oidPlanBase')?.disable();

    const filtros = {
      oidPrograma: this.oidPrograma,
      size: 1000,
    };

    this.planService.getPlanes(filtros).subscribe({
      next: (response) => {
        if (response.codigo >= 200 && response.codigo < 300) {
          this.planesDisponibles = response.data.content;
        }
        this.loadingPlanes = false;

        // Habilitar el control cuando termine
        this.planForm.get('oidPlanBase')?.enable();
      },
      error: (error) => {
        console.error('Error al cargar planes disponibles:', error);
        this.planesDisponibles = [];
        this.loadingPlanes = false;

        // Habilitar incluso si hay error
        this.planForm.get('oidPlanBase')?.enable();
      },
    });
  }

  crearPlan(): void {
    if (this.planForm.invalid) {
      this.planForm.markAllAsTouched();
      this.toastr.warning(
        'Por favor, completa todos los campos obligatorios',
        'Formulario Incompleto'
      );
      return;
    }

    this.loading = true;

    const formValue = this.planForm.value;

    const nuevoPlan: CreatePlanDto = {
      numero: formValue.numero.trim(),
      estado: formValue.estado,
      fechaAprobacion:
        formValue.fechaAprobacion || new Date().toISOString().split('T')[0],
      acuerdo: formValue.acuerdo?.trim() || '',
      oidPrograma: this.oidPrograma,
    };

    // Si se seleccionó un plan base, agregarlo al DTO
    if (formValue.oidPlanBase) {
      nuevoPlan.oidPlanBase = formValue.oidPlanBase;
    }

    this.planService.createPlan(nuevoPlan).subscribe({
      next: (response) => {
        if (response.codigo >= 200 && response.codigo < 300) {
          this.toastr.success(
            response.mensaje || 'Plan creado correctamente',
            'Éxito'
          );
          this.onPlanCreado.emit(response.data);
        } else {
          this.toastr.warning(
            response.mensaje || 'Respuesta inesperada del servidor',
            'Advertencia'
          );
        }
        this.loading = false;
      },
      error: (error) => {
        const mensajeError =
          error?.error?.mensaje || error?.message || 'Error al crear el plan';
        this.toastr.error(mensajeError, 'Error');
        this.loading = false;
      },
    });
  }

  cancelar(): void {
    this.onCancelar.emit();
  }

  // Helpers de validación
  get numeroInvalid(): boolean {
    const control = this.planForm.get('numero');
    return !!(control?.invalid && control?.touched);
  }

  get oidPlanBaseInvalid(): boolean {
    const control = this.planForm.get('oidPlanBase');
    return !!(control?.invalid && control?.touched);
  }
}
