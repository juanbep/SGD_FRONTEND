import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtrosServiciosComponent } from './otros-servicios.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('OtrosServiciosComponent', () => {
  let component: OtrosServiciosComponent;
  let fixture: ComponentFixture<OtrosServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
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
