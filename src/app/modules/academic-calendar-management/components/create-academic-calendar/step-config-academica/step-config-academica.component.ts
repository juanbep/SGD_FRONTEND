import {
  Component,
  Input,
  Output,
  EventEmitter,
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

export interface ConfigAcademicaData {
  semanasClase: number | null;
  semanasPreparacion: number | null;
  horasPlanta: number | null;
  horasCatedra: number | null;
  horasOcasionales: number | null;
  horasBecarioPracticante: number | null;
}

// Valores sugeridos por defecto
const VALORES_SUGERIDOS: ConfigAcademicaData = {
  semanasClase: 16,
  semanasPreparacion: 2,
  horasPlanta: 40,
  horasCatedra: 120,
  horasOcasionales: 80,
  horasBecarioPracticante: 60,
};

@Component({
  selector: 'app-step-config-academica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step-config-academica.component.html',
  styleUrl: './step-config-academica.component.css',
})
export class StepConfigAcademicaComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);

  @Input() datosIniciales: ConfigAcademicaData | null = null;
  @Output() cambioFormulario = new EventEmitter<ConfigAcademicaData>();
  @Output() formularioValido = new EventEmitter<boolean>();

  formulario!: FormGroup;
  readonly valoresSugeridos = VALORES_SUGERIDOS;

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  private inicializarFormulario(): void {
    this.formulario = this.fb.group({
      semanasClase: [
        this.datosIniciales?.semanasClase || null,
        [Validators.required, Validators.min(1), Validators.max(52)],
      ],
      semanasPreparacion: [
        this.datosIniciales?.semanasPreparacion || null,
        [Validators.required, Validators.min(0), Validators.max(10)],
      ],
      horasPlanta: [
        this.datosIniciales?.horasPlanta || null,
        [Validators.required, Validators.min(0), Validators.max(500)],
      ],
      horasCatedra: [
        this.datosIniciales?.horasCatedra || null,
        [Validators.required, Validators.min(0), Validators.max(500)],
      ],
      horasOcasionales: [
        this.datosIniciales?.horasOcasionales || null,
        [Validators.required, Validators.min(0), Validators.max(500)],
      ],
      horasBecarioPracticante: [
        this.datosIniciales?.horasBecarioPracticante || null,
        [Validators.required, Validators.min(0), Validators.max(500)],
      ],
    });

    // Emitir cambios y validez
    this.formulario.valueChanges.subscribe(() => {
      this.cambioFormulario.emit(this.formulario.value);
      this.formularioValido.emit(this.formulario.valid);
    });

    // Emitir estado inicial
    this.formularioValido.emit(this.formulario.valid);
  }

  aplicarValoresSugeridos(): void {
    this.formulario.patchValue(this.valoresSugeridos);
    this.toastr.success('Valores sugeridos aplicados correctamente');
  }

  incrementar(campo: string): void {
    const control = this.formulario.get(campo);
    if (control) {
      const valorActual = control.value || 0;
      control.setValue(valorActual + 1);
    }
  }

  decrementar(campo: string): void {
    const control = this.formulario.get(campo);
    if (control) {
      const valorActual = control.value || 0;
      if (valorActual > 0) {
        control.setValue(valorActual - 1);
      }
    }
  }

  marcarTodoComoTocado(): void {
    this.formulario.markAllAsTouched();
  }

  esValido(): boolean {
    return this.formulario.valid;
  }

  // ===== COMPUTED VALUES =====
  get totalSemanas(): number {
    const clase = this.formulario.get('semanasClase')?.value || 0;
    const preparacion = this.formulario.get('semanasPreparacion')?.value || 0;
    return clase + preparacion;
  }

  get totalHoras(): number {
    const planta = this.formulario.get('horasPlanta')?.value || 0;
    const catedra = this.formulario.get('horasCatedra')?.value || 0;
    const ocasionales = this.formulario.get('horasOcasionales')?.value || 0;
    const becario = this.formulario.get('horasBecarioPracticante')?.value || 0;
    return planta + catedra + ocasionales + becario;
  }

  // ===== GETTERS =====
  get semanasClaseControl() {
    return this.formulario.get('semanasClase');
  }

  get semanasPreparacionControl() {
    return this.formulario.get('semanasPreparacion');
  }

  get horasPlantaControl() {
    return this.formulario.get('horasPlanta');
  }

  get horasCatedraControl() {
    return this.formulario.get('horasCatedra');
  }

  get horasOcasionalesControl() {
    return this.formulario.get('horasOcasionales');
  }

  get horasBecarioPracticanteControl() {
    return this.formulario.get('horasBecarioPracticante');
  }
}
