import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-approve-consolidated-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './approve-consolidated-confirm-dialog.component.html',
  styleUrl: './approve-consolidated-confirm-dialog.component.css'
})
export class ApproveConsolidatedConfirmDialogComponent {

  @Output()
  confirmed:  EventEmitter<void | string> = new EventEmitter<void | string>();

  open(): void {
    const myModal = document.getElementById('approve-consolidated-confirm-modal');
    if(myModal){
      myModal.style.display = 'block';
    }
  }

  closeModal(): void {
    const myModal = document.getElementById('approve-consolidated-confirm-modal');
    if(myModal){
      myModal.style.display = 'none';
    }
  }

  confirm(): void {
    this.confirmed.emit('Si');
  }

  decline(): void {
    this.confirmed.emit('No');
  }

}
