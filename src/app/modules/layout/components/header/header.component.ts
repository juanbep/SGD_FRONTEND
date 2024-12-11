import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'layout-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  private router: Router = inject(Router);

  logOut(){
    sessionStorage.removeItem('token');
    this.router.navigate(['/auth']);
  }
}
