import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../modules/auth/service/auth-service.service';

@Injectable({providedIn: 'root'})
export class DataResolverService implements Resolve<any>{

    private authServiceService:AuthServiceService = inject(AuthServiceService);

    constructor() { }

   resolve():Observable<any> {
       return this.authServiceService.getUserInfo();
   }

    
}