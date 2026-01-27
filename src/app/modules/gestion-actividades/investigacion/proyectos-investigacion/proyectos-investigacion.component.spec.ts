import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosInvestigacionComponent } from './proyectos-investigacion.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('ProyectosInvestigacionComponent', () => {
  let component: ProyectosInvestigacionComponent;
  let fixture: ComponentFixture<ProyectosInvestigacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ProyectosInvestigacionComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProyectosInvestigacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
