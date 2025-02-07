import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
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
export class SideBarComponent implements OnInit {
  public isSidebarActive: boolean = true;
  public sidebarItems = [
    {
      label: 'Periodo académico',
      icon: 'assets/icons/sidebar/icon-calendar.svg',
      sub:[
        {
          label: 'Gestión periodo académico',
          url: '/app/gestion-periodo-academico'
        }
      ]
    },
    {
      label: 'Gestion usuarios',
      icon: 'assets/icons/sidebar/icon-user.svg',
      sub: [
        {
          label: 'Usuarios',
          url: '/app/gestion-usuarios/usuarios'
        },
        {
          label: 'Actividades',
          url: '/app/gestion-usuarios/actividades/usuarios'
        }
      ]
    },
    {
      label: 'Evaluación Docente', 
      icon: 'assets/icons/sidebar/icon-evaluation.svg', 
      sub: [
        {
          label:'Mis actividades',
          url: '/app/gestion-soportes/actividades'
        },
        {
          label:'Mis responsabilidades',
          url: '/app/gestion-soportes/responsabilidades'
        },
        {
          label:'Consolidado',
          url:'/app/gestion-soportes/consolidado/lista-docentes'
        },
        // {
        //   label:'CPD',
        //   url:''
        // },
        // {
        //   label:'Resolución',
        //   url:'',
        // }
      ]
    },

  

    // { label: '', icon: '', url: '' },
    // { label: '', icon: '', url: '' }
  ]

  ngOnInit(): void {
    
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }
  

  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive;
  }

  private checkScreenSize() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 1280) {
      this.isSidebarActive = false;
    } else {
      this.isSidebarActive = true;
    }
  }
}
