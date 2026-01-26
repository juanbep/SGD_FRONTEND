import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosNecesidadesJefeComponent } from './filtros-necesidades-jefe.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';

describe('FiltrosNecesidadesJefeComponent', () => {
  let component: FiltrosNecesidadesJefeComponent;
  let fixture: ComponentFixture<FiltrosNecesidadesJefeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
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
