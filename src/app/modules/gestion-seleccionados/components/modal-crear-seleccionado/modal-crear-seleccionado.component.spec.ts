import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCrearSeleccionadoComponent } from './modal-crear-seleccionado.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';

describe('ModalCrearSeleccionadoComponent', () => {
  let component: ModalCrearSeleccionadoComponent;
  let fixture: ComponentFixture<ModalCrearSeleccionadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ModalCrearSeleccionadoComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCrearSeleccionadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
