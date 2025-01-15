import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';
import { CatalogDataResponse } from '../../../../../../core/models/catalogData.interface';
import { ValidatorsService } from '../../../../../../shared/services/validators.service';
import { ActivitiesTableComponent } from "../../components/activities-table/activities-table.component";
import { ActivitiesManagementService } from '../../services/activities-management.service';
import { User, UsersResponse } from '../../../../../../core/models/users.interfaces';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-activity',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ActivitiesTableComponent
],
  templateUrl: './new-activity.component.html',
  styleUrl: './new-activity.component.css'
})
export class NewActivityComponent implements OnInit {

  private formBuilder: FormBuilder = inject(FormBuilder);
  private catalogDataService = inject(CatalogDataService);
  private validatorsService = inject(ValidatorsService);
  private activitiesManagementService = inject(ActivitiesManagementService);  
  private activatedRoute = inject(ActivatedRoute);

  public catalogResponse: CatalogDataResponse | null = null;
  public evaluator: User | null = null;
  public idUserParam: number | null = null;
  public userByIdResponse: User | null = null;

  newActivityForm: FormGroup = this.formBuilder.group({
    nameActivity:  [null],
    typeActivity: [null, Validators.required],
    codeActivity: [null, Validators.required],
    VRI: [null, Validators.required],
    subject: [null, Validators.required],
    group: [null, Validators.required],
    totalHours: [null, [Validators.required, this.validatorsService.validateNumericFormat, Validators.min(0), Validators.max(100)]],
    projectName: [null, Validators.required],
    administrativeAct: [null, Validators.required],
    idStudent: [null, Validators.required],
    studentName: [null, Validators.required],
    activity: [null, Validators.required],
    evaluator: [null, Validators.required]
  });


  ngOnInit(): void {
    this.disableFields();
    this.recoverCatalogData();
    this.enableFields();
    this.idUserParam = this.activatedRoute.snapshot.params['id'];
    this.recoverUserById(this.idUserParam);
  }

  recoverCatalogData(): void {
    this.catalogDataService.getCatalogData().subscribe((response) => {
      this.catalogResponse = response;
    });
  }
  
  recoverUserById(id: number | null): void {
    if(id){
      this.activitiesManagementService.getUserById(id).subscribe((response) => {
         this.userByIdResponse = response;
      });
    }
  }

  disableFields(): void {
    this.newActivityForm.get('nameActivity')?.disable();
    this.newActivityForm.get('codeActivity')?.disable();
    this.newActivityForm.get('VRI')?.disable();
    this.newActivityForm.get('subject')?.disable();
    this.newActivityForm.get('group')?.disable();
    this.newActivityForm.get('totalHours')?.disable();
    this.newActivityForm.get('projectName')?.disable();
    this.newActivityForm.get('administrativeAct')?.disable();
    this.newActivityForm.get('idStudent')?.disable();
    this.newActivityForm.get('studentName')?.disable();
    this.newActivityForm.get('activity')?.disable();
    this.newActivityForm.get('evaluator')?.disable();
  }
  
  clearFields(): void {
    this.newActivityForm.get('nameActivity')?.reset();
    this.newActivityForm.get('codeActivity')?.reset();
    this.newActivityForm.get('VRI')?.reset();
    this.newActivityForm.get('subject')?.reset();
    this.newActivityForm.get('group')?.reset();
    this.newActivityForm.get('totalHours')?.reset();
    this.newActivityForm.get('projectName')?.reset();
    this.newActivityForm.get('administrativeAct')?.reset();
    this.newActivityForm.get('idStudent')?.reset();
    this.newActivityForm.get('studentName')?.reset();
    this.newActivityForm.get('activity')?.reset();
    this.newActivityForm.get('evaluator')?.reset();
  }

