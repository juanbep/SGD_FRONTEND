import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
  signal,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CalendarioHelperService } from '../../../services';

// Interfaz actualizada (con horas)
export interface InfoBasicaData {
  anioCalendario: number | null;
  numeroCalendario: number | null;
  horasPlanta: number | null;
  horasOcasionales: number | null;
  observacion: string;
}

// DTO para crear calendario (actualizado)
export interface CreateCalendarioPaso1DTO {
  anioCalendario: number;
  numeroCalendario: number;
  horasPlanta: number;
  horasOcasionales: number;
  observacion: string;
}

@Component({
  selector: 'app-step-info-basica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step-info-basica.component.html',
  styleUrl: './step-info-basica.component.css',
})
export class StepInfoBasicaComponent implements OnInit, OnChanges {
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly calendarioHelper = inject(CalendarioHelperService);

  @Input() datosIniciales: InfoBasicaData | null = null;
  @Input() calendarioYaCreado: boolean = false;
  @Output() cambioFormulario = new EventEmitter<InfoBasicaData>();
  @Output() formularioValido = new EventEmitter<boolean>();
  @Output() crearCalendario = new EventEmitter<CreateCalendarioPaso1DTO>();

  // ===== CONSTANTES PARA LÍMITES DE AÑO =====
  //readonly ANIO_MINIMO = new Date().getFullYear();
  readonly ANIO_MINIMO = 2022;
  readonly ANIO_MAXIMO = 2100;

  // ===== SIGNALS PARA MODAL =====
  readonly mostrarModalCalendarios = signal<boolean>(false);
  readonly calendariosExistentes = signal<{ anio: number; periodo: number }[]>(
    []
  );
  readonly cargandoCalendarios = signal<boolean>(false);

  // ===== CONSTANTES PARA LÍMITES HORAS PLANTA =====
  readonly HORAS_P_MINIMO = 10;
  readonly HORAS_P_MAXIMO = 60;

  // ===== CONSTANTES PARA LÍMITES HORAS OCASIONALES =====
  readonly HORAS_O_MINIMO = 10;
  readonly HORAS_O_MAXIMO = 60;

  formulario!: FormGroup;
  validandoCalendario = false;

  ngOnInit(): void {
    this.inicializarFormulario();
    this.actualizarEstadoFormulario();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Cuando cambia calendarioYaCreado, actualizar estado del formulario
    if (changes['calendarioYaCreado'] && this.formulario) {
      this.actualizarEstadoFormulario();
    }

    // Cuando cambian datosIniciales, cargar en formulario
    if (changes['datosIniciales'] && this.datosIniciales && this.formulario) {
      this.formulario.patchValue({
        anioCalendario: this.datosIniciales.anioCalendario,
        numeroCalendario: this.datosIniciales.numeroCalendario,
        horasPlanta: this.datosIniciales.horasPlanta,
        horasOcasionales: this.datosIniciales.horasOcasionales,
        observacion: this.datosIniciales.observacion,
      });
    }
  }

  private inicializarFormulario(): void {
    this.formulario = this.fb.group({
      anioCalendario: [
        this.datosIniciales?.anioCalendario || this.ANIO_MINIMO,
        [
          Validators.required,
          Validators.min(this.ANIO_MINIMO),
          Validators.max(this.ANIO_MAXIMO),
        ],
      ],
      numeroCalendario: [
        this.datosIniciales?.numeroCalendario || null,
        [Validators.required, Validators.min(1)],
      ],
      horasPlanta: [
        this.datosIniciales?.horasPlanta || null,
        [
          Validators.required,
          Validators.min(this.HORAS_P_MINIMO),
          Validators.max(this.HORAS_P_MAXIMO),
        ],
      ],
      horasOcasionales: [
        this.datosIniciales?.horasOcasionales || null,
        [
          Validators.required,
          Validators.min(this.HORAS_O_MINIMO),
          Validators.max(this.HORAS_O_MAXIMO),
        ],
      ],
      observacion: [
        this.datosIniciales?.observacion || '',
        Validators.maxLength(500),
      ],
    });

    // Emitir cambios y validez + Guardar en localStorage
    this.formulario.valueChanges.subscribe(() => {
      this.cambioFormulario.emit(this.formulario.value);
      this.formularioValido.emit(this.formulario.valid);
    });

    // Emitir estado inicial
    this.formularioValido.emit(this.formulario.valid);
  }

