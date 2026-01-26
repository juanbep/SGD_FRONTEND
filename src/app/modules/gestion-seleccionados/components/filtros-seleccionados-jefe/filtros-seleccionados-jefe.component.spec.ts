import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosSeleccionadosJefeComponent } from './filtros-seleccionados-jefe.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('FiltrosSeleccionadosJefeComponent', () => {
  let component: FiltrosSeleccionadosJefeComponent;
  let fixture: ComponentFixture<FiltrosSeleccionadosJefeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientModule,
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
