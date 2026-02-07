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

@Component({
  selector: 'app-create-academic-calendar',
  standalone: true,
  imports: [
    CommonModule,
    StepperComponent,
    StepInfoBasicaComponent,
    StepFechasComponent,
  ],
  templateUrl: './create-academic-calendar.component.html',
  styleUrl: './create-academic-calendar.component.css',
})
export class CreateAcademicCalendarComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly calendarioHelper = inject(CalendarioHelperService);

  @ViewChild(StepInfoBasicaComponent) stepInfoBasica!: StepInfoBasicaComponent;

  // ===== SIGNALS =====
  readonly pasoActual = signal<number>(1);
  readonly pasosCompletados = signal<boolean[]>([false, false]);
  readonly paso1Valido = signal<boolean>(false);
  readonly oidCalendarioCreado = signal<number | null>(null);
  readonly creandoCalendario = signal<boolean>(false);

  // ===== COMPUTED =====
  readonly puedeAvanzarPaso1 = computed(
    () => this.oidCalendarioCreado() !== null,
  );
  readonly calendarioYaCreado = computed(
    () => this.oidCalendarioCreado() !== null,
  );

  // ===== CONSTANTES =====
  readonly TITULOS_PASOS = ['Información Básica', 'Fechas del Calendario'];

  ngOnInit(): void {
    // Ya no se necesita cargar nada del storage
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
      });

      if (calendarioCreado && calendarioCreado.oidcalendario) {
        this.oidCalendarioCreado.set(calendarioCreado.oidcalendario);

        this.toastr.success(
          `Calendario ${dto.anioCalendario}-${dto.numeroCalendario} creado exitosamente`,
          '¡Éxito!',
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
      this.toastr.warning('Debes completar los pasos anteriores primero');
    }
  }

  // ===== FINALIZAR =====
  finalizar(): void {
    this.toastr.success(
      'El calendario ha sido creado exitosamente',
      '¡Proceso completado!',
      { timeOut: 3000 },
    );

    setTimeout(() => {
      this.router.navigate(['/app/gestion-calendario-academico/listar']);
    }, 1000);
  }

  cancel(): void {
    if (confirm('¿Estás seguro de cancelar? Se perderán los cambios.')) {
      this.router.navigate(['/app/gestion-calendario-academico/gestionar']);
    }
  }
}
