import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosNecesidadesCoordinadorComponent } from './filtros-necesidades-coordinador.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('FiltrosNecesidadesComponent', () => {
  let component: FiltrosNecesidadesCoordinadorComponent;
  let fixture: ComponentFixture<FiltrosNecesidadesCoordinadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        FiltrosNecesidadesCoordinadorComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltrosNecesidadesCoordinadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
