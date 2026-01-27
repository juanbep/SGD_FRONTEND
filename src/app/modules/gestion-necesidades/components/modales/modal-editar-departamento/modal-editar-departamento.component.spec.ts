import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarDepartamentoComponent } from './modal-editar-departamento.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('ModalEditarDepartamentoComponent', () => {
  let component: ModalEditarDepartamentoComponent;
  let fixture: ComponentFixture<ModalEditarDepartamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ModalEditarDepartamentoComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEditarDepartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
