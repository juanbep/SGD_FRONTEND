import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-academic-calendar-management',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './academic-calendar-management.component.html',
  styleUrl: './academic-calendar-management.component.css',
})
export class AcademicCalendarManagementComponent {
  calendarioVigente: any = null;
  historialCalendarios: any[] = [];
  calendariosEnEspera: any[] = [];

  isLoading: boolean = false;
  calendarioSeleccionadoId!: number;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getCalendarios();
  }

  /**
   * TODO: Refactorizar estos métodos y moverlos a una clase "servicios"
   */

  getCalendarios(): void {
    this.isLoading = true;

    this.http
      .get<any>('http://localhost:8090/sgd-back/api/calendarios')
      .subscribe({
        next: (response) => {
          const calendarios = response?.data?.content || [];

          this.calendarioVigente = null;
          this.historialCalendarios = [];
          this.calendariosEnEspera = [];

          calendarios.forEach((cal: any) => {
            const calendario: any = {
              id: cal.oidcalendario,
              anioCalendario: cal.anioCalendario,
              numeroCalendario: cal.numeroCalendario,
              semanasClase: cal.semanasClase,
              semanasPreparacion: cal.semanasPreparacion,
              horasTotales: cal.horasTotales,
              fechaCreacion: cal.fechaCreacion,
              usuarioCreacion: cal.usuarioCreacion,
              fechaActualizacion: cal.fechaActualizacion,
              usuarioActualizacion: cal.usuarioActualizacion,
              estado: cal.estado,
              observacion: cal.observacion,
              fechas: cal.fechas,
            };

            switch (cal.estado) {
              case 'ACTIVO':
                this.calendarioVigente = calendario;
                break;
              case 'DESHABILITADO':
                this.historialCalendarios.push(calendario);
                break;
              case 'PENDIENTE':
              case 'APROBADO':
                this.calendariosEnEspera.push(calendario);
                break;
            }
          });

          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error al cargar calendarios:', err);
        },
      });
  }

  eliminarCalendario(id: number): void {
    const confirmado = confirm(
      '¿Estás seguro de eliminar este calendario? Esta acción no se puede deshacer.'
    );

    if (confirmado) {
      const endpoint = `http://localhost:8090/sgd-back/api/calendarios/${id}`;

      this.http.delete(endpoint).subscribe({
        next: () => {
          alert('Calendario eliminado correctamente.');
          this.getCalendarios(); // Recargar las tablas
        },
        error: (error) => {
          console.error('Error al eliminar calendario:', error);
          alert('Ocurrió un error al intentar eliminar el calendario.');
        },
      });
    }
  }

  formatearAnioPeriodo(anio: number, periodo: number | null): string {
    if (!periodo) {
      return `${anio}-Sin información`;
    }
    return `${anio}-${periodo}`;
  }
}
