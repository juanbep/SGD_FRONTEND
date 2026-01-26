import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosComponent } from './servicios.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ServiciosComponent', () => {
  let component: ServiciosComponent;
  let fixture: ComponentFixture<ServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, ToastrModule.forRoot(), ServiciosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
