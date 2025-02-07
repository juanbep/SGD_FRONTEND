import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

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

    // Fecha inicial no debe ser mayor a la fecha final
    public validateDateRange(): ValidatorFn {
        return (formGrup: AbstractControl): ValidationErrors | null => {
            const startDate = formGrup.get('startDate')?.value;
            const endDate = formGrup.get('endDate')?.value;

            if (startDate && endDate) {
                if (new Date(startDate) > new Date(endDate)) {
                    return { invalidDateRange: true };
                }
            }

            return null;
        }
    }

    //Expresión regular para validar que un texto venga en el siguiente formato de ejemplo 2001-1 o 2001-01
    public validateAcademicPeriodFormat(control: AbstractControl): ValidationErrors | null {
        if (control.value) {
            if (!control.value.match(/^\d{4}-[1-9]{1}$|^\d{4}-[0-1]{1}\d{1}$/)) {
                return { invalidAcademicPeriodFormat: true };
            }
        }
        return null;
    }

    minSelectedCheckboxes(control: AbstractControl): ValidationErrors | null {
        const formArray = control as FormGroup;
        const selectedCheckboxes = formArray.get('role')?.value;
        if (selectedCheckboxes && selectedCheckboxes.length < 1) {
            return { minSelectedCheckboxes: true };
        }
        return null;
      }
}