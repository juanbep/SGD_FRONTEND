import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CalendarioService } from '../../services/calendario.service';
import { CrearCalendario } from '../../models';

@Component({
  selector: 'app-create-academic-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-academic-calendar.component.html',
  styleUrl: './create-academic-calendar.component.css',
})
export class CreateAcademicCalendarComponent {
  loading = false;

  constructor(
    private calendarioService: CalendarioService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  // Método principal para crear calendario
  crearCalendario(calendarioData: CrearCalendario): void {
    this.loading = true;

    console.log('Creando calendario:', calendarioData); // Debug

    this.calendarioService.crearCalendario(calendarioData).subscribe({
      next: (response) => {
        console.log('Calendario creado exitosamente:', response);
        this.toastr.success(
          response.mensaje || 'Calendario creado correctamente'
        );
        this.loading = false;

        // Opcional: Navegar a la lista después de crear
        // this.navegarALista();
      },
      error: (error) => {
        console.error('Error creando calendario:', error);
        this.loading = false;
        this.toastr.error(
          error?.error?.mensaje || 'Error al crear el calendario'
        );
      },
    });
  }

  // Método para validar datos antes de enviar
  validarYCrear(formData: any): void {
    const calendarioData: CrearCalendario = {
      anioCalendario: formData.anioCalendario?.toString() || '',
      numeroCalendario: formData.numeroCalendario || 0,
      observacion: formData.observacion || '',
    };

    // Validaciones básicas
    if (!this.validarDatos(calendarioData)) {
      return;
    }

    this.crearCalendario(calendarioData);
  }

  // Validaciones locales
  private validarDatos(data: CrearCalendario): boolean {
    if (!data.anioCalendario.trim()) {
      this.toastr.warning('El año del calendario es requerido');
      return false;
    }

    if (!data.numeroCalendario || data.numeroCalendario <= 0) {
      this.toastr.warning('El número del calendario debe ser mayor a 0');
      return false;
    }

    return true;
  }

  // Navegación
  navegarALista(): void {
    this.router.navigate(['/calendario-academico/listar']); // Ajusta la ruta
  }

  cancelar(): void {
    this.navegarALista();
  }

  // Getters para el template
  get puedeCrear(): boolean {
    return !this.loading;
  }

  get mostrarSpinner(): boolean {
    return this.loading;
  }
}
