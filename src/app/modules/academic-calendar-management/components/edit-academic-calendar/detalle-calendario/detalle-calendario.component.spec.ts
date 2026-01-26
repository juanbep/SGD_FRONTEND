import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCalendarioComponent } from './detalle-calendario.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('DetalleCalendarioComponent', () => {
  let component: DetalleCalendarioComponent;
  let fixture: ComponentFixture<DetalleCalendarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        DetalleCalendarioComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleCalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
