import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioAsignarUsuarioComponent } from './formulario-asignar-usuario.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('FormularioAsignarUsuarioComponent', () => {
  let component: FormularioAsignarUsuarioComponent;
  let fixture: ComponentFixture<FormularioAsignarUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        FormularioAsignarUsuarioComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioAsignarUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
