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
} from '../../components/create-academic-calendar/step-info-basica/step-info-basica.component';
import {
  CreateCalendarioWizardData,
  CreateFechaDto,
  INITIAL_WIZARD_DATA,
} from '../../models';
import {
  ConfigAcademicaData,
  StepConfigAcademicaComponent,
} from '../../components/create-academic-calendar/step-config-academica/step-config-academica.component';
import { StepFechasComponent } from '../../components/create-academic-calendar/step-fechas/step-fechas.component';

@Component({
  selector: 'app-create-academic-calendar',
  standalone: true,
  imports: [
    CommonModule,
    StepperComponent,
    StepInfoBasicaComponent,
    StepConfigAcademicaComponent,
    StepFechasComponent,
  ],
  templateUrl: './create-academic-calendar.component.html',
  styleUrl: './create-academic-calendar.component.css',
})
export class CreateAcademicCalendarComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  @ViewChild(StepInfoBasicaComponent) stepInfoBasica!: StepInfoBasicaComponent;
  @ViewChild(StepConfigAcademicaComponent)
  stepConfigAcademica!: StepConfigAcademicaComponent;
  @ViewChild(StepFechasComponent) stepFechas!: StepFechasComponent;

  // ===== SIGNALS =====
  readonly datosWizard = signal<CreateCalendarioWizardData>(
    structuredClone(INITIAL_WIZARD_DATA)
  );
  readonly pasoActual = computed(() => this.datosWizard().currentStep);
  readonly esUltimoPaso = computed(() => this.pasoActual() === 4);
  readonly esPrimerPaso = computed(() => this.pasoActual() === 1);
  readonly paso1Valido = signal<boolean>(false);
  readonly paso2Valido = signal<boolean>(false);
  readonly paso3Valido = signal<boolean>(false);

  // ===== CONSTANTES =====
  readonly TOTAL_PASOS = 4;
  readonly TITULOS_PASOS = [
    'Información Básica',
    'Configuración Académica',
    'Fechas del Calendario',
    'Revisión y Confirmación',
  ];

  ngOnInit(): void {
    this.cargarBorradorDeStorage();
  }

  // ===== MANEJADOR DE EVENTOS =====

  // Manejador de eventos paso 1
  alCambiarInfoBasica(datos: InfoBasicaData): void {
    const datosActuales = this.datosWizard();
    this.datosWizard.set({
      ...datosActuales,
      infoBasica: datos,
    });
    this.guardarBorradorEnStorage();
  }

  // Manejador de eventos paso 2
  alCambiarConfigAcademica(datos: ConfigAcademicaData): void {
    const datosActuales = this.datosWizard();
    this.datosWizard.set({
      ...datosActuales,
      configAcademica: datos,
    });
    this.guardarBorradorEnStorage();
  }

  alCambiarValidezPaso1(valido: boolean): void {
    this.paso1Valido.set(valido);
  }

  alCambiarValidezPaso2(valido: boolean): void {
    this.paso2Valido.set(valido);
  }

  alCambiarValidezPaso3(valido: boolean): void {
    this.paso3Valido.set(valido);
  }

  alCambiarFechas(fechas: CreateFechaDto[]): void {
    const datosActuales = this.datosWizard();
    this.datosWizard.set({
      ...datosActuales,
      fechas: fechas,
    });
    this.guardarBorradorEnStorage();
  }

  // ===== NAVEGACIÓN =====
  async siguientePaso(): Promise<void> {
    // Validar paso actual antes de avanzar
    if (this.pasoActual() === 1) {
      if (!this.paso1Valido()) {
        this.stepInfoBasica.marcarTodoComoTocado();
        this.toastr.warning('Por favor, completa todos los campos requeridos');
        return;
      }

      const valido = await this.stepInfoBasica.validarCalendarioExistente();
      if (!valido) return;
    }

    if (this.pasoActual() === 2) {
      if (!this.paso2Valido()) {
        this.stepConfigAcademica.marcarTodoComoTocado();
        this.toastr.warning('Por favor, completa todos los campos requeridos');
        return;
      }
    }

    if (this.pasoActual() === 3) {
      if (!this.paso3Valido()) {
        this.toastr.error(
          'Debes agregar al menos la fecha de Inicio del periodo'
        );
        return;
      }
    }

    if (this.pasoActual() < this.TOTAL_PASOS) {
      const datos = this.datosWizard();
      const pasosCompletadosActualizados = [...datos.stepsCompleted];
      pasosCompletadosActualizados[this.pasoActual() - 1] = true;

      this.datosWizard.set({
        ...datos,
        currentStep: datos.currentStep + 1,
        stepsCompleted: pasosCompletadosActualizados,
      });
      this.guardarBorradorEnStorage();
    }
  }

  pasoAnterior(): void {
    if (this.pasoActual() > 1) {
      const datos = this.datosWizard();
      this.datosWizard.set({
        ...datos,
        currentStep: datos.currentStep - 1,
      });
    }
  }

  irAPaso(paso: number): void {
    const datos = this.datosWizard();
    if (paso >= 1 && paso <= this.TOTAL_PASOS) {
      if (paso > 1 && !datos.stepsCompleted[paso - 2]) {
        this.toastr.info('Debes completar los pasos anteriores primero');
        return;
      }

      this.datosWizard.set({
        ...datos,
        currentStep: paso,
      });
    }
  }

  // ===== AUTO-SAVE =====
  private guardarBorradorEnStorage(): void {
    try {
      localStorage.setItem(
        'calendario_draft',
        JSON.stringify(this.datosWizard())
      );
    } catch (error) {
      console.error('Error al guardar borrador:', error);
    }
  }

  private cargarBorradorDeStorage(): void {
    try {
      const borrador = localStorage.getItem('calendario_draft');
      if (borrador) {
        this.datosWizard.set(JSON.parse(borrador));
        this.toastr.info(
          'Se ha cargado un borrador guardado',
          'Borrador encontrado',
          {
            timeOut: 3000,
          }
        );
      }
    } catch (error) {
      console.error('Error al cargar borrador:', error);
    }
  }

  limpiarBorrador(): void {
    localStorage.removeItem('calendario_draft');
  }

  // ===== ACCIONES =====
  guardarBorrador(): void {
    this.guardarBorradorEnStorage();
    this.toastr.success('Borrador guardado correctamente');
  }

  cancel(): void {
    if (
      confirm(
        '¿Estás seguro de cancelar? Se perderán los cambios no guardados.'
      )
    ) {
      this.limpiarBorrador();
      this.router.navigate(['/app/gestion-calendario-academico']);
    }
  }

  submit(): void {
    console.log('Datos a enviar:', this.datosWizard());
    this.toastr.info('Funcionalidad de envío próximamente');
  }
}
