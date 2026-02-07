import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarEditarFechaComponent } from './modal-agregar-editar-fecha.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';

describe('ModalAgregarFechaComponent', () => {
  let component: ModalAgregarEditarFechaComponent;
  let fixture: ComponentFixture<ModalAgregarEditarFechaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        RouterTestingModule,
        ModalAgregarEditarFechaComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAgregarEditarFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
