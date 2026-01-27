import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasPageComponent } from './estadisticas-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('EstadisticasPageComponent', () => {
  let component: EstadisticasPageComponent;
  let fixture: ComponentFixture<EstadisticasPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
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
