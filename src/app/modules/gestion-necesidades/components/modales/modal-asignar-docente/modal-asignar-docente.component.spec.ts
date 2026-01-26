import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAsignarDocenteComponent } from './modal-asignar-docente.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ModalAsignarDocenteComponent', () => {
  let component: ModalAsignarDocenteComponent;
  let fixture: ComponentFixture<ModalAsignarDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
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
