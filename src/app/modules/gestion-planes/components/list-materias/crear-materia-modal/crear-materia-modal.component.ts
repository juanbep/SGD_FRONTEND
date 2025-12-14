// crear-materia-modal.component.ts

import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
  ElementRef,
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
import { MateriaService } from '../../../services/materia/materia.service';
import { CreateMateriaDto, Materia } from '../../../models';

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

  @ViewChild('correquisitoSection') correquisitoSection!: ElementRef;

  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private departamentoHelper = inject(DepartamentoHelperService);
  private materiaService = inject(MateriaService);

  materiaForm!: FormGroup;
  guardando = false;

  // Control para mostrar/ocultar sección de correquisito
  tieneCorrequisito = false;

  // Tipo de correquisito: 'nuevo' o 'existente'
  tipoCorrequisito: 'nuevo' | 'existente' = 'existente';

  // Semestres disponibles (1-10)
  semestresDisponibles: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Departamentos
  departamentos: { value: number; label: string; facultad: string }[] = [];
  loadingDepartamentos = false;

  // Materias libres (sin correquisito) del plan
  materiasLibres: Materia[] = [];
  loadingMateriasLibres = false;

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarDepartamentos();
    this.cargarMateriasLibres();
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

      // Correquisito existente (select)
      idCorrequisitoExistente: [null],

      // Datos del correquisito nuevo (formulario)
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

  async cargarMateriasLibres(): Promise<void> {
    this.loadingMateriasLibres = true;

    try {
      const response = await new Promise<any>((resolve, reject) => {
        this.materiaService
          .getMateriasLibres({ oidPlan: this.oidPlan, size: 100 })
          .subscribe({
            next: (response) => resolve(response),
            error: (error) => reject(error),
          });
      });

      this.materiasLibres = response.data?.content || [];

      if (this.materiasLibres.length === 0) {
        console.warn(
          'No hay materias sin correquisito disponibles en este plan'
        );
      }
    } catch (error) {
      console.error('Error al cargar materias libres:', error);
      this.materiasLibres = [];
    } finally {
      this.loadingMateriasLibres = false;
    }
  }

  onToggleCorrequisito(value: boolean): void {
    this.tieneCorrequisito = value;

    if (value) {
      // Establecer tipo por defecto
      this.tipoCorrequisito = 'existente';
      this.onTipoCorrequisitoChange('existente');

      // Scroll automático
      setTimeout(() => {
        this.scrollToCorrequisito();
      }, 100);
    } else {
      // Limpiar todo
      this.limpiarCorrequisito();
    }
  }

  onTipoCorrequisitoChange(tipo: 'nuevo' | 'existente'): void {
    this.tipoCorrequisito = tipo;
    const correquisito = this.materiaForm.get('correquisito') as FormGroup;

    if (tipo === 'existente') {
      // Activar validación para select de correquisito existente
      this.materiaForm
        .get('idCorrequisitoExistente')
        ?.setValidators([Validators.required]);

      // Limpiar y desactivar validaciones del formulario nuevo
      correquisito.get('oidMateria')?.clearValidators();
      correquisito.get('codigo')?.clearValidators();
      correquisito.get('nombre')?.clearValidators();
      correquisito.get('semestre')?.clearValidators();
      correquisito.get('horasSemana')?.clearValidators();
      correquisito.get('oidDepartamento')?.clearValidators();
      correquisito.reset();
    } else {
      // Activar validaciones para formulario nuevo
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

      // Limpiar validación del select existente
      this.materiaForm.get('idCorrequisitoExistente')?.clearValidators();
      this.materiaForm.get('idCorrequisitoExistente')?.reset();
    }

    // Actualizar validaciones
    this.materiaForm.get('idCorrequisitoExistente')?.updateValueAndValidity();
    Object.keys(correquisito.controls).forEach((key) => {
      correquisito.get(key)?.updateValueAndValidity();
    });
  }

  limpiarCorrequisito(): void {
    const correquisito = this.materiaForm.get('correquisito') as FormGroup;

    // Limpiar validaciones
    this.materiaForm.get('idCorrequisitoExistente')?.clearValidators();
    correquisito.get('oidMateria')?.clearValidators();
    correquisito.get('codigo')?.clearValidators();
    correquisito.get('nombre')?.clearValidators();
    correquisito.get('semestre')?.clearValidators();
    correquisito.get('horasSemana')?.clearValidators();
    correquisito.get('oidDepartamento')?.clearValidators();

    // Limpiar valores
    this.materiaForm.get('idCorrequisitoExistente')?.reset();
    correquisito.reset();

    // Actualizar estado
    this.materiaForm.get('idCorrequisitoExistente')?.updateValueAndValidity();
    Object.keys(correquisito.controls).forEach((key) => {
      correquisito.get(key)?.updateValueAndValidity();
    });
  }

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

  // Getter para correquisito existente
  get correquisitoExistenteInvalid(): boolean {
    const control = this.materiaForm.get('idCorrequisitoExistente');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  // Getters para validaciones - Correquisito Nuevo
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

  async guardar(): Promise<void> {
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

    this.guardando = true;

    try {
      if (this.tieneCorrequisito) {
        if (this.tipoCorrequisito === 'existente') {
          // Escenario 1: Crear materia con correquisito existente (1 petición)
          await this.crearMateriaConCorrequisitoExistente();
        } else {
          // Escenario 2: Crear materia con correquisito nuevo (2 peticiones)
          await this.crearMateriaConCorrequisitoNuevo();
        }
      } else {
        // Escenario 3: Crear materia sin correquisito (1 petición)
        await this.crearMateriaSinCorrequisito();
      }

      this.toastr.success('Materia creada exitosamente', 'Éxito');
      this.onMateriaCreada.emit();
    } catch (error: any) {
      console.error('Error al crear materia:', error);
      this.toastr.error(
        error?.error?.mensaje || 'No se pudo crear la materia',
        'Error'
      );
    } finally {
      this.guardando = false;
    }
  }

  private async crearMateriaSinCorrequisito(): Promise<void> {
    const materiaPrincipal = this.materiaForm.value;

    const createDto: CreateMateriaDto = {
      oidMateria: materiaPrincipal.oidMateria,
      codigo: materiaPrincipal.codigo,
      nombre: materiaPrincipal.nombre,
      semestre: materiaPrincipal.semestre,
      horasSemana: Number(materiaPrincipal.horasSemana),
      oidDepartamento: materiaPrincipal.oidDepartamento,
      oidPlan: this.oidPlan,
      idCorrequisito: null,
    };

    await new Promise((resolve, reject) => {
      this.materiaService.createMateria(createDto).subscribe({
        next: (response) => {
          console.log('Materia creada:', response);
          resolve(response);
        },
        error: (error) => reject(error),
      });
    });
  }

  private async crearMateriaConCorrequisitoExistente(): Promise<void> {
    const formValue = this.materiaForm.value;

    const createDto: CreateMateriaDto = {
      oidMateria: formValue.oidMateria,
      codigo: formValue.codigo,
      nombre: formValue.nombre,
      semestre: formValue.semestre,
      horasSemana: Number(formValue.horasSemana),
      oidDepartamento: formValue.oidDepartamento,
      oidPlan: this.oidPlan,
      idCorrequisito: formValue.idCorrequisitoExistente,
    };

    await new Promise((resolve, reject) => {
      this.materiaService.createMateria(createDto).subscribe({
        next: (response) => {
          console.log('Materia creada con correquisito existente:', response);
          resolve(response);
        },
        error: (error) => reject(error),
      });
    });
  }

  private async crearMateriaConCorrequisitoNuevo(): Promise<void> {
    const formValue = this.materiaForm.value;
    const correquisito = formValue.correquisito;

    // Paso 1: Crear el correquisito primero
    const correquisitoDto: CreateMateriaDto = {
      oidMateria: correquisito.oidMateria,
      codigo: correquisito.codigo,
      nombre: correquisito.nombre,
      semestre: correquisito.semestre,
      horasSemana: Number(correquisito.horasSemana),
      oidDepartamento: correquisito.oidDepartamento,
      oidPlan: this.oidPlan,
      idCorrequisito: null,
    };

    const correquisitoCreado = await new Promise<any>((resolve, reject) => {
      this.materiaService.createMateria(correquisitoDto).subscribe({
        next: (response) => {
          console.log('Correquisito creado:', response);
          resolve(response);
        },
        error: (error) => reject(error),
      });
    });

    // Paso 2: Crear la materia principal con el idMateria del correquisito
    const materiaPrincipalDto: CreateMateriaDto = {
      oidMateria: formValue.oidMateria,
      codigo: formValue.codigo,
      nombre: formValue.nombre,
      semestre: formValue.semestre,
      horasSemana: Number(formValue.horasSemana),
      oidDepartamento: formValue.oidDepartamento,
      oidPlan: this.oidPlan,
      idCorrequisito: correquisitoCreado.data.idMateria,
    };

    await new Promise((resolve, reject) => {
      this.materiaService.createMateria(materiaPrincipalDto).subscribe({
        next: (response) => {
          console.log('Materia principal creada:', response);
          resolve(response);
        },
        error: (error) => reject(error),
      });
    });
  }

  cancelar(): void {
    this.onCancelar.emit();
  }
}
