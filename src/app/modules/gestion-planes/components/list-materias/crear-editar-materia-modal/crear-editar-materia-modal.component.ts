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
import { CreateMateriaDto, Materia, UpdateMateriaDto } from '../../../models';

@Component({
  selector: 'app-crear-editar-materia-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './crear-editar-materia-modal.component.html',
  styleUrl: './crear-editar-materia-modal.component.css',
})
export class CrearEditarMateriaModalComponent implements OnInit {
  // ===== INPUTS =====
  @Input() modo: 'crear' | 'editar' = 'crear';
  @Input() oidPlan!: number;
  @Input() numeroPlan?: number;
  @Input() materia?: Materia;

  // ===== OUTPUTS =====
  @Output() onMateriaCreada = new EventEmitter<void>();
  @Output() onMateriaEditada = new EventEmitter<void>();
  @Output() onCancelar = new EventEmitter<void>();

  @ViewChild('correquisitoSection') correquisitoSection!: ElementRef;

  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private departamentoHelper = inject(DepartamentoHelperService);
  private materiaService = inject(MateriaService);

  materiaForm!: FormGroup;
  guardando = false;

  // ===== CONFIGURACIÓN DE CAMPOS EDITABLES =====
  camposEditables = {
    oidMateria: false,
    codigo: true,
    nombre: true,
    semestre: true,
    horasSemana: true,
    oidDepartamento: true,
  };

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

