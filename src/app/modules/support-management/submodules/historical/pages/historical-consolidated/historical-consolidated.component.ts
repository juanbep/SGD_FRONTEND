import { Component, inject, OnInit } from '@angular/core';
import { UserFilterComponent } from "../../components/user-filter/user-filter.component";
import { UserTableComponent } from "../../components/user-table/user-table.component";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HistoricalServices } from '../../services/historical-services.service';
import { PeriodoAcademicoResponse } from '../../../../../../core/models/response/periodo-academico-response.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConsolidadoHistoricoResponse } from '../../../../../../core/models/response/consolidado-historico-response.model';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-historical-consolidated',
  standalone: true,
  imports: [UserFilterComponent, UserTableComponent, NgMultiSelectDropDownModule, CommonModule, ReactiveFormsModule],
  templateUrl: './historical-consolidated.component.html',
  styleUrl: './historical-consolidated.component.css'
})
export class HistoricalConsolidatedComponent implements OnInit {

  private formBuilder: FormBuilder = inject(FormBuilder);
  private historicalServices = inject(HistoricalServices);

  public dropdownSettings = {};
  public academicPeriodResponse: PeriodoAcademicoResponse[] = [];
  public dropdownAcademicPeriodsList: { item_id: number; item_text: string }[] = [];
  public consolidadoHistoricoResponse: ConsolidadoHistoricoResponse[] = [];

  public currentPage = 0;


  public formHistoricalConsolidated: FormGroup = this.formBuilder.group({
    academicPeriod: ['',[Validators.required]],
  });

  ngOnInit(): void {
    this.recoverAcademicPeriods();
    this.dropdownSettings = {
      singleSelection: false,
      maxHeight: 197,
      idField: 'item_id',
      textField: 'item_text',
      limitSelection: 2,
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      itemsShowLimit: 5,
      allowSearchFilter: true,
      searchPlaceholderText: 'Buscar',
    }
  }


  recoverAcademicPeriods() {
    this.historicalServices.getAllAcademicPeriods(0, 100).subscribe({
      next: (response) => {
        response.data.content.map((academicPeriod) => {
          this.academicPeriodResponse.push(academicPeriod);
          this.dropdownAcademicPeriodsList.push({
            item_id: academicPeriod.oidPeriodoAcademico,
            item_text: academicPeriod.idPeriodo,
          });
        });
      },
    });
  }

  isInvaldField(field: string) {
    const control = this.formHistoricalConsolidated.get(field);
    return (
      control &&
      control.errors &&
      control.invalid &&
      (control.dirty || control.touched)
    );
  }

  getFieldError(field: string): string | null {
    if (!this.formHistoricalConsolidated.controls[field]) return null;
    const control = this.formHistoricalConsolidated.controls[field];
    const errors = control.errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        default:
          return null;
      }
    }
    return null;
  }

  searchHistoricalConsolidated() {
    if (this.formHistoricalConsolidated.invalid) {
      this.formHistoricalConsolidated.markAllAsTouched();
      return;
    }
    const academicPeriodsId = this.formHistoricalConsolidated.get('academicPeriod')?.value.map((item: { item_id: number; }) => item.item_id);
    console.log(academicPeriodsId);
    this.historicalServices.historicalConsolidated(this.currentPage, PAGE_SIZE, academicPeriodsId).subscribe({
      next: (response) => {
        this.consolidadoHistoricoResponse = response.data.content;
        console.log(this.consolidadoHistoricoResponse);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

}
