import { Component, ViewChild } from '@angular/core';
import { EmailNotificationComponent } from '../email-notification/email-notification.component';

@Component({
  selector: 'consolidated-teacher-table',
  standalone: true,
  imports: [EmailNotificationComponent],
  templateUrl: './consolidated-teacher-table.component.html',
  styleUrl: './consolidated-teacher-table.component.css'
})
export class ConsolidatedTeacherTableComponent {


  @ViewChild(EmailNotificationComponent)
  emailNotificationComponent!: EmailNotificationComponent;


  public emailNotificationModal() {
    this.emailNotificationComponent.openModal();
  }



}
