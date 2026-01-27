import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosSeleccionadosJefeComponent } from './filtros-seleccionados-jefe.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('FiltrosSeleccionadosJefeComponent', () => {
  let component: FiltrosSeleccionadosJefeComponent;
  let fixture: ComponentFixture<FiltrosSeleccionadosJefeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule,
              ToastrModule.forRoot(),FiltrosSeleccionadosJefeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrosSeleccionadosJefeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
