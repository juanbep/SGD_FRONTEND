import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CalendarioService } from '../../services/calendario.service';
import { Calendario, ActualizarCalendario } from '../../models';

@Component({
  selector: 'app-update-academic-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './update-academic-calendar.component.html',
  styleUrl: './update-academic-calendar.component.css',
})
export class UpdateAcademicCalendarComponent implements OnInit {
  loading = false;
  loadingData = false;

  // Datos
  calendario: Calendario | null = null;
  calendarioId: number | null = null;

  constructor(
    private calendarioService: CalendarioService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.obtenerIdDeRuta();
    if (this.calendarioId) {
      this.cargarCalendario();
    }
  }

  private obtenerIdDeRuta(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.calendarioId = id ? parseInt(id, 10) : null;

    if (!this.calendarioId) {
      this.toastr.error('ID de calendario inválido');
      this.navegarALista();
    }
  }

  private cargarCalendario(): void {
    if (!this.calendarioId) return;

    this.loadingData = true;

    this.calendarioService.obtenerCalendarioPorId(this.calendarioId).subscribe({
      next: (response) => {
        this.calendario = response.data;
        this.loadingData = false;
      },
      error: (error) => {
        console.error('Error cargando calendario:', error);
        this.loadingData = false;
        this.toastr.error(
          error?.error?.mensaje || 'No se pudo cargar el calendario'
        );
      },
    });
  }

  // Método principal para actualizar
  actualizarCalendario(calendarioData: ActualizarCalendario): void {
    if (!this.calendarioId) {
      this.toastr.error('ID de calendario requerido');
      return;
    }

    this.loading = true;

    console.log('Actualizando calendario:', calendarioData);

    this.calendarioService
      .actualizarCalendario(this.calendarioId, calendarioData)
      .subscribe({
        next: (response) => {
          console.log('Calendario actualizado:', response);
          this.toastr.success(
            response.mensaje || 'Calendario actualizado correctamente'
          );
          this.calendario = response.data; // Actualizar datos locales
          this.loading = false;
        },
        error: (error) => {
          console.error('Error actualizando calendario:', error);
          this.loading = false;
          this.toastr.error(
            error?.error?.mensaje || 'Error al actualizar el calendario'
          );
        },
      });
  }

  // Método para validar y actualizar
  validarYActualizar(formData: any): void {
    const calendarioData: ActualizarCalendario = {
      anioCalendario: formData.anioCalendario?.toString(),
      estado: formData.estado,
      semanasClase: formData.semanasClase,
      numeroCalendario: formData.numeroCalendario,
      observacion: formData.observacion || '',
    };

    // Remover propiedades undefined/null
    Object.keys(calendarioData).forEach((key) => {
      if (
        calendarioData[key as keyof ActualizarCalendario] === undefined ||
        calendarioData[key as keyof ActualizarCalendario] === null
      ) {
        delete calendarioData[key as keyof ActualizarCalendario];
      }
    });

    this.actualizarCalendario(calendarioData);
  }

  // Navegación
  navegarALista(): void {
    this.router.navigate(['/calendario-academico/listar']);
  }

  cancelar(): void {
    this.navegarALista();
  }

  // Getters para template
  get puedeActualizar(): boolean {
    return !this.loading && !this.loadingData && !!this.calendario;
  }

  get mostrarSpinner(): boolean {
    return this.loading || this.loadingData;
  }
}
