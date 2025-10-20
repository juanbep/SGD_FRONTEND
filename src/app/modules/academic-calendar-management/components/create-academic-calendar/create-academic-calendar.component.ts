import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreateCalendarioWizardData, INITIAL_WIZARD_DATA } from '../../models';

@Component({
  selector: 'app-create-academic-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-academic-calendar.component.html',
  styleUrl: './create-academic-calendar.component.css',
})
export class CreateAcademicCalendarComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  // ===== SIGNALS =====
  readonly wizardData = signal<CreateCalendarioWizardData>(
    structuredClone(INITIAL_WIZARD_DATA)
  );
  readonly estadoActual = computed(() => this.wizardData().estadoActual);
  readonly esUltimoEstado = computed(() => this.estadoActual() === 4);
  readonly esPrimerEstado = computed(() => this.estadoActual() === 1);

  // ===== CONSTANTES =====
  readonly TOTAL_ESTADOS = 4;
  readonly ESTADO_TITULOS = [
    'Información Básica',
    'Configuración Académica',
    'Fechas del Calendario',
    'Revisión y Confirmación',
  ];

  ngOnInit(): void {
    this.cargarBorradorLocalStorage();
  }

  // ===== NAVEGACIÓN =====
  siguienteEstado(): void {
    if (this.estadoActual() < this.TOTAL_ESTADOS) {
      const data = this.wizardData();
      this.wizardData.set({
        ...data,
        estadoActual: data.estadoActual + 1,
      });
      this.guardarBorradorLocalStorage();
    }
  }

  estadoPrevio(): void {
    if (this.estadoActual() > 1) {
      const data = this.wizardData();
      this.wizardData.set({
        ...data,
        estadoActual: data.estadoActual - 1,
      });
    }
  }

  irSiguienteEstado(step: number): void {
    // Permitir navegar solo a pasos ya visitados o siguiente
    if (
      step >= 1 &&
      step <= this.estadoActual() + 1 &&
      step <= this.TOTAL_ESTADOS
    ) {
      const data = this.wizardData();
      this.wizardData.set({
        ...data,
        estadoActual: step,
      });
    }
  }

  // ===== AUTO-SAVE =====
  private guardarBorradorLocalStorage(): void {
    try {
      localStorage.setItem(
        'calendario_copia',
        JSON.stringify(this.wizardData())
      );
    } catch (error) {
      console.error('Error al guardar borrador:', error);
    }
  }

  private cargarBorradorLocalStorage(): void {
    try {
      const draft = localStorage.getItem('calendario_copia');
      if (draft) {
        this.wizardData.set(JSON.parse(draft));
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

  limpiarLocalStorage(): void {
    localStorage.removeItem('calendario_copia');
  }

  // ===== ACCIONES =====
  guardarCopia(): void {
    this.guardarBorradorLocalStorage();
    this.toastr.success('Borrador guardado correctamente');
  }

  cancelar(): void {
    if (
      confirm(
        '¿Estás seguro de cancelar? Se perderán los cambios no guardados.'
      )
    ) {
      this.limpiarLocalStorage();
      this.router.navigate(['/app/gestion-calendario-academico']);
    }
  }

  submit(): void {
    // TODO: Implementar lógica de envío
    console.log('Datos a enviar:', this.wizardData());
    this.toastr.info('Funcionalidad de envío próximamente');
  }
}
