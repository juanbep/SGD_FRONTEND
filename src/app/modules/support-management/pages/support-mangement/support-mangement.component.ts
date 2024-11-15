import { Component, OnInit } from '@angular/core';
import { TableActivitiesComponent } from "../../components/table-activities/table-activities.component";
import { FiltersComponent } from "../../components/filters-self-assesment/filters.component";
import { UploadFileComponent } from '../../components/upload-file-self-assessment/upload-file-self-assessment.component';

@Component({
  selector: 'pages-support-mangement',
  standalone: true,
  imports: [TableActivitiesComponent,
            FiltersComponent,
            UploadFileComponent
          ],
  templateUrl: './support-mangement.component.html',
  styleUrl: './support-mangement.component.css'
})
export class SupportMangementComponent implements OnInit{
  private btnUploadFile? = document.getElementById("btnUploadFile");

  public upluadModal: any | null = null;
  
  ngOnInit(): void {
    if(this.btnUploadFile){
      this.upluadModal= this.btnUploadFile.onclick;
    }
  }
  
  modalUploadFile(value:HTMLElement) {
      value.style.display = "block";

  }
}