  enableFields(): void {
    this.newActivityForm.get('typeActivity')?.valueChanges.subscribe((value) => {
      this.disableFields();
      this.clearFields();
      switch (value) {
        case 'DOCENCIA':
          this.newActivityForm.get('nameActivity')?.enable();
          this.newActivityForm.get('codeActivity')?.enable();
          this.newActivityForm.get('subject')?.enable();
          this.newActivityForm.get('group')?.enable();
          this.newActivityForm.get('totalHours')?.enable();
          this.newActivityForm.get('evaluator')?.enable();
          this.validateEvaluator('DOCENCIA');
          break;
        case 'TRABAJOS DOCENCIA':
          this.newActivityForm.get('nameActivity')?.enable();
          this.newActivityForm.get('administrativeAct')?.enable();
          this.newActivityForm.get('idStudent')?.enable();
          this.newActivityForm.get('studentName')?.enable();
          this.newActivityForm.get('totalHours')?.enable();
          this.newActivityForm.get('evaluator')?.enable();
          break;
        case 'PROYECTOS DE INVESTIGACIÓN':
          this.newActivityForm.get('nameActivity')?.enable();
          this.newActivityForm.get('VRI')?.enable();
          this.newActivityForm.get('projectName')?.enable();
          this.newActivityForm.get('totalHours')?.enable();
          this.newActivityForm.get('evaluator')?.enable();
          break;
        case 'TRABAJOS DE INVESTIGACIÓN':
          this.newActivityForm.get('nameActivity')?.enable();
          this.newActivityForm.get('administrativeAct')?.enable();
          this.newActivityForm.get('idStudent')?.enable();
          this.newActivityForm.get('studentName')?.enable();
          this.newActivityForm.get('totalHours')?.enable();
          this.newActivityForm.get('evaluator')?.enable();
          break;
        case 'ADMINISTRACIÓN':
          this.newActivityForm.get('nameActivity')?.enable();
          this.newActivityForm.get('administrativeAct')?.enable();
          this.newActivityForm.get('activity')?.enable();
          this.newActivityForm.get('totalHours')?.enable();
          this.newActivityForm.get('evaluator')?.enable();
          break;
        case 'ASESORÍA':
          this.newActivityForm.get('nameActivity')?.enable();
          this.newActivityForm.get('administrativeAct')?.enable();
          this.newActivityForm.get('activity')?.enable();
          this.newActivityForm.get('totalHours')?.enable();
          this.newActivityForm.get('evaluator')?.enable();
          break;
        case 'EXTENSION':
          this.newActivityForm.get('nameActivity')?.enable();
          this.newActivityForm.get('administrativeAct')?.enable();
          this.newActivityForm.get('projectName')?.enable();
          this.newActivityForm.get('totalHours')?.enable();
          this.newActivityForm.get('evaluator')?.enable();
          break;
        case 'OTROS SERVICIOS':
          this.newActivityForm.get('nameActivity')?.enable();
          this.newActivityForm.get('administrativeAct')?.enable();
          this.newActivityForm.get('activity')?.enable();
          this.newActivityForm.get('totalHours')?.enable();
          this.newActivityForm.get('evaluator')?.enable();
      }
    });
  }

  isDisabledField(field: string) {
    return this.newActivityForm.get(field)?.disabled;
  }

  isInvaldField(field: string) {
    const control = this.newActivityForm.get(field);
    return control && control.errors && control.invalid && (control.dirty || control.touched);
  }

  goBack(): void {
    window.history.back();
  }

  getFieldError(field: string): string | null {
    if (!this.newActivityForm.controls[field]) return null;
    const control = this.newActivityForm.controls[field];
    const errors = control.errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'email':
          return 'El email no es válido';
        case 'invalidNumber':
          return 'El campo solo acepta números';
        case 'min':
          return 'El valor mínimo es 0';
        case 'max':
          return 'El valor máximo es 100';
        default:
          return null;
      }
    }
    return null;
  }

  // TODO: Implementar método para validar evaluador
  validateEvaluator(typeActivity:string): boolean {
    switch(typeActivity){
      case 'DOCENCIA':
        if(this.userByIdResponse){
          this.activitiesManagementService.getUserByParams(0, 10,null, null, null, null, null, null, 'JEFE DE DEPARTAMENTO', 1).subscribe((response) => {
            if(response && response.content.length === 1){
              this.evaluator = response.content[0];
              console.log('El jefe de departamento es: ', this.evaluator);
            }
            console.log('Hay mas de un jefe de departamento, validar que solo haya uno ', response);
            return false;
          });
        }
        return false;
      case 'TRABAJOS DOCENCIA':
        return true
      case 'PROYECTOS DE INVESTIGACIÓN':
        return true;
      case 'TRABAJOS DE INVESTIGACIÓN':
        return true;
      case 'ADMINISTRACIÓN':
        return true;
      case 'ASESORÍA':
        return true;
      case 'EXTENSION':
        return true;
      case 'OTROS SERVICIOS':
        return true;
    }
    return true;
  }


}
