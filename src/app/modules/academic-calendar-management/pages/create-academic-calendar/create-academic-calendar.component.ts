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
  Calendario,
  CreateCalendarioDTO,
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

  // Escuchar eventos de "Editar" desde el paso 4
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


  // ===== ENVIAR DATOS =====
  async enviar(): Promise<void> {
    if (this.enviandoDatos()) return;

    // Confirmar antes de enviar
    if (!confirm('¿Estás seguro de crear este calendario académico?')) {
      return;
    }

    this.enviandoDatos.set(true);

    try {
      // Crear el calendario
      const calendarioCreado = await this.crearCalendario();

      if (!calendarioCreado) {
        throw new Error('No se pudo crear el calendario');
      }

      // Crear las fechas con el ID del calendario
      if (this.datosWizard().fechas.length > 0) {
        await this.crearFechas(calendarioCreado.oidcalendario);
      }

      // Limpiar borrador y redirigir
      this.limpiarBorrador();
      this.toastr.success(
        'El calendario ha sido creado exitosamente',
        '¡Éxito!',
        { timeOut: 5000 }
      );

      // Redirigir después de 1 segundo
      setTimeout(() => {
        this.router.navigate(['/app/gestion-calendario-academico']);
      }, 1500);
    } catch (error: any) {
      console.error('Error al crear calendario:', error);
      const mensaje = error?.error?.mensaje || 'Error al crear el calendario';
      this.toastr.error(mensaje, 'Error');
    } finally {
      this.enviandoDatos.set(false);
    }
  }

  // ===== CREAR CALENDARIO =====
  private async crearCalendario(): Promise<Calendario | null> {
    const datos = this.datosWizard();

    const createDto: CreateCalendarioDTO = {
      anioCalendario: datos.infoBasica.anioCalendario!,
      numeroCalendario: datos.infoBasica.numeroCalendario!,
      observacion: datos.infoBasica.observacion || '',
      semanasClase: datos.configAcademica.semanasClase!,
      semanasPreparacion: datos.configAcademica.semanasPreparacion!,
      horasPlanta: datos.configAcademica.horasPlanta!,
      horasCatedra: datos.configAcademica.horasCatedra!,
      horasOcasionales: datos.configAcademica.horasOcasionales!,
      horasBecarioPracticante: datos.configAcademica.horasBecarioPracticante!,
    };

    console.log('Creando calendario:', createDto);

    try {
      const calendario = await this.calendarioHelper.create(createDto);
      console.log('Calendario creado:', calendario);
      return calendario;
    } catch (error) {
      console.error('Error al crear calendario:', error);
      throw error;
    }
  }

  // ===== CREAR FECHAS =====
  private async crearFechas(oidCalendario: number): Promise<void> {
    const fechas = this.datosWizard().fechas;

    console.log(
      `Creando ${fechas.length} fechas para calendario ${oidCalendario}`
    );

    // Crear fechas en paralelo
    const promesas = fechas.map((fecha) => {
      const createDto: CreateFechaDto = {
        oidCalendario: oidCalendario, // ID del calendario creado
        oidNombreFecha: fecha.oidNombreFecha,
        uniqueDate: fecha.uniqueDate,
        fechaInicial: fecha.fechaInicial,
        fechaFin: fecha.fechaFin,
        tipo: 'RESALTADAS', // Valor por defecto
      };

      return this.fechaHelper.create(createDto);
    });

    try {
      const resultados = await Promise.all(promesas);
      console.log(`${resultados.length} fechas creadas exitosamente`);
    } catch (error) {
      console.error('Error al crear fechas:', error);
      throw error;
    }
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
