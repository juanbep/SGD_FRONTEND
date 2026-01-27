import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEliminarSeleccionadoComponent } from './modal-eliminar-seleccionado.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('ModalEliminarSeleccionadoComponent', () => {
  let component: ModalEliminarSeleccionadoComponent;
  let fixture: ComponentFixture<ModalEliminarSeleccionadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ModalEliminarSeleccionadoComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEliminarSeleccionadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
