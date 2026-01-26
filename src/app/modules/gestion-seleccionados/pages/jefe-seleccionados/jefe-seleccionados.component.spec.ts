import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JefeSeleccionadosComponent } from './jefe-seleccionados.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('JefeSeleccionadosComponent', () => {
  let component: JefeSeleccionadosComponent;
  let fixture: ComponentFixture<JefeSeleccionadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        JefeSeleccionadosComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JefeSeleccionadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
