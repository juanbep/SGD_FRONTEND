import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarDepartamentoComponent } from './modal-editar-departamento.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ModalEditarDepartamentoComponent', () => {
  let component: ModalEditarDepartamentoComponent;
  let fixture: ComponentFixture<ModalEditarDepartamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
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
