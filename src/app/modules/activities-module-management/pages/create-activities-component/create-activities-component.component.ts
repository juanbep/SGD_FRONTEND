import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  inject,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActividadHelperService } from '../../services/actividades/actividad-helper.service';
import { StepInfoBasicaComponent } from './steps/step-info-basica/step-info-basica.component';
import {
  CreateActividadWizardData,
  DetallesTemporalesData,
  InfoBasicaData,
  INITIAL_WIZARD_DATA,
} from '../../models/create-actividad-wizard.model';
import { CreateActividadDTO, CreateAtributoDTO } from '../../models';
import { StepDetallesTemporalesComponent } from './steps/step-detalles-temporales/step-detalles-temporales.component';
import { StepAtributosComponent } from './steps/step-atributos/step-atributos.component';
import { StepAsignarUsuariosComponent } from './steps/step-asignar-usuarios/step-asignar-usuarios.component';
import { StepperActivitiesComponent } from './steps/stepper-activities/stepper-activities.component';

@Component({
  selector: 'app-create-activities-component',
  standalone: true,
  imports: [
    CommonModule,
    StepInfoBasicaComponent,
    StepDetallesTemporalesComponent,
    StepAtributosComponent,
    StepAsignarUsuariosComponent,
    StepperActivitiesComponent,
  ],
  templateUrl: './create-activities-component.component.html',
  styleUrl: './create-activities-component.component.css',
})
export class CreateActivitiesComponentComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly actividadHelper = inject(ActividadHelperService);

  @ViewChild(StepInfoBasicaComponent) stepInfoBasica!: StepInfoBasicaComponent;
  @ViewChild(StepDetallesTemporalesComponent)
  stepDetallesTemporales!: StepDetallesTemporalesComponent;
  @ViewChild(StepAtributosComponent) stepAtributos!: StepAtributosComponent;
  @ViewChild(StepAsignarUsuariosComponent)
  stepAsignarUsuarios!: StepAsignarUsuariosComponent;

  // ===== SIGNALS =====
  readonly datosWizard = signal<CreateActividadWizardData>(
    structuredClone(INITIAL_WIZARD_DATA)
  );
  readonly pasoActual = computed(() => this.datosWizard().currentStep);
  readonly esUltimoPaso = computed(() => this.pasoActual() === 5);
  readonly esPrimerPaso = computed(() => this.pasoActual() === 1);

  // Todos los pasos son opcionales temporalmente
  readonly paso1Valido = signal<boolean>(true); // Asignar Usuarios (opcional)
  readonly paso2Valido = signal<boolean>(true); // Info Básica (opcional temporalmente)
  readonly paso3Valido = signal<boolean>(true); // Detalles Temporales (opcional temporalmente)
  readonly paso4Valido = signal<boolean>(true); // Atributos (opcional)
  readonly enviandoDatos = signal<boolean>(false);

  // ===== CONSTANTES =====
  readonly TOTAL_PASOS = 5;
  readonly TITULOS_PASOS = [
    'Asignar Usuarios', // Paso 1 (antes era paso 4)
    'Información Básica', // Paso 2 (antes era paso 1)
    'Detalles Temporales', // Paso 3 (antes era paso 2)
    'Atributos Dinámicos', // Paso 4 (antes era paso 3)
    'Revisión y Confirmación', // Paso 5 (sin cambios)
  ];

  ngOnInit(): void {
    this.cargarBorradorDeStorage();
  }

  ngOnDestroy(): void {
    // Limpiar listeners si los hay
  }

  // ===== MANEJADORES DE EVENTOS =====

  alCambiarInfoBasica(datos: InfoBasicaData): void {
    const datosActuales = this.datosWizard();
    this.datosWizard.set({
      ...datosActuales,
      infoBasica: datos,
    });
    this.guardarBorradorEnStorage();
  }

  alCambiarDetallesTemporales(datos: DetallesTemporalesData): void {
    const datosActuales = this.datosWizard();
    this.datosWizard.set({
      ...datosActuales,
      detallesTemporales: datos,
    });
    this.guardarBorradorEnStorage();
  }

  alCambiarAtributos(atributos: CreateAtributoDTO[]): void {
    const datosActuales = this.datosWizard();
    this.datosWizard.set({
      ...datosActuales,
      atributos: atributos,
    });
    this.guardarBorradorEnStorage();
  }

  alCambiarUsuarios(idsUsuarios: number[]): void {
    this.datosWizard.update((datos) => ({
      ...datos,
      usuarios: idsUsuarios,
    }));
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

  alCambiarValidezPaso4(valido: boolean): void {
    this.paso4Valido.set(valido);
  }

  // ===== NAVEGACIÓN =====

  async siguientePaso(): Promise<void> {
    // Temporalmente: Sin validaciones, todos los pasos son opcionales

    // Marcar como tocado para efectos visuales
    if (this.pasoActual() === 1) {
      this.stepAsignarUsuarios.marcarTodoComoTocado();
    }

    if (this.pasoActual() === 2) {
      this.stepInfoBasica.marcarTodoComoTocado();
    }

    if (this.pasoActual() === 3) {
      this.stepDetallesTemporales.marcarTodoComoTocado();
    }

    if (this.pasoActual() === 4) {
      this.stepAtributos.marcarTodoComoTocado();
    }

    // Avanzar paso
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

  // ===== CREAR ACTIVIDAD =====

  async enviar(): Promise<void> {
    if (this.enviandoDatos()) return;

    if (!confirm('¿Estás seguro de crear esta actividad académica?')) {
      return;
    }

    this.enviandoDatos.set(true);

    try {
      const actividadCreada = await this.crearActividad();

      if (!actividadCreada) {
        throw new Error('No se pudo crear la actividad');
      }

      this.limpiarBorrador();
      this.toastr.success(
        'La actividad ha sido creada exitosamente',
        '¡Éxito!',
        { timeOut: 5000 }
      );

      setTimeout(() => {
        this.router.navigate(['/actividades/gestionar']);
      }, 1500);
    } catch (error: any) {
      console.error('Error al crear actividad:', error);
      const mensaje = error?.error?.mensaje || 'Error al crear la actividad';
      this.toastr.error(mensaje, 'Error');
    } finally {
      this.enviandoDatos.set(false);
    }
  }

  private async crearActividad(): Promise<any> {
    const datos = this.datosWizard();

    const createDto: CreateActividadDTO = {
      oidTipoActividad: datos.infoBasica.oidTipoActividad!,
      nombreActividad: datos.infoBasica.nombreActividad,
      oidCargoActividad: datos.infoBasica.oidCargoActividad!,
      oidCalendario: datos.infoBasica.oidCalendario!,
      oidEstadoActividad: datos.detallesTemporales.oidEstadoActividad,
      horas: datos.detallesTemporales.horas || 0,
      semanas: datos.detallesTemporales.semanas || 0,
      oidsUsuarios: datos.usuarios,
      atributos: datos.atributos,
    };

    console.log('Creando actividad:', createDto);

    try {
      const actividad = await this.actividadHelper.create(createDto);
      console.log('Actividad creada:', actividad);
      return actividad;
    } catch (error) {
      console.error('Error al crear actividad:', error);
      throw error;
    }
  }

  // ===== GUARDAR Y SALIR (Creación Rápida) =====

  async guardarYSalir(): Promise<void> {
    // Ahora el paso 2 es Info Básica
    if (!this.paso2Valido()) {
      this.toastr.warning('Debes completar la información básica para guardar');
      return;
    }

    if (
      !confirm(
        '¿Deseas guardar la actividad con los datos actuales?\n\n' +
          'La actividad se creará con estado INCOMPLETA.\n' +
          'Podrás completar los datos restantes más tarde.'
      )
    ) {
      return;
    }

    this.enviandoDatos.set(true);

    try {
      const datos = this.datosWizard();
      const createDto: CreateActividadDTO = {
        oidTipoActividad: datos.infoBasica.oidTipoActividad!,
        nombreActividad: datos.infoBasica.nombreActividad,
        oidCargoActividad: datos.infoBasica.oidCargoActividad!,
        oidCalendario: datos.infoBasica.oidCalendario!,
        oidEstadoActividad: 3, // INCOMPLETA
        horas: 0,
        semanas: 0,
        oidsUsuarios: datos.usuarios, // Incluir usuarios del paso 1
        atributos: [],
      };

      const actividad = await this.actividadHelper.create(createDto);

      if (!actividad) {
        throw new Error('No se pudo crear la actividad');
      }

      this.limpiarBorrador();
      this.toastr.success('Actividad guardada como INCOMPLETA', '¡Éxito!');

      setTimeout(() => {
        this.router.navigate(['/actividades/gestionar']);
      }, 1500);
    } catch (error: any) {
      console.error('Error:', error);
      const mensaje = error?.error?.mensaje || 'Error al guardar la actividad';
      this.toastr.error(mensaje, 'Error');
    } finally {
      this.enviandoDatos.set(false);
    }
  }

  // ===== AUTO-SAVE =====

  private guardarBorradorEnStorage(): void {
    try {
      localStorage.setItem(
        'actividad_draft',
        JSON.stringify(this.datosWizard())
      );
    } catch (error) {
      console.error('Error al guardar borrador:', error);
    }
  }

  private cargarBorradorDeStorage(): void {
    try {
      const borrador = localStorage.getItem('actividad_draft');
      if (borrador) {
        this.datosWizard.set(JSON.parse(borrador));
        this.toastr.info(
          'Se ha cargado un borrador guardado',
          'Borrador encontrado',
          { timeOut: 3000 }
        );
      }
    } catch (error) {
      console.error('Error al cargar borrador:', error);
    }
  }

  limpiarBorrador(): void {
    localStorage.removeItem('actividad_draft');
  }

  guardarBorradorManual(): void {
    this.guardarBorradorEnStorage();
    this.toastr.success('Borrador guardado correctamente', 'Guardado');
  }

  // ===== ACCIONES =====

  cancelar(): void {
    if (
      confirm(
        '¿Estás seguro de cancelar? Se perderán los cambios no guardados.'
      )
    ) {
      this.limpiarBorrador();
      this.router.navigate(['/actividades/gestionar']);
    }
  }
}
