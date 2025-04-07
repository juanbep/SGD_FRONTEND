import { Component, inject, OnInit } from '@angular/core';
import { ChartComponent } from '../../components/chart/chart.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    ChartComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
})
export class StatisticsComponent implements OnInit {
  private formBuilder: FormBuilder = inject(FormBuilder);

  formStatistics: FormGroup = this.formBuilder.group({
    statisticsType: [''],
    teacherName: [''],
    academicPeriod: [''],
    activityType: [''],
    program: [''],
  });
  cities!: City[];

  selectedCities!: City[];

  ngOnInit() {
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' },
    ];
  }
}

interface City {
  name: string;
  code: string;
}
