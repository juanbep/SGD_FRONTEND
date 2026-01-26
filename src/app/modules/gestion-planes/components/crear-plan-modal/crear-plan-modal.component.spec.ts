import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPlanModalComponent } from './crear-plan-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('CrearPlanModalComponent', () => {
  let component: CrearPlanModalComponent;
  let fixture: ComponentFixture<CrearPlanModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
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
