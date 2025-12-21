import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { EstadoPlan, Plan, UpdatePlanDto } from '../../models';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PlanService } from '../../services';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-editar-plan-modal-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './editar-plan-modal.component.html',
  styleUrl: './editar-plan-modal.component.css',
})
export class EditarPlanModalComponentComponent implements OnInit {
  @Input() plan!: Plan;
  @Output() onPlanActualizado = new EventEmitter<Plan>();
  @Output() onCancelar = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private planService = inject(PlanService);
  private toastr = inject(ToastrService);

  planForm!: FormGroup;
  loading = false;
  loadingPlanes = false;

  readonly estadosDisponibles: EstadoPlan[] = ['ACTIVO', 'INACTIVO'];
  planesDisponibles: Plan[] = [];

  readonly editableConfig = {
    numero: false,
    estado: true,
    fechaAprobacion: true,
    acuerdo: true,
    oidPlanBase: true,
  };

  ngOnInit(): void {
    this.inicializarFormulario();
    this.aplicarEditableConfig();
    this.cargarPlanesDisponibles();
  }

  inicializarFormulario(): void {
    this.planForm = this.fb.group({
      numero: [
        this.plan.numero,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(10),
        ],
      ],
      estado: [this.plan.estado, [Validators.required]],
      fechaAprobacion: [this.plan.fechaAprobacion || ''],
      acuerdo: [this.plan.acuerdo || '', [Validators.maxLength(100)]],
      oidPlanBase: [null],
    });
  }

  private aplicarEditableConfig(): void {
    if (!this.editableConfig.numero) {
      this.planForm.get('numero')?.disable();
    }
    if (!this.editableConfig.estado) {
      this.planForm.get('estado')?.disable();
    }
    if (!this.editableConfig.fechaAprobacion) {
      this.planForm.get('fechaAprobacion')?.disable();
    }
    if (!this.editableConfig.acuerdo) {
      this.planForm.get('acuerdo')?.disable();
    }
    if (!this.editableConfig.oidPlanBase) {
      this.planForm.get('oidPlanBase')?.disable();
    }
  }

  cargarPlanesDisponibles(): void {
    this.loadingPlanes = true;

    const filtros = {
      oidPrograma: this.plan.oidPrograma,
      size: 100,
    };

    this.planService.getPlanes(filtros).subscribe({
      next: (response) => {
        if (response.codigo >= 200 && response.codigo < 300) {
          this.planesDisponibles = response.data.content.filter(
            (p) => p.oidPlan !== this.plan.oidPlan
          );
        }
        this.loadingPlanes = false;
      },
      error: (error) => {
        console.error('Error al cargar planes disponibles:', error);
        this.planesDisponibles = [];
        this.loadingPlanes = false;
      },
    });
  }

  actualizarPlan(): void {
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

    const planActualizado: UpdatePlanDto = {
      oidPlan: this.plan.oidPlan,
      numero: formValue.numero.trim(),
      estado: formValue.estado,
      fechaAprobacion:
        formValue.fechaAprobacion || new Date().toISOString().split('T')[0],
      acuerdo: formValue.acuerdo?.trim() || '',
      oidPrograma: this.plan.oidPrograma,
    };

    if (formValue.oidPlanBase) {
      planActualizado.oidPlanBase = formValue.oidPlanBase;
    }

    this.planService.updatePlan(planActualizado).subscribe({
      next: (response) => {
        if (response.codigo >= 200 && response.codigo < 300) {
          this.toastr.success(
            response.mensaje || 'Plan actualizado correctamente',
            'Éxito'
          );
          this.onPlanActualizado.emit(response.data);
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
          error?.error?.mensaje ||
          error?.message ||
          'Error al actualizar el plan';
        this.toastr.error(mensajeError, 'Error');
        this.loading = false;
      },
    });
  }

  cancelar(): void {
    this.onCancelar.emit();
  }

  get numeroInvalid(): boolean {
    const control = this.planForm.get('numero');
    return !!(control?.invalid && control?.touched);
  }
}
