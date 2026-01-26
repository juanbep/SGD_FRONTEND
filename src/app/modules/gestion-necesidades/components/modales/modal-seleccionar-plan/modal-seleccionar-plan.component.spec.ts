import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSeleccionarPlanComponent } from './modal-seleccionar-plan.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ModalSeleccionarPlanComponentComponent', () => {
  let component: ModalSeleccionarPlanComponent;
  let fixture: ComponentFixture<ModalSeleccionarPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ModalSeleccionarPlanComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalSeleccionarPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
