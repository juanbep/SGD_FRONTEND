import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsesoriaComponent } from './asesoria.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('AsesoriaComponent', () => {
  let component: AsesoriaComponent;
  let fixture: ComponentFixture<AsesoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, ToastrModule.forRoot(), AsesoriaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AsesoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
