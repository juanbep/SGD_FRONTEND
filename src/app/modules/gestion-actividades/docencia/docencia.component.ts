import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocenciaDirectaComponent } from './docencia-directa/docencia-directa.component';
import { TrabajosDocenciaComponent } from './trabajos-docencia/trabajos-docencia.component';

interface SubTab {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-docencia',
  standalone: true,
  imports: [CommonModule, DocenciaDirectaComponent, TrabajosDocenciaComponent],
  templateUrl: './docencia.component.html',
  styleUrl: './docencia.component.css',
})
export class DocenciaComponent {
  readonly subTabs: SubTab[] = [
    // {
    //   id: 'docencia-directa',
    //   label: 'Docencia Directa',
    //   icon: 'fa-chalkboard',
    // },
    {
      id: 'trabajos-docencia',
      label: 'Trabajos de Docencia',
      icon: 'fa-file-alt',
    },
  ];

  readonly subTabActiva = signal<string>('docencia-directa');

  seleccionarSubTab(id: string): void {
    this.subTabActiva.set(id);
  }
}
