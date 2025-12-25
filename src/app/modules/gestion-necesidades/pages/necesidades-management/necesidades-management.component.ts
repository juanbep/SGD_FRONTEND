import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { ListNecesidadesComponent } from '../../components/list-necesidades/list-necesidades.component';

@Component({
  selector: 'app-necesidades-management',
  standalone: true,
  imports: [CommonModule, ListNecesidadesComponent],
  templateUrl: './necesidades-management.component.html',
  styleUrl: './necesidades-management.component.css',
})
export class NecesidadesManagementComponent {
  // ===== SERVICIOS =====
  private toastr = inject(ToastrService);
  private router = inject(Router);

  // ===== ESTADO =====
  loading = false;
  usuarioRol: string = ''; // TODO: Obtener del servicio de autenticación

  ngOnInit(): void {
    this.inicializar();
  }

  inicializar(): void {
    // TODO: Obtener rol del usuario
    // this.usuarioRol = this.authService.getRol();

    // Mostrar mensaje de bienvenida según el rol
    this.mostrarMensajeBienvenida();
  }

  mostrarMensajeBienvenida(): void {
    // TODO: Implementar mensajes personalizados según rol
    // if (this.usuarioRol === 'COORDINADOR') {
    //   this.toastr.info('Vista de coordinador', 'Gestión de Necesidades');
    // }
  }

  // Método para navegar a otras vistas (si se necesita en el futuro)
  navegarAAsignaciones(): void {
    this.router.navigate(['app/gestion-necesidades/asignaciones']);
  }
}
