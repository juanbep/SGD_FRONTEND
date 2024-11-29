import { Component } from '@angular/core';
import { ConsolidatedTeacherFilterComponent } from "../../components/consolidated-teacher-filter/consolidated-teacher-filter.component";
import { ConsolidatedTeacherTableComponent } from "../../components/consolidated-teacher-table/consolidated-teacher-table.component";

@Component({
  selector: 'app-consolidated-teacher',
  standalone: true,
  imports: [ConsolidatedTeacherFilterComponent, ConsolidatedTeacherTableComponent],
  templateUrl: './consolidated-teacher.component.html',
  styleUrl: './consolidated-teacher.component.css'
})
export class ConsolidatedTeacherComponent {

}
