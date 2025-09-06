import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DatePipe, NgIf, NgFor } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-academic-calendar',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, ReactiveFormsModule, RouterLink],
  templateUrl: './view-academic-calendar.component.html',
  styleUrl: './view-academic-calendar.component.css',
})
export class ViewAcademicCalendarComponent implements OnInit {
  calendario: any = null;
  calendarioId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.calendarioId = +idParam;
        this.obtenerCalendarioPorId(this.calendarioId);
      }
    });
  }

  // ====== Cargar calendario ======
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
}
