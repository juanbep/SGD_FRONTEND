import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasPageComponent } from './estadisticas-page.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('EstadisticasPageComponent', () => {
  let component: EstadisticasPageComponent;
  let fixture: ComponentFixture<EstadisticasPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        EstadisticasPageComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EstadisticasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
