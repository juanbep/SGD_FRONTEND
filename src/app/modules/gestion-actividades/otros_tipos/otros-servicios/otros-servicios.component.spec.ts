import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtrosServiciosComponent } from './otros-servicios.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('OtrosServiciosComponent', () => {
  let component: OtrosServiciosComponent;
  let fixture: ComponentFixture<OtrosServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        OtrosServiciosComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OtrosServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
