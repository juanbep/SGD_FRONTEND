import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleActividadComponent } from './modal-detalle-actividad.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ModalDetalleActividadComponent', () => {
  let component: ModalDetalleActividadComponent;
  let fixture: ComponentFixture<ModalDetalleActividadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ModalDetalleActividadComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalDetalleActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
