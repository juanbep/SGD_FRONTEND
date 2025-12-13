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
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { DepartamentoHelperService } from '../../../services';

@Component({
  selector: 'app-crear-materia-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './crear-materia-modal.component.html',
  styleUrl: './crear-materia-modal.component.css',
})
export class CrearMateriaModalComponent implements OnInit {
  @Input() oidPlan!: number;
  @Input() numeroPlan?: string;
  @Output() onMateriaCreada = new EventEmitter<void>();
  @Output() onCancelar = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private departamentoHelper = inject(DepartamentoHelperService);

  materiaForm!: FormGroup;
  guardando = false;

  // Semestres disponibles (1-10)
  semestresDisponibles: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Departamentos
  departamentos: { value: number; label: string; facultad: string }[] = [];
  loadingDepartamentos = false;

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarDepartamentos();
  }

  inicializarFormulario(): void {
    this.materiaForm = this.fb.group({
      oidMateria: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      codigo: ['', [Validators.required, Validators.maxLength(50)]],
      nombre: ['', [Validators.required, Validators.maxLength(200)]],
      semestre: [null, [Validators.required]],
      horasSemana: [
        '',
        [Validators.required, Validators.pattern(/^\d+$/), Validators.min(1)],
      ],
      oidDepartamento: [null, [Validators.required]], // Agregado
    });
  }

  async cargarDepartamentos(): Promise<void> {
    this.loadingDepartamentos = true;
    try {
      this.departamentos = await this.departamentoHelper.getAllForDropdown();

      if (this.departamentos.length === 0) {
        this.toastr.warning(
          'No se encontraron departamentos disponibles',
          'Sin departamentos'
        );
      }
    } catch (error) {
      console.error('Error al cargar departamentos:', error);
      this.toastr.error('No se pudieron cargar los departamentos', 'Error');
      this.departamentos = [];
    } finally {
      this.loadingDepartamentos = false;
    }
  }

  // Getters para validaciones
  get oidMateriaInvalid(): boolean {
    const control = this.materiaForm.get('oidMateria');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get codigoInvalid(): boolean {
    const control = this.materiaForm.get('codigo');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get nombreInvalid(): boolean {
    const control = this.materiaForm.get('nombre');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get semestreInvalid(): boolean {
    const control = this.materiaForm.get('semestre');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get horasSemanaInvalid(): boolean {
    const control = this.materiaForm.get('horasSemana');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get departamentoInvalid(): boolean {
    const control = this.materiaForm.get('oidDepartamento');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  guardar(): void {
    // Marcar todos los campos como touched para mostrar errores
    Object.keys(this.materiaForm.controls).forEach((key) => {
      this.materiaForm.get(key)?.markAsTouched();
    });

    if (this.materiaForm.invalid) {
      this.toastr.warning(
        'Por favor, complete todos los campos requeridos correctamente',
        'Formulario incompleto'
      );
      return;
    }

    // TODO: Implementar en siguientes fases
    console.log('Datos del formulario:', this.materiaForm.value);
    this.toastr.info('Funcionalidad en desarrollo', 'Próximamente');
  }

  cancelar(): void {
    this.onCancelar.emit();
  }
}
