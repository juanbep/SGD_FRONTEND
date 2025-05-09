import { Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { UserFilterComponent } from "../../components/user-filter/user-filter.component";
import { UserTableComponent } from "../../components/user-table/user-table.component";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HistoricalServices } from '../../services/historical-services.service';
import { PeriodoAcademicoResponse } from '../../../../../../core/models/response/periodo-academico-response.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConsolidadoHistoricoResponse } from '../../../../../../core/models/response/consolidado-historico-response.model';
import { PagedResponse } from '../../../../../../core/models/response/paged-response.model';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';

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
  private messagesInfoService = inject(MessagesInfoService);


  public dropdownSettings = {};
  public academicPeriodResponse: PeriodoAcademicoResponse[] = [];
  public dropdownAcademicPeriodsList: { item_id: number; item_text: string }[] = [];
  public consolidadoHistoricoResponse: PagedResponse<ConsolidadoHistoricoResponse> | null = null;


  public filterParams: {
    evaluatedName: string | null;
    evaluatedId: string | null;
    category: string | null;
    department: string | null;
  } = { evaluatedName: null, evaluatedId: null, category: null, department: null };

  public currentPage = 0;

  filterEffec = effect(() => {
    this.filterParams = this.historicalServices.getFilterTeacherParams();
    this.searchHistoricalConsolidated();
  });

  public formHistoricalConsolidated: FormGroup = this.formBuilder.group({
    academicPeriod: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.recoverAcademicPeriods();
    this.onAcademicPeriodSelect();
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

  onAcademicPeriodSelect() {
    this.formHistoricalConsolidated.get('academicPeriod')?.valueChanges.subscribe((value) => {
      this.searchHistoricalConsolidated();
    });
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

    if ((this.formHistoricalConsolidated.invalid && this.formHistoricalConsolidated.dirty && this.formHistoricalConsolidated.get('academicPeriod')?.value.length === 0) || this.formHistoricalConsolidated.get('academicPeriod')?.value.length === 0) {
      this.formHistoricalConsolidated.markAllAsTouched();
      this.consolidadoHistoricoResponse = null;
      return;
    }
    const academicPeriodsId = this.formHistoricalConsolidated.get('academicPeriod')?.value.map((item: { item_id: number; }) => item.item_id);
    this.historicalServices.historicalConsolidated
      (this.currentPage,
        PAGE_SIZE,
        academicPeriodsId,
        this.filterParams.evaluatedName,
        this.filterParams.category,
        this.filterParams.evaluatedId
      ).subscribe({
        next: (response) => {
          if(!response || response.data.content.length === 0 ){ 
            this.messagesInfoService.showWarningMessage('No se encontraron resultados','Advertencia');
            this.consolidadoHistoricoResponse = null;
          }else{
            this.consolidadoHistoricoResponse = response.data;
          }
        },
        error: (error) => {
          this.consolidadoHistoricoResponse = null;
          this.messagesInfoService.showErrorMessage('Error al cargar los datos', 'Error');
        },
      });
  }

  pageChange(page: number) {
    this.currentPage = page - 1;
    this.searchHistoricalConsolidated();
  }


}
