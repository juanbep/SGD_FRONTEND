import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';

interface TabPrincipal {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-gestion-actividades',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './gestion-actividades.component.html',
  styleUrl: './gestion-actividades.component.css',
})
export class GestionActividadesComponent {
  readonly tabsPrincipales: TabPrincipal[] = [
    { label: 'Docencia', route: 'docencia', icon: 'fa-chalkboard-teacher' },
    { label: 'Investigación', route: 'investigacion', icon: 'fa-flask' },
    { label: 'Administración', route: 'administracion', icon: 'fa-briefcase' },
    { label: 'Asesoría', route: 'asesoria', icon: 'fa-user-tie' },
    { label: 'Servicios', route: 'servicios', icon: 'fa-hands-helping' },
    { label: 'Extensión', route: 'extension', icon: 'fa-expand-arrows-alt' },
    { label: 'Capacitación', route: 'capacitacion', icon: 'fa-graduation-cap' },
    {
      label: 'Otros Servicios',
      route: 'otros-servicios',
      icon: 'fa-ellipsis-h',
    },
  ];
}
