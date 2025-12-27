import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CrearIndividualComponent } from './crear-individual/crear-individual.component';
import { CrearLoteComponent } from './crear-lote/crear-lote.component';

type TabActivo = 'individual' | 'lote';

@Component({
  selector: 'app-crear-necesidades-desde-plan',
  standalone: true,
  imports: [CommonModule, CrearIndividualComponent, CrearLoteComponent],
  templateUrl: './crear-necesidades-desde-plan.component.html',
  styleUrl: './crear-necesidades-desde-plan.component.css',
})
export class CrearNecesidadesDesdePlanComponent implements OnInit {
  // ===== SERVICIOS =====
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  // ===== PARÁMETROS DE RUTA =====
  oidPlan: number = 0;
  oidCalendario: number = 0;

  // ===== TABS =====
  activeTab: TabActivo = 'individual';

  ngOnInit(): void {
    this.obtenerParametrosRuta();
  }

  // ===== OBTENER PARÁMETROS DE RUTA =====
  private obtenerParametrosRuta(): void {
    this.route.params.subscribe((params) => {
      this.oidPlan = Number(params['oidPlan']);
      this.oidCalendario = Number(params['oidCalendario']);

      if (!this.oidPlan || !this.oidCalendario) {
        this.toastr.error(
          'Parámetros de navegación inválidos',
          'Error de navegación'
        );
        this.volverALista();
        return;
      }
    });
  }

  // ===== CAMBIAR TAB =====
  cambiarTab(tab: TabActivo): void {
    this.activeTab = tab;
  }

  // ===== NAVEGACIÓN =====
  volverALista(): void {
    this.router.navigate(['/app/gestion-necesidades/management']);
  }
}
