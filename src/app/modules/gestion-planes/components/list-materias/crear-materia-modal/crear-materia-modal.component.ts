import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
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

  // Referencia al elemento del formulario de correquisito
  @ViewChild('correquisitoSection') correquisitoSection!: ElementRef;

  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private departamentoHelper = inject(DepartamentoHelperService);

  materiaForm!: FormGroup;
  guardando = false;

  // Control para mostrar/ocultar sección de correquisito
  tieneCorrequisito = false;

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
      // Datos de la materia principal
      oidMateria: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      codigo: ['', [Validators.required, Validators.maxLength(50)]],
      nombre: ['', [Validators.required, Validators.maxLength(200)]],
      semestre: [null, [Validators.required]],
      horasSemana: [
        '',
        [Validators.required, Validators.pattern(/^\d+$/), Validators.min(1)],
      ],
      oidDepartamento: [null, [Validators.required]],

      // Datos del correquisito (inicialmente sin validaciones)
      correquisito: this.fb.group({
        oidMateria: [''],
        codigo: [''],
        nombre: [''],
        semestre: [null],
        horasSemana: [''],
        oidDepartamento: [null],
      }),
    });
  }

  async cargarDepartamentos(): Promise<void> {
    this.loadingDepartamentos = true;
    this.materiaForm.get('oidDepartamento')?.disable();
    this.materiaForm.get('correquisito.oidDepartamento')?.disable();

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
      this.materiaForm.get('oidDepartamento')?.enable();
      this.materiaForm.get('correquisito.oidDepartamento')?.enable();
    }
  }

  // Toggle para activar/desactivar correquisito
  onToggleCorrequisito(value: boolean): void {
    this.tieneCorrequisito = value;

    const correquisito = this.materiaForm.get('correquisito') as FormGroup;

    if (value) {
      // Activar validaciones para el correquisito
      correquisito
        .get('oidMateria')
        ?.setValidators([Validators.required, Validators.pattern(/^\d+$/)]);
      correquisito
        .get('codigo')
        ?.setValidators([Validators.required, Validators.maxLength(50)]);
      correquisito
        .get('nombre')
        ?.setValidators([Validators.required, Validators.maxLength(200)]);
      correquisito.get('semestre')?.setValidators([Validators.required]);
      correquisito
        .get('horasSemana')
        ?.setValidators([
          Validators.required,
          Validators.pattern(/^\d+$/),
          Validators.min(1),
        ]);
      correquisito.get('oidDepartamento')?.setValidators([Validators.required]);

      // Scroll automático después de un pequeño delay para que el DOM se actualice
      setTimeout(() => {
        this.scrollToCorrequisito();
      }, 100);
    } else {
      // Remover validaciones y limpiar valores
      correquisito.get('oidMateria')?.clearValidators();
      correquisito.get('codigo')?.clearValidators();
      correquisito.get('nombre')?.clearValidators();
      correquisito.get('semestre')?.clearValidators();
      correquisito.get('horasSemana')?.clearValidators();
      correquisito.get('oidDepartamento')?.clearValidators();

      // Limpiar valores
      correquisito.reset();
    }

    // Actualizar estado de validaciones
    Object.keys(correquisito.controls).forEach((key) => {
      correquisito.get(key)?.updateValueAndValidity();
    });
  }

  // Scroll suave hacia la sección de correquisito
  scrollToCorrequisito(): void {
    if (this.correquisitoSection) {
      this.correquisitoSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  // Getters para validaciones - Materia Principal
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

  // Getters para validaciones - Correquisito
  get corrOidMateriaInvalid(): boolean {
    const control = this.materiaForm.get('correquisito.oidMateria');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get corrCodigoInvalid(): boolean {
    const control = this.materiaForm.get('correquisito.codigo');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get corrNombreInvalid(): boolean {
    const control = this.materiaForm.get('correquisito.nombre');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get corrSemestreInvalid(): boolean {
    const control = this.materiaForm.get('correquisito.semestre');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get corrHorasSemanaInvalid(): boolean {
    const control = this.materiaForm.get('correquisito.horasSemana');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get corrDepartamentoInvalid(): boolean {
    const control = this.materiaForm.get('correquisito.oidDepartamento');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  guardar(): void {
    // Marcar todos los campos como touched para mostrar errores
    Object.keys(this.materiaForm.controls).forEach((key) => {
      const control = this.materiaForm.get(key);
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach((subKey) => {
          control.get(subKey)?.markAsTouched();
        });
      } else {
        control?.markAsTouched();
      }
    });

    if (this.materiaForm.invalid) {
      this.toastr.warning(
        'Por favor, complete todos los campos requeridos correctamente',
        'Formulario incompleto'
      );
      return;
    }

    // TODO: Implementar en siguientes fases
    const datosMateria = this.materiaForm.value;
    console.log('Datos del formulario:', {
      materiaCompleta: datosMateria,
      tieneCorrequisito: this.tieneCorrequisito,
      materiaPrincipal: {
        oidMateria: datosMateria.oidMateria,
        codigo: datosMateria.codigo,
        nombre: datosMateria.nombre,
        semestre: datosMateria.semestre,
        horasSemana: datosMateria.horasSemana,
        oidDepartamento: datosMateria.oidDepartamento,
      },
      materiaCorrequisito: this.tieneCorrequisito
        ? datosMateria.correquisito
        : null,
    });
    this.toastr.info('Funcionalidad en desarrollo', 'Próximamente');
  }

  cancelar(): void {
    this.onCancelar.emit();
  }
}
