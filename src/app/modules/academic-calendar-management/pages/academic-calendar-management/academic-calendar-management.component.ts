import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CalendarioAcademico } from '../../../../core/models/base/calendario-academico.model';

@Component({
  selector: 'app-academic-calendar-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './academic-calendar-management.component.html',
  styleUrl: './academic-calendar-management.component.css',
})
export class AcademicCalendarManagementComponent {
  calendarioVigente: CalendarioAcademico | null = null;
  historialCalendarios: CalendarioAcademico[] = [];

  constructor(private router: Router) {}

  goToCreate() {
    this.router.navigate(['/gestion-calendario-academico/crear']);
  }

  ngOnInit(): void {
    // Mock calendario vigente
    this.calendarioVigente = {
      acuerdoAcademico: '030 de 2025',
      id: 165448786542,
      anio: 2025,
      periodo: '2025-1',
      estado: 'ACTIVO',
      eventos: [],
    };

    // Mock historial
    this.historialCalendarios = [
      {
        acuerdoAcademico: '030 de 2024',
        id: 365498798131,
        anio: 2024,
        periodo: '2024-2',
        estado: 'DESHABILITADO',
        eventos: [],
      },
      {
        acuerdoAcademico: '020 de 2024',
        id: 987541236584,
        anio: 2024,
        periodo: '2024-1',
        estado: 'DESHABILITADO',
        eventos: [],
      },
    ];
  }
}
