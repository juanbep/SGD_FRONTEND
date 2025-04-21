import { Injectable } from '@angular/core';
import { HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

const CHECK_TOKEN = new HttpContextToken<boolean>(() => true);

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = localStorage.getItem('token');
        if (token) {
            const cloneRequest = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            return next.handle(cloneRequest);
        }

        return next.handle(request);
    }
}