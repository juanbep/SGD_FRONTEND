import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalActividadComponent } from './modal-actividad.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ModalActividadComponent', () => {
  let component: ModalActividadComponent;
  let fixture: ComponentFixture<ModalActividadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ModalActividadComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
