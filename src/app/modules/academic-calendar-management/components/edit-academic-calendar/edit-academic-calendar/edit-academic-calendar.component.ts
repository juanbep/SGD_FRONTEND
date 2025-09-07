import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DatePipe, NgIf, NgFor } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-academic-calendar',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    DatePipe,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './edit-academic-calendar.component.html',
  styleUrl: './edit-academic-calendar.component.css',
})
export class EditAcademicCalendarComponent {
  calendario: any = null;
  calendarioId: number | null = null;

  modoEdicion: boolean = false;
  backupCalendario: any;
  estadosDisponibles: string[] = [
    'ACTIVO',
    'APROBADO',
    'PENDIENTE',
    'DESHABILITADO',
  ]; //ESTADOS DE UN CALENDARIO

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.calendarioId = +idParam;
        this.obtenerCalendarioPorId(this.calendarioId);
      }
    });
  }

  // ====== Cargar calendario por id ======
  obtenerCalendarioPorId(id: number): void {
    const url = `http://localhost:8090/sgd-back/api/calendarios/${id}`;
    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.codigo === 200 && response.data) {
          this.calendario = response.data;
        } else {
          console.error('Calendario no encontrado o sin datos válidos');
        }
      },
      error: (error) => {
        console.error('Error al obtener el calendario:', error);
      },
    });
  }

  activarModoEdicion() {
    this.backupCalendario = structuredClone(this.calendario); // copia profunda
    this.modoEdicion = true;
    console.log(this.backupCalendario)
  }

  cancelarEdicionCalendario() {
    this.calendario = structuredClone(this.backupCalendario);
    this.modoEdicion = false;
    console.log(this.backupCalendario)
  }

  guardarCambiosCalendario() {}
}
