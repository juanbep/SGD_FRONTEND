import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ModalEstadisticasComponent } from '../../components/modal-estadisticas/modal-estadisticas.component';
import {
  getUserDepartmentId,
  getUserRoles,
  isUserDataAvailable,
} from '../../../auth/utils/user-storage.utils';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CalendarioHelperService } from '../../../gestion-calendarios/services';
import { DepartamentoHelperService } from '../../../gestion-planes/services';

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
  private departamentoHelper = inject(DepartamentoHelperService);

  modalVisible: boolean = false;
  calendarios: any[] = [];
  departamentos: any[] = [];
  oidDepartamentoUsuario: number | null = null;
  rolEspecial: boolean = false;

  async ngOnInit(): Promise<void> {
    this.verificarRolesEspeciales();
    await this.cargarDatos();
    this.modalVisible = true;
  }

  private verificarRolesEspeciales(): void {
    if (!isUserDataAvailable()) {
      this.rolEspecial = false;
      return;
    }

    const roles = getUserRoles();
    const rolesEspeciales = [
      'SECRETARIA/O FACULTAD',
      'SECRETARIO',
      'SECRETARIA',
      'DECANO',
    ];

    this.rolEspecial = roles.some((rol) => rolesEspeciales.includes(rol));
  }

  private async cargarDatos(): Promise<void> {
    try {
      // Obtener el oidDepartamento del usuario logueado
      this.oidDepartamentoUsuario = getUserDepartmentId();

      // Solo validar departamento si NO es un rol especial
      if (
        !this.rolEspecial &&
        (!this.oidDepartamentoUsuario || this.oidDepartamentoUsuario === 0)
      ) {
        this.toastr.error('No se pudo obtener el departamento del usuario');
        this.router.navigate(['/app/home']);
        return;
      }

      // Cargar los calendarios
      this.calendarios = await this.calendarioHelper.getAllForDropdown();

      // Validar que hay calendarios disponibles
      if (this.calendarios.length === 0) {
        this.toastr.warning('No hay calendarios disponibles');
      }

      // Cargar departamentos solo si es rol especial
      if (this.rolEspecial) {
        this.departamentos = await this.departamentoHelper.getAllForDropdown();

        if (this.departamentos.length === 0) {
          this.toastr.warning('No hay departamentos disponibles');
        }
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
