import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogDataResponse } from '../../../../../../core/models/catalogData.interface';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';

@Component({
  selector: 'cpd-user-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-filter.component.html',
  styleUrl: './user-filter.component.css'
})
export class UserFilterComponent implements OnInit {
  
  private formBuilder= inject(FormBuilder);
  private catalogService = inject(CatalogDataService);

  @Output()
  public filterParams:EventEmitter<{nameUser:string | null, identification: string | null, category: string | null}> = new EventEmitter<{nameUser:string | null, identification: string | null, category: string | null}>();

  public catalogData: CatalogDataResponse | null = null;
  
  public formFilter = this.formBuilder.group({
    nameUser: [null, [Validators.required]],
    identification: [null, [Validators.required]],
    category: [null, [Validators.required]],
  });
  
  ngOnInit(): void {
    this.catalogData = this.catalogService.catalogDataSignal;
  }

  public searchUsers(){
    
      const nameUser = this.formFilter.get('nameUser')?.value || null;
      const identification = this.formFilter.get('identification')?.value || null;
      const category = this.formFilter.get('category')?.value || null;
      this.filterParams.emit({nameUser, identification, category});
    
  }

  public clearFilter(){
    this.formFilter.reset();
    this.filterParams.emit({nameUser: null, identification: null, category: null});
  }


}
