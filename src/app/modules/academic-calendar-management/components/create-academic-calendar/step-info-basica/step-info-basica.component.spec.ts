import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepInfoBasicaComponent } from './step-info-basica.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('StepInfoBasicaComponent', () => {
  let component: StepInfoBasicaComponent;
  let fixture: ComponentFixture<StepInfoBasicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        StepInfoBasicaComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StepInfoBasicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
