import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { CatalogDataService } from '../shared/services/catalogData.service';
import { CatalogDataResponse } from '../core/models/catalogData.interface';
import { CatalogServicesService } from '../core/services/catalog-services.service';
import { SimpleResponse } from '../core/models/response/simple-response.model';

@Injectable({providedIn: 'root'})
export class CatalogResolverService implements Resolve<any>{

    private catalogServiceService:CatalogServicesService = inject(CatalogServicesService);
    private catalogService:CatalogDataService = inject(CatalogDataService);

    resolve():Observable<SimpleResponse<CatalogDataResponse>>{ 
        return this.catalogServiceService.getCatalog().pipe(
            tap(response => this.catalogService.setCatalogData(response.data))
        );
    }
    
}