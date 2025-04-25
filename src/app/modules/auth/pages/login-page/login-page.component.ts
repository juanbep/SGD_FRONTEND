import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../service/auth-service.service';
import { MessagesInfoService } from '../../../../shared/services/messages-info.service';
import { ButtonProvidersComponent } from '../../component/button-providers/button-providers.component';

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ButtonProvidersComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  private router: Router = inject(Router);
  private authServicesService: AuthServiceService = inject(AuthServiceService);
  private messagesInfoService: MessagesInfoService =
    inject(MessagesInfoService);
  private isLogged: boolean | null = null;

  loginEffect = effect(() => {
    this.isLogged = this.authServicesService.loginSuccess$();
    if (this.isLogged) {
      this.router.navigate(['/app/home']);
      this.messagesInfoService.showSuccessMessage('Bienvenido', 'Éxito');
    }
  });

  onLoginGoogle(login: boolean) {
    if (!login) return;
    this.authServicesService.loginWithGooglePopPup().then((res) => {
      this.sentTokenToBackend(res as string);
    });
  }

  private async sentTokenToBackend(token: string) {
    (await this.authServicesService.sendTokenToBackend(token)).subscribe({
      next: (response) => {
        const jwtToken = response.data.token;
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('originalToken', token);

        this.getLoggedUser();
      },
      error: (error) => {
        this.messagesInfoService.showErrorMessage(error.error.mensaje, 'Error');
        this.authServicesService.logout();
      },
    });
  }

  async getLoggedUser() {
    (await this.authServicesService.getUserInfoFromBackend()).subscribe({
      next: (response) => {
        this.authServicesService.currentUserValue = response.data;
        this.authServicesService.updateLoginSuccess = true;

        const roles = response.data.roles.map((role) => role.nombre);
        localStorage.setItem('userRoles', JSON.stringify(roles));

        this.router.navigate(['/app/home']);
      },
      error: (error) => {
        this.messagesInfoService.showErrorMessage(error.error.mensaje, 'Error');
        this.authServicesService.logout();
      },
    });
  }
}
