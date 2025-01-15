import { Component, inject, OnInit } from '@angular/core';
import { ActivitiesTableComponent } from "../../components/activities-table/activities-table.component";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ActivitiesFilterComponent } from "../../components/activities-filter/activities-filter.component";

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [
    ActivitiesTableComponent,
    RouterModule,
    ActivitiesFilterComponent
],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css'
})
export class ActivitiesComponent implements OnInit {
 
  private route = inject(ActivatedRoute);

  public idUserParam: number | null = null;
  
  ngOnInit(): void {
    this.idUserParam = this.route.snapshot.params['id'];
  }

  goBack() {
    window.history.back();
  }

}
