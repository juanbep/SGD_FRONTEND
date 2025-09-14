import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Calendario } from '../../models';
import { CalendarioService } from '../../services/calendario.service';

@Component({
  selector: 'app-view-academic-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-academic-calendars.component.html',
  styleUrl: './view-academic-calendars.component.css',
})
export class ViewAcademicCalendarsComponent implements OnInit {
  calendarios: Calendario[] = [];
  loading = false;
  error: string | null = null;

  // Paginación
  page = 0;
  size = 10;
  totalElements = 0;

  constructor(private calendarioService: CalendarioService) {}

  ngOnInit(): void {
    this.cargarCalendarios();
  }

  cargarCalendarios(): void {
    this.loading = true;
    this.error = null;

    this.calendarioService.obtenerCalendarios(this.page, this.size).subscribe({
      next: (response) => {
        console.log('Response:', response); // debugging inicial
        this.calendarios = response.data.content;
        this.totalElements = response.data.totalElements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar calendarios:', error);
        this.error = 'Error al cargar los calendarios. Intenta de nuevo.';
        this.loading = false;
      },
    });
  }

  // Método para reintentar en caso de error
  reintentar(): void {
    this.cargarCalendarios();
  }

  // Placeholder para paginación futura
  cambiarPagina(nuevaPagina: number): void {
    this.page = nuevaPagina;
    this.cargarCalendarios();
  }
}
