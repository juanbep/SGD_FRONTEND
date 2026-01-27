import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacitacionComponent } from './capacitacion.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('CapacitacionComponent', () => {
  let component: CapacitacionComponent;
  let fixture: ComponentFixture<CapacitacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
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
