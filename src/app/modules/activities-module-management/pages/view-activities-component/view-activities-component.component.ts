import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TablaActividadesAcademicasComponent } from '../../components/activities-component/explore-activities-component/tabla-actividades-academicas/tabla-actividades-academicas/tabla-actividades-academicas.component';

@Component({
  selector: 'app-view-activities-component',
  standalone: true,
  imports: [CommonModule, FormsModule, TablaActividadesAcademicasComponent],
  templateUrl: './view-activities-component.component.html',
  styleUrl: './view-activities-component.component.css',
})
export class ViewActivitiesComponentComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  activeTab: string = 'academicas';

  selectTab(tab: string): void {
    this.activeTab = tab;
  }
}
