import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepFechasComponent } from './step-fechas.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';

describe('StepFechasComponent', () => {
  let component: StepFechasComponent;
  let fixture: ComponentFixture<StepFechasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, 
        ToastrModule.forRoot(), 
        RouterTestingModule,
        StepFechasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StepFechasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
