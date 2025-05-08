import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthServiceService } from '../modules/auth/service/auth-service.service';
import { CatalogDataService } from '../shared/services/catalogData.service';

@Injectable({ providedIn: 'root' })
export class CurrentUserResolverService implements Resolve<any> {

    private authServiceService: AuthServiceService = inject(AuthServiceService);

    constructor() { }

    resolve() {
        this.authServiceService.getUserInfo().subscribe({
            next: (response) => {
                this.authServiceService.currentUserValue = response.data;
                this.authServiceService.updateLoginSuccess = true;
            },
            error: (error) => {
                this.authServiceService.logout()
            },
        }
        )
    }

}
