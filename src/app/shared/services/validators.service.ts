import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ValidatorsService {
    constructor() { }

    public numericPattern: string = '^[0-9]+$';

    public emailPattern: string = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';


    public validateFileFormat(fileName: string): boolean {
        const allowedExtensions = /(\.pdf|\.doc|\.docx|\.xls|\.xlsx)$/i;
        return allowedExtensions.test(fileName);
    }

}