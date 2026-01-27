import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarActividadComponent } from './modal-editar-actividad.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('ModalEditarActividadComponent', () => {
  let component: ModalEditarActividadComponent;
  let fixture: ComponentFixture<ModalEditarActividadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ModalEditarActividadComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEditarActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
