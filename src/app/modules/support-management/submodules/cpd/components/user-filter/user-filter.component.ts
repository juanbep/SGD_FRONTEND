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

  private formBuilder = inject(FormBuilder);
  private catalogService = inject(CatalogDataService);

  @Output()
  public filterParams: EventEmitter<{ nameUser: string | null, identification: string | null, category: string | null, department:string | null }> = new EventEmitter<{ nameUser: string | null, identification: string | null, category: string | null, department:string | null  }>();

  public catalogData: CatalogDataResponse | null = null;

  public formFilter = this.formBuilder.group({
    nameUser: [''],
    identification: [''],
    category: [''],
    department: [''],
  });

  ngOnInit(): void {
    this.catalogData = this.catalogService.catalogDataSignal;
  }

  public searchUsers() {

    const nameUser = this.formFilter.get('nameUser')?.value || '';
    const identification = this.formFilter.get('identification')?.value || '';
    const category = this.formFilter.get('category')?.value || '';
    const department = this.formFilter.get('department')?.value || '';
    this.filterParams.emit({ nameUser, identification, category, department });

  }

  public clearFilter() {
    this.formFilter.get('nameUser')?.setValue('');
    this.formFilter.get('identification')?.setValue('');
    this.formFilter.get('category')?.setValue('');
    this.formFilter.get('department')?.setValue('');

    this.filterParams.emit({ nameUser: '', identification: '', category: '', department: '' });
  }


}
