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
  InfoBasicaData,
  INITIAL_WIZARD_DATA,
} from '../../models/create-actividad-wizard.model';
import { CreateActividadDTO } from '../../models';
import { StepperComponent } from './steps/stepper/stepper/stepper.component';

@Component({
  selector: 'app-create-activities-component',
  standalone: true,
  imports: [CommonModule, StepInfoBasicaComponent, StepperComponent],
  templateUrl: './create-activities-component.component.html',
  styleUrl: './create-activities-component.component.css',
})
export class CreateActivitiesComponentComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly actividadHelper = inject(ActividadHelperService);

  @ViewChild(StepInfoBasicaComponent) stepInfoBasica!: StepInfoBasicaComponent;

  // ===== SIGNALS =====
  readonly datosWizard = signal<CreateActividadWizardData>(
    structuredClone(INITIAL_WIZARD_DATA)
  );
  readonly pasoActual = computed(() => this.datosWizard().currentStep);
  readonly esUltimoPaso = computed(() => this.pasoActual() === 5);
  readonly esPrimerPaso = computed(() => this.pasoActual() === 1);
  readonly paso1Valido = signal<boolean>(false);
  readonly paso2Valido = signal<boolean>(false);
  readonly paso3Valido = signal<boolean>(false);
  readonly paso4Valido = signal<boolean>(false);
  readonly enviandoDatos = signal<boolean>(false);

  // ===== CONSTANTES =====
  readonly TOTAL_PASOS = 5;
  readonly TITULOS_PASOS = [
    'Información Básica',
    'Detalles Temporales',
    'Atributos Dinámicos',
    'Asignar Usuarios',
    'Revisión y Confirmación',
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

  alCambiarValidezPaso1(valido: boolean): void {
    this.paso1Valido.set(valido);
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
    if (!this.paso1Valido()) {
      this.toastr.warning('Debes completar el paso 1 para guardar');
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
        oidsUsuarios: [],
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
