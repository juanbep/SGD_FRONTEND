import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSeleccionarPlanComponent } from './modal-seleccionar-plan.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('ModalSeleccionarPlanComponentComponent', () => {
  let component: ModalSeleccionarPlanComponent;
  let fixture: ComponentFixture<ModalSeleccionarPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
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
