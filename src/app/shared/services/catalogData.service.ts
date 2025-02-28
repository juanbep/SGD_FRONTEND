import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { environments } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { CatalogDataResponse } from '../../core/models/catalogData.interface';
import { HttpClient } from '@angular/common/http';
import { CatalogServicesService } from '../../core/services/catalog-services.service';

@Injectable({providedIn: 'root'})
export class CatalogDataService {

    private catalogServicesService = inject(CatalogServicesService);

    private catalogData: WritableSignal<CatalogDataResponse | null> = signal(null);

    get catalogDataSignal() {
        return this.catalogData();
    }

    
    setCatalogData(newData: CatalogDataResponse) {
        this.catalogData.update(data => data = newData);
    }

    getCatalogData() {
        this.catalogServicesService.getCatalog().subscribe(response => {
            return this.catalogData.set(response.data);
        });
    }

}