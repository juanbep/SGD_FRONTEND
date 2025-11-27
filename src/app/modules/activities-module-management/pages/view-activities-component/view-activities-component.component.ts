import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesBaseComponent } from '../../components/manage-activities-component/activities-base/activities-base.component';

@Component({
  selector: 'app-view-activities-component',
  standalone: true,
  imports: [CommonModule, ActivitiesBaseComponent],
  templateUrl: './view-activities-component.component.html',
  styleUrl: './view-activities-component.component.css',
})
export class ViewActivitiesComponentComponent {}
