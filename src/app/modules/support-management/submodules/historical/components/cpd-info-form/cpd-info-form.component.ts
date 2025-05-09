import { Component, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EventEmitter } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'modal-cpd-info-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './cpd-info-form.component.html',
  styleUrl: './cpd-info-form.component.css'
})
export class CpdInfoFormComponent {

  @Output()
  public infoCpd= new EventEmitter<{resolutionNumber: string, resolutionDate:string, oficioNumber: string, oficioDate: string, meetingCouncil: string, councilPresident: string}>();
  
  private formBuilder: FormBuilder = inject(FormBuilder);

  public formCpd = this.formBuilder.group({
    resolutionNumber: [''],
    resolutionDate: [''],
    oficioNumber: [''],
    oficioDate: [''],
    meetingCouncil: [''],
    councilPresident: [''],
  });

  open(){
    const modal= document.getElementById('cpd-info-form');
    if(modal){
      var myModal = new bootstrap.Modal(modal);
      myModal.show();
    }
  }

  close(){
    const modal= document.getElementById('cpd-info-form');
    if(modal){
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance?.hide();
    }
  }

  saveCpdInfo(){
    const info: {resolutionNumber: string, resolutionDate:string ,oficioNumber: string, oficioDate: string, meetingCouncil: string, councilPresident: string} = {
      resolutionNumber: this.formCpd.get('resolutionNumber')?.value ?? '',
      resolutionDate: this.formCpd.get('resolutionDate')?.value ?? '',
      oficioNumber: this.formCpd.get('oficioNumber')?.value ?? '',
      oficioDate: this.formCpd.get('oficioDate')?.value ?? '',
      meetingCouncil: this.formCpd.get('meetingCouncil')?.value ?? '',
      councilPresident: this.formCpd.get('councilPresident')?.value ?? '',
    }
    
    this.infoCpd.emit(info);
   }



  


}
