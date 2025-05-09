import { inject, Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SmCpdServicesService {

    private baseUrl = environments.baseUrl;

    private httpCliente = inject(HttpClient);

    downloadConsolidatedReportFile() {
        return this.httpCliente.get(this.baseUrl + '/api/consolidado/exportar-informacion-general', { responseType: 'blob' });
    }


}