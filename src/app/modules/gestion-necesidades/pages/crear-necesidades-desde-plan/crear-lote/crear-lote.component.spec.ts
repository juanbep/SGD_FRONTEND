import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearLoteComponent } from './crear-lote.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('CrearLoteComponent', () => {
  let component: CrearLoteComponent;
  let fixture: ComponentFixture<CrearLoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot(), CrearLoteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearLoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
