import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class ValidatorsService {
    constructor() { }

    public numericPattern: string = '^[0-9]+$';

    public emailPattern: string = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';

    public validateNumericFormat(control: AbstractControl): ValidationErrors | null {
        if (control.value) {
            if(!control.value.match(/^\d+(\.\d+)?$/)) {
                console.log('invalid');
                return { invalidNumber: true };
            }
        }
        return  null;
    }

}