import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEliminarNecesidadComponent } from './modal-eliminar-necesidad.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ModalEliminarNecesidadComponent', () => {
  let component: ModalEliminarNecesidadComponent;
  let fixture: ComponentFixture<ModalEliminarNecesidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
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
