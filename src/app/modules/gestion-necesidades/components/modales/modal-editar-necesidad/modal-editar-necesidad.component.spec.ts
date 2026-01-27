import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarNecesidadComponent } from './modal-editar-necesidad.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('ModalEditarNecesidadComponent', () => {
  let component: ModalEditarNecesidadComponent;
  let fixture: ComponentFixture<ModalEditarNecesidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ModalEditarNecesidadComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEditarNecesidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
