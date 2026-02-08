import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserData } from '../../../auth/models';
import { AuthServiceService } from '../../../auth/service/auth-service.service';

@Component({
  selector: 'app-user-profile-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile-modal.component.html',
  styleUrl: './user-profile-modal.component.scss',
})
export class UserProfileModalComponent {
  @Input() currentUser: UserData | null = null;
  @Input() isOpen = false;
  @Input() isSidebarCollapsed = false;
  @Output() close = new EventEmitter<void>();
  private authServiceService = inject(AuthServiceService);

  @ViewChild('userPopover') userPopover!: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen) return;

    const clickedElement = event.target as HTMLElement;

    const clickedInsidePopover =
      this.userPopover?.nativeElement.contains(clickedElement);

    const clickedOnTrigger = clickedElement.closest('.user-profile-trigger');

    if (!clickedInsidePopover && !clickedOnTrigger) {
      this.closeModal();
    }
  }

  closeModal() {
    this.close.emit();
  }

  logout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
      this.authServiceService.logout();
    }
    this.closeModal();
  }

  getUserInitials(): string {
    if (!this.currentUser) return 'U';
    const nombres = this.currentUser.nombres?.charAt(0) || '';
    const apellidos = this.currentUser.apellidos?.charAt(0) || '';
    return `${nombres}${apellidos}`.toUpperCase();
  }
}
