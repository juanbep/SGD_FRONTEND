import { Component, inject, OnInit } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { AuthServiceService } from '../../../auth/service/auth-service.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    SideBarComponent,
    HeaderComponent,
    FooterComponent,
    RouterOutlet
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {
  public authServiceService = inject(AuthServiceService);

  async ngOnInit(): Promise<void> {
    // Check if the user is logged in
    const isLogged = localStorage.getItem('originalToken');
    if(isLogged){
      (await this.authServiceService.getUserInfoFromBackend()).subscribe({
        next: (response) => {
          this.authServiceService.currentUserValue = response.data;
          this.authServiceService.updateLoginSuccess = true;
        },
        error: (error) => {
          this.authServiceService.logout()
        },
      });
    }
  }
}
