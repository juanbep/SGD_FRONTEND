import { inject, Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { CatalogDataResponse } from '../../core/models/catalogData.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class CatalogDataService {

    private baseUrl: string = environments.baseUrl;

    httpClient: HttpClient = inject(HttpClient);


    getCatalogData(): Observable<CatalogDataResponse> {
        return this.httpClient.get<CatalogDataResponse>(`${this.baseUrl}/api/catalogo/obtenerCatalogo`);
    }

}