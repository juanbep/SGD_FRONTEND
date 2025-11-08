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
import {
  Calendario,
  CreateCalendarioWizardData,
  CreateFechaDto,
  INITIAL_WIZARD_DATA,
} from '../../models';
import {
  ConfigAcademicaData,
  StepConfigAcademicaComponent,
} from '../../components/create-academic-calendar/step-config-academica/step-config-academica.component';
import { StepFechasComponent } from '../../components/create-academic-calendar/step-fechas/step-fechas.component';
import {
  CalendarioHelperService,
  FechaHelperService,
  NombreFechaHelperService,
} from '../../services';
import { StepRevisionComponent } from '../../components/create-academic-calendar/step-revision/step-revision.component';

@Component({
  selector: 'app-create-academic-calendar',
  standalone: true,
  imports: [
    CommonModule,
    StepperComponent,
    StepInfoBasicaComponent,
    StepConfigAcademicaComponent,
    StepFechasComponent,
    StepRevisionComponent,
  ],
  templateUrl: './create-academic-calendar.component.html',
  styleUrl: './create-academic-calendar.component.css',
})
export class CreateAcademicCalendarComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly calendarioHelper = inject(CalendarioHelperService);
  private readonly fechaHelper = inject(FechaHelperService);
  private readonly nombreFechaHelper = inject(NombreFechaHelperService);

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
  readonly enviandoDatos = signal<boolean>(false);
  readonly catalogoNombresFecha = signal<
    { value: number; label: string; tieneTemplate: boolean }[]
  >([]);

  // ===== NUEVO: Signal para guardar el OID del calendario creado =====
  readonly oidCalendarioCreado = signal<number | null>(null);
  readonly creandoCalendario = signal<boolean>(false);

  // ===== COMPUTED: Habilitar botón "Siguiente" solo si calendario fue creado =====
  readonly puedeAvanzarPaso1 = computed(() => {
    return this.oidCalendarioCreado() !== null;
  });

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
    this.cargarCatalogoNombresFechas();
  }

  ngAfterViewInit(): void {
    window.addEventListener('goToStep', (event: any) => {
      this.irAPaso(event.detail);
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('goToStep', () => {});
  }

  private async cargarCatalogoNombresFechas(): Promise<void> {
    try {
      const catalogo = await this.nombreFechaHelper.getAllForDropdown();
      this.catalogoNombresFecha.set(catalogo);
    } catch (error) {
      console.error('Error al cargar catálogo:', error);
      this.toastr.error('Error al cargar el catálogo de tipos de fecha');
    }
  }

  // ===== NUEVO: CREAR CALENDARIO EN PASO 1 =====
  async alCrearCalendarioPaso1(dto: CreateCalendarioPaso1DTO): Promise<void> {
    // Validar que no exista calendario duplicado
    const valido = await this.stepInfoBasica.validarCalendarioExistente();
    if (!valido) return;

    this.creandoCalendario.set(true);

    try {
      // Crear calendario con los datos del paso 1
      const calendarioCreado = await this.calendarioHelper.create({
        anioCalendario: dto.anioCalendario,
        numeroCalendario: dto.numeroCalendario,
        observacion: dto.observacion,
        // Los demás campos se establecerán en el paso 2
        semanasClase: 0,
        semanasPreparacion: 0,
        horasPlanta: 0,
        horasCatedra: 0,
        horasOcasionales: 0,
        horasBecarioPracticante: 0,
      });

      if (calendarioCreado && calendarioCreado.oidcalendario) {
        // Guardar OID en signal
        this.oidCalendarioCreado.set(calendarioCreado.oidcalendario);

        this.toastr.success(
          `Calendario ${dto.anioCalendario}-${dto.numeroCalendario} creado exitosamente`,
          '¡Éxito!'
        );

        // Actualizar datos del wizard
        const datosActuales = this.datosWizard();
        this.datosWizard.set({
          ...datosActuales,
          infoBasica: dto,
        });

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

  // ===== MANEJADOR DE EVENTOS =====
  alCambiarInfoBasica(datos: InfoBasicaData): void {
    const datosActuales = this.datosWizard();
    this.datosWizard.set({
      ...datosActuales,
      infoBasica: datos,
    });
    this.guardarBorradorEnStorage();
  }

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
    // Paso 1: Validar que el calendario haya sido creado
    if (this.pasoActual() === 1) {
      if (!this.puedeAvanzarPaso1()) {
        this.toastr.warning('Debes crear el calendario antes de continuar');
        return;
      }
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

  enviar(): void {}
}
