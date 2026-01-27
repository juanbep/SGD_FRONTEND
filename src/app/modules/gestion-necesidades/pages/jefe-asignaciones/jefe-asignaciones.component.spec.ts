import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JefeAsignacionesComponent } from './jefe-asignaciones.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('JefeAsignacionesComponent', () => {
  let component: JefeAsignacionesComponent;
  let fixture: ComponentFixture<JefeAsignacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        JefeAsignacionesComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JefeAsignacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
