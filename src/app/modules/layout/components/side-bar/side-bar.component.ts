import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'layout-side-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  public sidebarItems = [
    {
      label: 'Evaluación Docente', 
      icon: 'assets/icons/sidebar/icon-evaluation.svg', 
      sub: [
        {
          label:'Mis actividades',
          url: '/app/gestion-soportes'
        },
        {
          label:'Mis responsabilidades',
          url: ''
        },
        {
          label:'Consolidado',
          url:''
        },
        {
          label:'CPD',
          url:''
        },
        {
          label:'Resolución',
          url:'',
        }
      ]
    },

    // { label: '', icon: '', url: '' },
    // { label: '', icon: '', url: '' }
  ]
}
