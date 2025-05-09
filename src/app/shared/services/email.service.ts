import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments.prod';
import { HttpClient } from '@angular/common/http';
import { Params } from '@angular/router';

@Injectable({providedIn: 'root'})
export class EmailService {
    
    private baseUrl: string = environments.baseUrlEmail;
    constructor(private httpClient: HttpClient) { }

    sendEmail(emails: string[], subject: string, message: string) {
        const params: Params = {
            correos: emails,
            asunto: subject,
            mensaje: message
        };
        return this.httpClient.post(`${this.baseUrl}/api/mensajeria/enviar-email`, {...params});
    }
    
}