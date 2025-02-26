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

  ngOnInit(): void {
  }
}
