import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPlanModalComponent } from './crear-plan-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('CrearPlanModalComponent', () => {
  let component: CrearPlanModalComponent;
  let fixture: ComponentFixture<CrearPlanModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        CrearPlanModalComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearPlanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
