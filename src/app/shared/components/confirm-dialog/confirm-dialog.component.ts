import { Component, Input, Output, EventEmitter } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'shared-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {

  @Input()
  title: string | null = null;

  @Input()
  message: string | null = null;
  
  @Output() 
  confirm: EventEmitter<boolean> = new EventEmitter<boolean>();

  open(){
    const modal = new bootstrap.Modal(document.getElementById('modal-confirm-dialog'));
    if(modal){
      modal.show();
    }
  }

  onConfirm() {
    this.confirm.emit(true);
  }

  close() {
    const modal = new bootstrap.Modal(document.getElementById('modal-confirm-dialog'));
    if(modal){
      modal.hide();
    }
  }



}
