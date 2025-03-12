import { Component, inject, OnInit } from '@angular/core';
import { ActivitiesTableComponent } from '../../components/activities-table/activities-table.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ActivitiesFilterComponent } from '../../components/activities-filter/activities-filter.component';
import { ActivitiesManagementService } from '../../services/activities-management.service';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [ActivitiesTableComponent, RouterModule, ActivitiesFilterComponent],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css',
})
export class ActivitiesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private activitiesMagementService = inject(ActivitiesManagementService);
  private messageInfoService = inject(MessagesInfoService);

  public teacherInformation: UsuarioResponse | null = null;
  public idUserParam: number | null = null;

  ngOnInit(): void {
    this.idUserParam = this.route.snapshot.params['id'];
    this.recoverTeacherInformation();
  }

  recoverTeacherInformation() {
    if (this.idUserParam) {
      this.activitiesMagementService.getUserById(this.idUserParam).subscribe(
        (response) => {
          this.teacherInformation = response.data;
        },
        (error) => {
          this.messageInfoService.showErrorMessage(
            error.error.mensaje,
            'Error'
          );
        }
      );
    }
  }

  goBack() {
    window.history.back();
  }
}
