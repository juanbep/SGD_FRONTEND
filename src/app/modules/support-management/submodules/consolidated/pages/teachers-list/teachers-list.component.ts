import { Component, OnInit } from '@angular/core';
import { TeachersListFilterComponent } from "../../components/teachers-list-filter/teachers-list-filter.component";
import { TeacherListTableComponent } from "../../components/teachers-list-table/teachers-list-table.component";
import { ConsolidatedServicesService } from '../../services/consolidated-services.service';
import { Teacher } from '../../../../../../core/models/consolidated.interface';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';

@Component({
  selector: 'support-management-consolidated',
  standalone: true,
  imports: [TeachersListFilterComponent, TeacherListTableComponent],
  templateUrl: './teachers-list.component.html',
  styleUrl: './teachers-list.component.css'
})
export class TeachersListComponent implements OnInit {


  public teachers: Teacher[] = [];
  
  constructor(private conlidatedServicesService: ConsolidatedServicesService, private toastr: MessagesInfoService) { }


  ngOnInit(): void {
    this.recoverTeachers();
  }

  recoverTeachers(): void {
    this.conlidatedServicesService.getTeachers().subscribe({
      next: data => {
        this.teachers = data;
        this.conlidatedServicesService.setDataTeachersList(data);
      },
      error: error => {
        this.toastr.showErrorMessage('Error al consultar la información', 'Error');
      }
    });
  }


}
