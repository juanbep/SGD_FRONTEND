import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleMateriaComponent } from './modal-detalle-materia.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('ModalDetalleMateriaComponent', () => {
  let component: ModalDetalleMateriaComponent;
  let fixture: ComponentFixture<ModalDetalleMateriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ModalDetalleMateriaComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalDetalleMateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