    // Si está en modo editar, cargar datos de la materia
    if (this.esModoEditar && this.materia) {
      this.cargarDatosMateria();
    }
  }

  cargarDatosMateria(): void {
    if (!this.materia) {
      console.warn('No hay materia para cargar en modo editar');
      return;
    }

    // Prellenar los campos del formulario con los datos de la materia
    this.materiaForm.patchValue({
      oidMateria: this.materia.oidMateria,
      codigo: this.materia.codigo,
      nombre: this.materia.nombre,
      semestre: this.materia.semestre,
      horasSemana: this.materia.horasSemana,
      oidDepartamento: this.materia.oidDepartamento,
    });

    // Aplicar restricciones de campos editables
    this.aplicarRestriccionesEdicion();

    // Si la materia tiene correquisito, activar el toggle y prellenar
    if (this.materia.idCorrequisito) {
      this.tieneCorrequisito = true;
      this.tipoCorrequisito = 'existente'; // Por defecto mostrar como existente

      // Prellenar el select de correquisito existente con el ID actual
      this.materiaForm.patchValue({
        idCorrequisitoExistente: this.materia.idCorrequisito,
      });

      // Configurar validaciones para el modo existente
      this.onTipoCorrequisitoChange('existente');
    }
  }

  aplicarRestriccionesEdicion(): void {
    // Deshabilitar campos según la configuración
    if (!this.camposEditables.oidMateria) {
      this.materiaForm.get('oidMateria')?.disable();
    }
    if (!this.camposEditables.codigo) {
      this.materiaForm.get('codigo')?.disable();
    }
    if (!this.camposEditables.nombre) {
      this.materiaForm.get('nombre')?.disable();
    }
    if (!this.camposEditables.semestre) {
      this.materiaForm.get('semestre')?.disable();
    }
    if (!this.camposEditables.horasSemana) {
      this.materiaForm.get('horasSemana')?.disable();
    }
    if (!this.camposEditables.oidDepartamento) {
      this.materiaForm.get('oidDepartamento')?.disable();
    }
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

  private correquisitoHaCambiado(): boolean {
    if (!this.esModoEditar || !this.materia) {
      return false;
    }

    const idCorrequisitoOriginal = this.materia.idCorrequisito;
    const idCorrequisitoActual = this.materiaForm.get(
      'idCorrequisitoExistente'
    )?.value;

    // Si no tenía correquisito y ahora tiene = cambió
    if (!idCorrequisitoOriginal && this.tieneCorrequisito) {
      return true;
    }

    // Si tenía correquisito y ahora no = cambió
    if (idCorrequisitoOriginal && !this.tieneCorrequisito) {
      return true;
    }

    // Si los IDs son diferentes = cambió
    if (idCorrequisitoOriginal !== idCorrequisitoActual) {
      return true;
    }

    return false;
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

    setTimeout(() => {
      this.scrollToCorrequisito();
    }, 100);
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
      if (this.esModoCrear) {
        // ===== MODO CREAR =====
        await this.procesarCreacion();
        this.toastr.success('Materia creada exitosamente', 'Éxito');
        this.onMateriaCreada.emit();
      } else {
        // ===== MODO EDITAR =====
        await this.procesarEdicion();
        this.toastr.success('Materia actualizada exitosamente', 'Éxito');
        this.onMateriaEditada.emit();
      }
    } catch (error: any) {
      console.error(
        `Error al ${this.esModoCrear ? 'crear' : 'actualizar'} materia:`,
        error
      );
      this.toastr.error(
        error?.error?.mensaje ||
          `No se pudo ${this.esModoCrear ? 'crear' : 'actualizar'} la materia`,
        'Error'
      );
    } finally {
      this.guardando = false;
    }
  }

  private async procesarCreacion(): Promise<void> {
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
  }

  private async procesarEdicion(): Promise<void> {
    if (!this.materia) {
      throw new Error('No hay materia para editar');
    }

    const correquisitoOriginal = this.materia.idCorrequisito;

    // CASO 1: Tenía correquisito y ahora se eliminó (toggle desactivado)
    if (correquisitoOriginal && !this.tieneCorrequisito) {
      await this.actualizarMateriaEliminandoCorrequisito();
      return;
    }

    // CASO 2: No tenía correquisito y ahora se agrega
    if (!correquisitoOriginal && this.tieneCorrequisito) {
      if (this.tipoCorrequisito === 'existente') {
        await this.actualizarMateriaConCorrequisitoExistente();
      } else {
        await this.actualizarMateriaConCorrequisitoNuevo();
      }
      return;
    }

    // CASO 3: Tenía correquisito y se está modificando
    if (correquisitoOriginal && this.tieneCorrequisito) {
      const nuevoCorrequisito = this.materiaForm.get(
        'idCorrequisitoExistente'
      )?.value;

      if (this.tipoCorrequisito === 'existente') {
        // Verificar si cambió a otro correquisito existente
        if (nuevoCorrequisito !== correquisitoOriginal) {
          await this.actualizarMateriaCambiandoCorrequisito(nuevoCorrequisito);
        } else {
          // El correquisito no cambió, solo actualizar campos editables
          await this.actualizarMateriaSinModificarCorrequisito();
        }
      } else {
        // Crear nuevo correquisito y reemplazar el existente
        await this.actualizarMateriaConCorrequisitoNuevo();
      }
      return;
    }

    // CASO 4: No tenía correquisito y tampoco se agrega
    await this.actualizarMateriaSinCorrequisito();
  }

  private async actualizarMateriaEliminandoCorrequisito(): Promise<void> {
    const formValue = this.materiaForm.getRawValue();

    const updateDto: UpdateMateriaDto = {
      idMateria: this.materia!.idMateria,
      oidMateria: formValue.oidMateria,
      codigo: formValue.codigo,
      nombre: formValue.nombre,
      semestre: formValue.semestre,
      horasSemana: Number(formValue.horasSemana),
      oidDepartamento: formValue.oidDepartamento,
      oidPlan: this.oidPlan,
      idCorrequisito: null, // ← Eliminar el correquisito
    };

    await new Promise((resolve, reject) => {
      this.materiaService.updateMateria(updateDto).subscribe({
        next: (response) => {
          resolve(response);
        },
        error: (error) => reject(error),
      });
    });
  }

  private async actualizarMateriaCambiandoCorrequisito(
    nuevoIdCorrequisito: number
  ): Promise<void> {
    const formValue = this.materiaForm.getRawValue();

    const updateDto: UpdateMateriaDto = {
      idMateria: this.materia!.idMateria,
      oidMateria: formValue.oidMateria,
      codigo: formValue.codigo,
      nombre: formValue.nombre,
      semestre: formValue.semestre,
      horasSemana: Number(formValue.horasSemana),
      oidDepartamento: formValue.oidDepartamento,
      oidPlan: this.oidPlan,
      idCorrequisito: nuevoIdCorrequisito,
    };

    await new Promise((resolve, reject) => {
      this.materiaService.updateMateria(updateDto).subscribe({
        next: (response) => {
          resolve(response);
        },
        error: (error) => reject(error),
      });
    });
  }

  private async actualizarMateriaSinCorrequisito(): Promise<void> {
    const formValue = this.materiaForm.getRawValue(); // getRawValue() incluye campos deshabilitados

    const updateDto: UpdateMateriaDto = {
      idMateria: this.materia!.idMateria,
      oidMateria: formValue.oidMateria,
      codigo: formValue.codigo,
      nombre: formValue.nombre,
      semestre: formValue.semestre,
      horasSemana: Number(formValue.horasSemana),
      oidDepartamento: formValue.oidDepartamento,
      oidPlan: this.oidPlan,
      idCorrequisito: null,
    };

    await new Promise((resolve, reject) => {
      this.materiaService.updateMateria(updateDto).subscribe({
        next: (response) => {
          resolve(response);
        },
        error: (error) => reject(error),
      });
    });
  }

  private async actualizarMateriaSinModificarCorrequisito(): Promise<void> {
    const formValue = this.materiaForm.getRawValue();

    const updateDto: UpdateMateriaDto = {
      idMateria: this.materia!.idMateria,
      oidMateria: formValue.oidMateria,
      codigo: formValue.codigo,
      nombre: formValue.nombre,
      semestre: formValue.semestre,
      horasSemana: Number(formValue.horasSemana),
      oidDepartamento: formValue.oidDepartamento,
      oidPlan: this.oidPlan,
      // Mantener el correquisito existente
      idCorrequisito: this.materia!.idCorrequisito,
    };

    await new Promise((resolve, reject) => {
      this.materiaService.updateMateria(updateDto).subscribe({
        next: (response) => {
          resolve(response);
        },
        error: (error) => reject(error),
      });
    });
  }

  private async actualizarMateriaConCorrequisitoExistente(): Promise<void> {
    const formValue = this.materiaForm.getRawValue();

    const updateDto: UpdateMateriaDto = {
      idMateria: this.materia!.idMateria,
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
      this.materiaService.updateMateria(updateDto).subscribe({
        next: (response) => {
          resolve(response);
        },
        error: (error) => reject(error),
      });
    });
  }

  private async actualizarMateriaConCorrequisitoNuevo(): Promise<void> {
    const formValue = this.materiaForm.getRawValue();
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
        next: (response) => {},
        error: (error) => reject(error),
      });
    });

    // Paso 2: Actualizar la materia principal con el idMateria del correquisito
    const updateDto: UpdateMateriaDto = {
      idMateria: this.materia!.idMateria,
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
      this.materiaService.updateMateria(updateDto).subscribe({
        next: (response) => {},
        error: (error) => reject(error),
      });
    });
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
          resolve(response);
        },
        error: (error) => reject(error),
      });
    });
  }

  cancelar(): void {
    this.onCancelar.emit();
  }

  // ===== GETTERS PARA EL TEMPLATE =====
  get esModoEditar(): boolean {
    return this.modo === 'editar';
  }

  get esModoCrear(): boolean {
    return this.modo === 'crear';
  }

  get tituloModal(): string {
    return this.esModoEditar ? 'Editar Materia' : 'Crear Nueva Materia';
  }

  get textoBotonGuardar(): string {
    return this.esModoEditar ? 'Guardar Cambios' : 'Crear Materia';
  }

  get permiteModificarCorrequisito(): boolean {
    // Solo permite modificar correquisito si:
    // 1. Está en modo crear, O
    // 2. Está en modo editar Y la materia NO tiene correquisito asignado
    // return (
    //   this.esModoCrear || (this.esModoEditar && !this.materia?.idCorrequisito)
    // );
    return true;
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
}
