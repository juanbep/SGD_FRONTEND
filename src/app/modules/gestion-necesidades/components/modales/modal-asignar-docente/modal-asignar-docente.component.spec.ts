import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAsignarDocenteComponent } from './modal-asignar-docente.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('ModalAsignarDocenteComponent', () => {
  let component: ModalAsignarDocenteComponent;
  let fixture: ComponentFixture<ModalAsignarDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ModalAsignarDocenteComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAsignarDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
