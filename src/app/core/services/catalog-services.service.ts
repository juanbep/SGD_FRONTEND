import { inject, Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatalogDataResponse } from '../models/catalogData.interface';

@Injectable({providedIn: 'root'})
export class CatalogServicesService {

    private baseUrl: string = environments.baseUrl;

    private httpClient: HttpClient = inject(HttpClient);

    getCatalog(): Observable<CatalogDataResponse> {
        return this.httpClient.get<any>(`${this.baseUrl}/api/catalogo/obtenerCatalogo`);
    }
    
}