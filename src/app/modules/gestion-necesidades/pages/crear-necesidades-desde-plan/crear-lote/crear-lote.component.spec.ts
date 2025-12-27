import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearLoteComponent } from './crear-lote.component';

describe('CrearLoteComponent', () => {
  let component: CrearLoteComponent;
  let fixture: ComponentFixture<CrearLoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearLoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearLoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
