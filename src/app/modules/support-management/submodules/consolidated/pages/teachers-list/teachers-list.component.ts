import { Component, inject, OnInit } from '@angular/core';
import { TeachersListFilterComponent } from "../../components/teachers-list-filter/teachers-list-filter.component";
import { TeacherListTableComponent } from "../../components/teachers-list-table/teachers-list-table.component";
import { ConsolidatedServicesService } from '../../services/consolidated-services.service';
import { Teacher } from '../../../../../../core/models/consolidated.interface';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { UserInfo } from '../../../../../../core/models/auth.interface';
import { ActivatedRoute } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'support-management-consolidated',
  standalone: true,
  imports: [TeachersListFilterComponent, TeacherListTableComponent, TitleCasePipe],
  templateUrl: './teachers-list.component.html',
  styleUrl: './teachers-list.component.css'
})
export class TeachersListComponent implements OnInit {

  private consolidatedServicesService = inject(ConsolidatedServicesService);
  private activatedRoute = inject(ActivatedRoute);

  public currentUser: UserInfo | null = null;
  
  ngOnInit(): void {
    this.currentUser = this.activatedRoute.snapshot.data['teacher'];
  }
  

  downloadAllSuppotFiles(){
    this.consolidatedServicesService.downloadAllSupportFiles('2025-02', this.currentUser?.usuarioDetalle.departamento || '', '', null).subscribe
    (
      {
        next: (response: any) => {
          const blob = new Blob([response], { type: 'application/zip' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `documentos_${'2025-02'}_${this.currentUser?.usuarioDetalle.departamento}.zip`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error: any) => {
          console.log(error);
        }
      }
    );
  }
 
}