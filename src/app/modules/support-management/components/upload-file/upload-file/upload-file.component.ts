import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import { immediateProvider } from 'rxjs/internal/scheduler/immediateProvider';
import { SupportManagementService } from '../../../services/support-management.service';
import { Actividad } from '../../../../../core/activities.interface';

@Component({
  selector: 'supportMangement-upload-file',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.css'
})
export class UploadFileComponent implements OnInit {
  
  private myModal:HTMLElement|null=null;

  public myActivities: Actividad[] = [];
  
  constructor(private activitieService: SupportManagementService){

  }

  ngOnInit(): void {
    this.dataActivities();
    
  }

  dataActivities(){
    this.activitieService.allActivitiesByUser("6").subscribe(activities => {
      this.myActivities = activities;
    })
  }

  openModal():void{
    this.myModal=document.getElementById("myModal");
    if(this.myModal){
      this.myModal.style.display="flex";
    }
  }

  closeModal(){
    if(this.myModal){
      
      this.myModal.style.display="none";
    }
  }
}
