import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActividadesService } from '../../services/actividades/actividades.service';
import { TiposActividadHelperService } from '../../services/tiposActividades/tipos-actividad-helper.service';
import { CreateActividadDTO } from '../../models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-activities-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-activities-component.component.html',
  styleUrl: './create-activities-component.component.css',
})
export class CreateActivitiesComponentComponent implements OnInit {
  private actividadService = inject(ActividadesService);
  private tiposHelper = inject(TiposActividadHelperService);
  private toastr = inject(ToastrService);

  tiposDisponibles: { value: number; label: string }[] = [];
  selectedTipo: number | null = null;

  async ngOnInit(): Promise<void> {
    // Cargar tipos de actividad para el dropdown
    this.tiposDisponibles = await this.tiposHelper.getAllForDropdown();
  }

  loading = false;

  actividadData: CreateActividadDTO = {
    oidTipoActividad: 1,
    oidCargoActividad: 1,
    oidEstadoActividad: 2,
    nombreActividad: '',
    horas: 0,
    semanas: 0,
    oidCalendario: 1,
    oidsUsuarios: [1, 2],
    atributos: [
      { nombre: 'SEMESTRE', tipo: 'VARCHAR', valor: '2024-2' },
      { nombre: 'NOMBREESTUDIANTE', tipo: 'VARCHAR', valor: 'Carlos Perez' },
    ],
  };

  onSubmit(): void {
    if (this.loading) return;

    this.loading = true;

    this.actividadService.createActividad(this.actividadData).subscribe({
      next: (response) => {
        if (response.codigo === 200 || response.codigo === 201) {
          this.toastr.success(
            response.mensaje || 'Actividad creada exitosamente'
          );
          this.resetForm();
        } else {
          this.toastr.warning(
            response.mensaje || 'Respuesta inesperada del servidor'
          );
        }
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(
          'Error al crear actividad',
          error.message || 'Error desconocido'
        );
        this.loading = false;
      },
    });
  }

  private resetForm(): void {
    this.actividadData = {
      ...this.actividadData,
      nombreActividad: '',
      horas: 0,
      semanas: 0,
    };
  }
}
