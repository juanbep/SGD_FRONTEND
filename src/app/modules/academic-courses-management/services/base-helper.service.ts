import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, map, catchError, of } from 'rxjs';
import { BaseResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class BaseHelperService {
  async getDataFromResponse<T>(
    apiCall: Observable<BaseResponse<T>>
  ): Promise<T | null> {
    try {
      const response = await firstValueFrom(apiCall);
      return this.isSuccessResponse(response.codigo) ? response.data : null;
    } catch (error) {
      console.error('Error en BaseHelper:', error); //TODO: implementar manejo de errores mas explicito
      return null;
    }
  }

  getDataFromResponseObservable<T>(
    apiCall: Observable<BaseResponse<T>>
  ): Observable<T | null> {
    return apiCall.pipe(
      map((response) =>
        this.isSuccessResponse(response.codigo) ? response.data : null
      ),
      catchError((error) => {
        console.error('Error en BaseHelper:', error); //TODO: implementar manejo de errores mas explicito
        return of(null);
      })
    );
  }

  async getMultipleData<T>(
    apiCalls: Promise<T | null>[]
  ): Promise<(T | null)[]> {
    return Promise.all(apiCalls);
  }

  private isSuccessResponse(codigo: number): boolean {
    return codigo >= 200 && codigo < 300;
  }
}
