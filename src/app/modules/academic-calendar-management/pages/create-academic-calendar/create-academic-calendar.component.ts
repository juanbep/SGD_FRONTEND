import {
  Component,
  OnInit,
  signal,
  computed,
  inject,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StepperComponent } from '../../components/create-academic-calendar/stepper/stepper.component';
import {
  StepInfoBasicaComponent,
  InfoBasicaData,
  CreateCalendarioPaso1DTO,
} from '../../components/create-academic-calendar/step-info-basica/step-info-basica.component';
import { StepFechasComponent } from '../../components/create-academic-calendar/step-fechas/step-fechas.component';
import { CalendarioHelperService } from '../../services';
import { CreateFechaDto } from '../../models';

@Component({
  selector: 'app-create-academic-calendar',
  standalone: true,
  imports: [
    CommonModule,
    StepperComponent,
    StepInfoBasicaComponent,
    StepFechasComponent, // ← AGREGADO
  ],
  templateUrl: './create-academic-calendar.component.html',
  styleUrl: './create-academic-calendar.component.css',
})
export class CreateAcademicCalendarComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly calendarioHelper = inject(CalendarioHelperService);

  @ViewChild(StepInfoBasicaComponent) stepInfoBasica!: StepInfoBasicaComponent;
  @ViewChild(StepFechasComponent) stepFechas!: StepFechasComponent; // ← AGREGADO

  // ===== SIGNALS =====
  readonly pasoActual = signal<number>(1);
  readonly pasosCompletados = signal<boolean[]>([false, false]);
  readonly paso1Valido = signal<boolean>(false);
  readonly paso2Valido = signal<boolean>(false); // ← AGREGADO
  readonly oidCalendarioCreado = signal<number | null>(null);
  readonly creandoCalendario = signal<boolean>(false);
  readonly datosCalendarioCreado = signal<InfoBasicaData | null>(null);
  readonly fechasDelCalendario = signal<CreateFechaDto[]>([]); // ← AGREGADO

  // ===== COMPUTED =====
  readonly puedeAvanzarPaso1 = computed(
    () => this.oidCalendarioCreado() !== null
  );
  readonly calendarioYaCreado = computed(
    () => this.oidCalendarioCreado() !== null
  );

  // ===== CONSTANTES =====
  readonly TITULOS_PASOS = ['Información Básica', 'Fechas del Calendario'];

  ngOnInit(): void {
    this.cargarOidDeStorage();
    this.cargarDatosCalendarioCreado();
  }

  // ===== CREAR CALENDARIO EN PASO 1 =====
  async alCrearCalendarioPaso1(dto: CreateCalendarioPaso1DTO): Promise<void> {
    const valido = await this.stepInfoBasica.validarCalendarioExistente();
    if (!valido) return;

    this.creandoCalendario.set(true);

    try {
      const calendarioCreado = await this.calendarioHelper.create({
        anioCalendario: dto.anioCalendario,
        numeroCalendario: dto.numeroCalendario,
        horasPlanta: dto.horasPlanta,
        horasOcasionales: dto.horasOcasionales,
        observacion: dto.observacion,
        semanasClase: 0,
        semanasPreparacion: 0,
        horasCatedra: 0,
        horasBecarioPracticante: 0,
      });

      if (calendarioCreado && calendarioCreado.oidcalendario) {
        this.oidCalendarioCreado.set(calendarioCreado.oidcalendario);

        const datosCreado: InfoBasicaData = {
          anioCalendario: dto.anioCalendario,
          numeroCalendario: dto.numeroCalendario,
          horasPlanta: dto.horasPlanta,
          horasOcasionales: dto.horasOcasionales,
          observacion: dto.observacion,
        };
        this.datosCalendarioCreado.set(datosCreado);

        this.guardarOidEnStorage(calendarioCreado.oidcalendario);
        this.guardarDatosCalendarioEnStorage(datosCreado);
        this.stepInfoBasica.limpiarBorrador();

        this.toastr.success(
          `Calendario ${dto.anioCalendario}-${dto.numeroCalendario} creado exitosamente`,
          '¡Éxito!'
        );

        console.log(
          'Calendario creado con OID:',
          calendarioCreado.oidcalendario
        );
      } else {
        throw new Error('No se recibió el OID del calendario creado');
      }
    } catch (error: any) {
      console.error('Error al crear calendario:', error);
      const mensaje = error?.error?.mensaje || 'Error al crear el calendario';
      this.toastr.error(mensaje, 'Error');
      this.oidCalendarioCreado.set(null);
    } finally {
      this.creandoCalendario.set(false);
    }
  }

  // ===== MANEJADORES DE EVENTOS =====
  alCambiarValidezPaso1(valido: boolean): void {
    this.paso1Valido.set(valido);
  }

  // ← NUEVO: Manejadores para Paso 2
  alCambiarValidezPaso2(valido: boolean): void {
    this.paso2Valido.set(valido);
  }

  alCambiarFechas(fechas: CreateFechaDto[]): void {
    this.fechasDelCalendario.set(fechas);
    console.log('Fechas actualizadas:', fechas);
  }

  // ===== NAVEGACIÓN =====
  siguientePaso(): void {
    if (this.pasoActual() === 1) {
      if (!this.puedeAvanzarPaso1()) {
        this.toastr.warning('Debes crear el calendario antes de continuar');
        return;
      }
      const completados = this.pasosCompletados();
      completados[0] = true;
      this.pasosCompletados.set([...completados]);
      this.pasoActual.set(2);
    }
  }

  pasoAnterior(): void {
    if (this.pasoActual() > 1) {
      this.pasoActual.set(this.pasoActual() - 1);
    }
  }

  irAPaso(paso: number): void {
    if (paso === 1) {
      this.pasoActual.set(1);
    } else if (paso === 2 && this.pasosCompletados()[0]) {
      this.pasoActual.set(2);
    } else {
      this.toastr.info('Debes completar los pasos anteriores primero');
    }
  }

  // ===== FINALIZAR =====
  finalizar(): void {
    this.limpiarStorage();
    this.toastr.success(
      'El calendario ha sido creado exitosamente',
      '¡Proceso completado!',
      { timeOut: 3000 }
    );

    setTimeout(() => {
      this.router.navigate(['/app/gestion-calendario-academico']);
    }, 1000);
  }

  // ===== STORAGE =====
  private guardarOidEnStorage(oid: number): void {
    try {
      localStorage.setItem(
        'calendario_en_progreso',
        JSON.stringify({ oidCalendario: oid })
      );
    } catch (error) {
      console.error('Error al guardar OID:', error);
    }
  }

  private guardarDatosCalendarioEnStorage(datos: InfoBasicaData): void {
    try {
      localStorage.setItem('paso1_datos_calendario', JSON.stringify(datos));
    } catch (error) {
      console.error('Error al guardar datos calendario:', error);
    }
  }

  private cargarOidDeStorage(): void {
    try {
      const stored = localStorage.getItem('calendario_en_progreso');
      if (stored) {
        const { oidCalendario } = JSON.parse(stored);
        if (oidCalendario) {
          this.oidCalendarioCreado.set(oidCalendario);
        }
      }
    } catch (error) {
      console.error('Error al cargar OID:', error);
    }
  }

  private cargarDatosCalendarioCreado(): void {
    try {
      const stored = localStorage.getItem('paso1_datos_calendario');
      if (stored) {
        const datos: InfoBasicaData = JSON.parse(stored);
        this.datosCalendarioCreado.set(datos);
        this.toastr.info('Se ha recuperado un calendario en progreso');
      }
    } catch (error) {
      console.error('Error al cargar datos calendario:', error);
    }
  }

  private limpiarStorage(): void {
    localStorage.removeItem('calendario_en_progreso');
    localStorage.removeItem('paso1_datos_calendario');
    localStorage.removeItem('paso1_borrador');
  }

  cancel(): void {
    if (confirm('¿Estás seguro de cancelar? Se perderán los cambios.')) {
      this.limpiarStorage();
      this.router.navigate(['/app/gestion-calendario-academico']);
    }
  }
}
