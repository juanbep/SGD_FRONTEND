
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Utilities {
    public adjustFormatDate(date: string): string {
        const dataArray:string[] = date.split('T');
        return `${dataArray[0].split('-').reverse().join('/')} ${dataArray[1].split(':').slice(0,3).join(':')}`;
    }
}