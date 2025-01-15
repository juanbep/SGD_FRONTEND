import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Params } from '@angular/router';

@Injectable({providedIn: 'root'})
export class EmailService {
    
    private baseUrl: string = environments.baseUrl;
    
    constructor(private httpClient: HttpClient) { }

    sendEmail(emails: string[], subject: string, message: string) {
        const params: Params = {
            emails: emails.toString(),
            subject: subject,
            message: message
        };
        return this.httpClient.post(`${this.baseUrl}/mensajeria/enviarEmail`, {params});
    }
    
}