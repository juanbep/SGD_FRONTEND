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
import { EstadoCalendario } from '../../../models';
import { CalendarioHelperService } from '../../../services';

export interface InfoBasicaData {
  anioCalendario: number | null;
  numeroCalendario: number | null;
  estado: EstadoCalendario;
  observacion: string;
}

@Component({
  selector: 'app-step-info-basica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step-info-basica.component.html',
  styleUrl: './step-info-basica.component.css',
})
export class StepInfoBasicaComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly calendarioHelper = inject(CalendarioHelperService);

  @Input() datosIniciales: InfoBasicaData | null = null;
  @Output() cambioFormulario = new EventEmitter<InfoBasicaData>();
  @Output() formularioValido = new EventEmitter<boolean>();

  readonly ESTADOS_DISPONIBLES: EstadoCalendario[] = [
    'PENDIENTE',
    'ACTIVO',
    'APROBADO',
    'DESHABILITADO',
  ];

  formulario!: FormGroup;
  validandoCalendario = false;

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  private inicializarFormulario(): void {
    this.formulario = this.fb.group({
      anioCalendario: [
        this.datosIniciales?.anioCalendario || new Date().getFullYear(),
        [Validators.required, Validators.min(2000), Validators.max(2100)],
      ],
      numeroCalendario: [
        this.datosIniciales?.numeroCalendario || null,
        [Validators.required, Validators.min(1), Validators.max(3)],
      ],
      estado: [this.datosIniciales?.estado || 'PENDIENTE', Validators.required],
      observacion: [
        this.datosIniciales?.observacion || '',
        Validators.maxLength(500),
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

  async validarCalendarioExistente(): Promise<boolean> {
    const anio = this.formulario.get('anioCalendario')?.value;
    const periodo = this.formulario.get('numeroCalendario')?.value;

    if (!anio || !periodo) return true;

    this.validandoCalendario = true;

    try {
      const calendarios = await this.calendarioHelper.getAll({ size: 1000 });
      const existe = calendarios.some(
        (c) => c.anioCalendario === anio && c.numeroCalendario === periodo
      );

      if (existe) {
        this.toastr.error(
          `Ya existe un calendario para ${anio}-${periodo}`,
          'Calendario duplicado'
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error al validar calendario:', error);
      return true;
    } finally {
      this.validandoCalendario = false;
    }
  }

  sugerirAnioActual(): void {
    this.formulario.patchValue({
      anioCalendario: new Date().getFullYear(),
    });
  }

  marcarTodoComoTocado(): void {
    this.formulario.markAllAsTouched();
  }

  esValido(): boolean {
    return this.formulario.valid;
  }

  get anioCalendarioControl() {
    return this.formulario.get('anioCalendario');
  }

  get numeroCalendarioControl() {
    return this.formulario.get('numeroCalendario');
  }

  get estadoControl() {
    return this.formulario.get('estado');
  }

  get observacionControl() {
    return this.formulario.get('observacion');
  }
}
