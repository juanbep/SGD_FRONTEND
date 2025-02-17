import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CatalogDataService } from '../shared/services/catalogData.service';
import { CatalogDataResponse } from '../core/models/catalogData.interface';
import { CatalogServicesService } from '../core/services/catalog-services.service';

@Injectable({providedIn: 'root'})
export class CatalogResolverService implements Resolve<any>{

    private catalogServiceService:CatalogServicesService = inject(CatalogServicesService);

    resolve():Observable<CatalogDataResponse>{ 
        return this.catalogServiceService.getCatalog();
    }
    
}