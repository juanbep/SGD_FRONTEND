import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ModalEstadisticasComponent } from '../../components/modal-estadisticas/modal-estadisticas.component';
import { getUserDepartmentId } from '../../../auth/utils/user-storage.utils';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CalendarioHelperService } from '../../../academic-calendar-management/services';

@Component({
  selector: 'app-estadisticas-page',
  standalone: true,
  imports: [CommonModule, ModalEstadisticasComponent],
  templateUrl: './estadisticas-page.component.html',
  styleUrl: './estadisticas-page.component.css',
})
export class EstadisticasPageComponent implements OnInit {
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private calendarioHelper = inject(CalendarioHelperService);

  modalVisible: boolean = false;
  calendarios: any[] = [];
  oidDepartamentoUsuario: number | null = null;

  async ngOnInit(): Promise<void> {
    await this.cargarDatos();
    this.modalVisible = true;
  }

  private async cargarDatos(): Promise<void> {
    try {
      // Obtener el oidDepartamento del usuario logueado
      this.oidDepartamentoUsuario = getUserDepartmentId();

      // Validar que se obtuvo el departamento
      if (!this.oidDepartamentoUsuario || this.oidDepartamentoUsuario === 0) {
        this.toastr.error('No se pudo obtener el departamento del usuario');
        this.router.navigate(['/app/home']);
        return;
      }

      // Cargar los calendarios en formato dropdown
      this.calendarios = await this.calendarioHelper.getAllForDropdown();

      // Validar que hay calendarios disponibles
      if (this.calendarios.length === 0) {
        this.toastr.warning('No hay calendarios disponibles');
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.toastr.error('Error al cargar los datos necesarios');
      this.router.navigate(['/app/home']);
    }
  }

  cerrarModal(): void {
    this.modalVisible = false;
    // Navega de regreso al dashboard o página anterior
    this.router.navigate(['/app/home']);
  }
}
