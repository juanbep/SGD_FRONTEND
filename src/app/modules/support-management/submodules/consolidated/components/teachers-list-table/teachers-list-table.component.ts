import { Component, effect, OnInit } from '@angular/core';
import { PaginatorComponent } from '../../../../../../shared/components/paginator/paginator.component';
import { RouterLink } from '@angular/router';
import { ConsolidatedServicesService } from '../../services/consolidated-services.service';
import { Teacher } from '../../../../../../core/models/consolidated.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'consolidated-teachers-list-table',
  standalone: true,
  imports: [
    PaginatorComponent,
    RouterLink,
    CommonModule
  ],
  templateUrl: './teachers-list-table.component.html',
  styleUrl: './teachers-list-table.component.css'
})
export class TeacherListTableComponent implements OnInit {
  
  //TODO Declarar variables
  teacherList: Teacher[] = [];

  constructor(private conlidatedServicesService: ConsolidatedServicesService) {
    effect(()=>{
      this.teacherList = this.conlidatedServicesService.getDataTeachersList();
    })
   }


  ngOnInit(): void {
    this.teacherList = this.conlidatedServicesService.getDataTeachersList();
  }

  //TODO Método para obtener los datos de la tabla


}
