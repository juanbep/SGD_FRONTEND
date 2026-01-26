import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEliminarFechaComponent } from './modal-eliminar-fecha.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ModalEliminarFechaComponent', () => {
  let component: ModalEliminarFechaComponent;
  let fixture: ComponentFixture<ModalEliminarFechaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ModalEliminarFechaComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEliminarFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
