import { Component, Input } from '@angular/core';
import { CreateCalendarioWizardData } from '../../../models';
import { Utils } from '../../../utils/calendario.utils';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step-revision',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-revision.component.html',
  styleUrl: './step-revision.component.css',
})
export class StepRevisionComponent {
  @Input() datosWizard!: CreateCalendarioWizardData;
  @Input() catalogoNombresFecha: { value: number; label: string }[] = [];

  obtenerNombreFecha(oidNombreFecha: number): string {
    const item = this.catalogoNombresFecha.find(
      (c) => c.value === oidNombreFecha
    );
    return item?.label || 'Desconocido';
  }

  formatearFecha(
    fechaInicial: string,
    fechaFin: string | null,
    oidNombreFecha: number
  ): string {
    return Utils.formatearFecha(fechaInicial, fechaFin, oidNombreFecha);
  }

  obtenerBadgeClass(estado: string): string {
    return Utils.getBadgeClass(estado);
  }

  obtenerIdentificadorCalendario(): string {
    const { anioCalendario, numeroCalendario } = this.datosWizard.infoBasica;
    if (anioCalendario && numeroCalendario) {
      return Utils.formatearAnioPeriodo(anioCalendario, numeroCalendario);
    }
    return 'N/A';
  }

  get totalSemanas(): number {
    const { semanasClase, semanasPreparacion } =
      this.datosWizard.configAcademica;
    return (semanasClase || 0) + (semanasPreparacion || 0);
  }

  get totalHoras(): number {
    const config = this.datosWizard.configAcademica;
    return (
      (config.horasPlanta || 0) +
      (config.horasCatedra || 0) +
      (config.horasOcasionales || 0) +
      (config.horasBecarioPracticante || 0)
    );
  }
}
