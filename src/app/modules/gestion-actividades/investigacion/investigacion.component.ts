import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProyectosInvestigacionComponent } from './proyectos-investigacion/proyectos-investigacion.component';
import { SemillerosInvestigacionComponent } from './semilleros-investigacion/semilleros-investigacion.component';
import { TrabajosInvestigacionComponent } from './trabajos-investigacion/trabajos-investigacion.component';

interface SubTab {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-investigacion',
  standalone: true,
  imports: [
    CommonModule,
    ProyectosInvestigacionComponent,
    SemillerosInvestigacionComponent,
    TrabajosInvestigacionComponent,
  ],
  templateUrl: './investigacion.component.html',
  styleUrl: './investigacion.component.css',
})
export class InvestigacionComponent {
  readonly subTabs: SubTab[] = [
    {
      id: 'proyectos',
      label: 'Proyectos de Investigación',
      icon: 'fa-project-diagram',
    },
    {
      id: 'semilleros',
      label: 'Semilleros de Investigación',
      icon: 'fa-users',
    },
    { id: 'trabajos', label: 'Trabajos de Investigación', icon: 'fa-file-alt' },
  ];

  readonly subTabActiva = signal<string>('proyectos');

  seleccionarSubTab(id: string): void {
    this.subTabActiva.set(id);
  }
}
