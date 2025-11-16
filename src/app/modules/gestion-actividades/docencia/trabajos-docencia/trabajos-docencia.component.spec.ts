import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabajosDocenciaComponent } from './trabajos-docencia.component';

describe('TrabajosDocenciaComponent', () => {
  let component: TrabajosDocenciaComponent;
  let fixture: ComponentFixture<TrabajosDocenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrabajosDocenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrabajosDocenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