  // ===== Actualizar estado del formulario (habilitar/deshabilitar) =====
  private actualizarEstadoFormulario(): void {
    if (!this.formulario) return;

    if (this.calendarioYaCreado) {
      // Deshabilitar todos los controles
      this.formulario.get('anioCalendario')?.disable({ emitEvent: false });
      this.formulario.get('numeroCalendario')?.disable({ emitEvent: false });
      this.formulario.get('horasPlanta')?.disable({ emitEvent: false });
      this.formulario.get('horasOcasionales')?.disable({ emitEvent: false });
      this.formulario.get('observacion')?.disable({ emitEvent: false });
    } else {
      // Habilitar todos los controles
      this.formulario.get('anioCalendario')?.enable({ emitEvent: false });
      this.formulario.get('numeroCalendario')?.enable({ emitEvent: false });
      this.formulario.get('horasPlanta')?.enable({ emitEvent: false });
      this.formulario.get('horasOcasionales')?.enable({ emitEvent: false });
      this.formulario.get('observacion')?.enable({ emitEvent: false });
    }
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

  // ===== MODAL DE CALENDARIOS EXISTENTES =====
  async abrirModalCalendarios(): Promise<void> {
    this.mostrarModalCalendarios.set(true);
    this.cargandoCalendarios.set(true);

    try {
      const calendarios = await this.calendarioHelper.getAll({ size: 1000 });

      const calendariosSimplificados = calendarios
        .map((c) => ({
          anio: c.anioCalendario,
          periodo: c.numeroCalendario,
        }))
        .sort((a, b) => {
          if (b.anio !== a.anio) {
            return b.anio - a.anio;
          }
          return b.periodo - a.periodo;
        });

      this.calendariosExistentes.set(calendariosSimplificados);
    } catch (error) {
      console.error('Error al cargar calendarios:', error);
      this.toastr.error('Error al cargar los calendarios existentes');
    } finally {
      this.cargandoCalendarios.set(false);
    }
  }

  cerrarModalCalendarios(): void {
    this.mostrarModalCalendarios.set(false);
  }

  sugerirAnioActual(): void {
    this.formulario.patchValue({
      anioCalendario: this.ANIO_MINIMO,
    });
  }

  marcarTodoComoTocado(): void {
    this.formulario.markAllAsTouched();
  }

  esValido(): boolean {
    return this.formulario.valid;
  }

  // ===== OBTENER DTO PARA CREAR CALENDARIO =====
  obtenerDatosParaCreacion(): CreateCalendarioPaso1DTO {
    // Redondear a 1 decimal
    const horasPlanta = parseFloat(this.formulario.get('horasPlanta')?.value);
    const horasOcasionales = parseFloat(
      this.formulario.get('horasOcasionales')?.value
    );

    return {
      anioCalendario: this.formulario.get('anioCalendario')?.value,
      numeroCalendario: this.formulario.get('numeroCalendario')?.value,
      horasPlanta: Math.round(horasPlanta * 10) / 10,
      horasOcasionales: Math.round(horasOcasionales * 10) / 10,
      observacion: this.formulario.get('observacion')?.value || '',
    };
  }

  get anioCalendarioControl() {
    return this.formulario.get('anioCalendario');
  }

  get numeroCalendarioControl() {
    return this.formulario.get('numeroCalendario');
  }

  get horasPlantaControl() {
    return this.formulario.get('horasPlanta');
  }

  get horasOcasionalesControl() {
    return this.formulario.get('horasOcasionales');
  }

  get observacionControl() {
    return this.formulario.get('observacion');
  }
}
