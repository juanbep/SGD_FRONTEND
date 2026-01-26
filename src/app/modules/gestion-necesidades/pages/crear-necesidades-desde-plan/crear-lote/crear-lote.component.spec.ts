import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearLoteComponent } from './crear-lote.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('CrearLoteComponent', () => {
  let component: CrearLoteComponent;
  let fixture: ComponentFixture<CrearLoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, ToastrModule.forRoot(), CrearLoteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearLoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
