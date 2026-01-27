import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEliminarNecesidadComponent } from './modal-eliminar-necesidad.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('ModalEliminarNecesidadComponent', () => {
  let component: ModalEliminarNecesidadComponent;
  let fixture: ComponentFixture<ModalEliminarNecesidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ModalEliminarNecesidadComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEliminarNecesidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
