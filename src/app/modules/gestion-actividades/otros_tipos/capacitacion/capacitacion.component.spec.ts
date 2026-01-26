import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacitacionComponent } from './capacitacion.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('CapacitacionComponent', () => {
  let component: CapacitacionComponent;
  let fixture: ComponentFixture<CapacitacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        CapacitacionComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CapacitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
