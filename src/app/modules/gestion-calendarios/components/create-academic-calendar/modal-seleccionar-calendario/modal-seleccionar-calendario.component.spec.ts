import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSeleccionarCalendarioComponent } from './modal-seleccionar-calendario.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('ModalSeleccionarCalendarioComponent', () => {
  let component: ModalSeleccionarCalendarioComponent;
  let fixture: ComponentFixture<ModalSeleccionarCalendarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ModalSeleccionarCalendarioComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalSeleccionarCalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
