import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import { immediateProvider } from 'rxjs/internal/scheduler/immediateProvider';

@Component({
  selector: 'supportMangement-upload-file',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.css'
})
export class UploadFileComponent {
  private myModal:HTMLElement|null=null;


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
