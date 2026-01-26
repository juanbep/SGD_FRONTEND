import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEliminarActividadComponent } from './modal-eliminar-actividad.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ModalEliminarActividadComponent', () => {
  let component: ModalEliminarActividadComponent;
  let fixture: ComponentFixture<ModalEliminarActividadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ModalEliminarActividadComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEliminarActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
