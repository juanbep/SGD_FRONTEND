import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEstadisticasComponent } from './modal-estadisticas.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ModalEstadisticasComponent', () => {
  let component: ModalEstadisticasComponent;
  let fixture: ComponentFixture<ModalEstadisticasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ModalEstadisticasComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEstadisticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
