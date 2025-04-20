import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'auth-button-providers',
  standalone: true,
  imports: [],
  templateUrl: './button-providers.component.html',
  styleUrl: './button-providers.component.css'
})
export class ButtonProvidersComponent {
  @Output()
  onLoginGoogle: EventEmitter<boolean> = new EventEmitter<boolean>();

  onLoginGoogleClick() {
    this.onLoginGoogle.emit(true);
  }
}
