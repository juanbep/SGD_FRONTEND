import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosNecesidadesJefeComponent } from './filtros-necesidades-jefe.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FiltrosNecesidadesJefeComponent', () => {
  let component: FiltrosNecesidadesJefeComponent;
  let fixture: ComponentFixture<FiltrosNecesidadesJefeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        FiltrosNecesidadesJefeComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltrosNecesidadesJefeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
