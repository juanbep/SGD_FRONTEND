import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsesoriaComponent } from './asesoria.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('AsesoriaComponent', () => {
  let component: AsesoriaComponent;
  let fixture: ComponentFixture<AsesoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot(), AsesoriaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AsesoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
