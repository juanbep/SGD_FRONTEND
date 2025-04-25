import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ConsolidatedTeacherFilterComponent } from './consolidated-teacher-filter.component';
import {  provideHttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ConsolidatedTeacherFilterComponent', () => {
  let component: ConsolidatedTeacherFilterComponent;
  let fixture: ComponentFixture<ConsolidatedTeacherFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot(),
        ConsolidatedTeacherFilterComponent,
      ],
      providers:
      [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsolidatedTeacherFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
