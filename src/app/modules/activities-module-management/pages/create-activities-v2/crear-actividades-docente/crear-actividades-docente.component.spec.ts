import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearActividadesDocenteComponent } from './crear-actividades-docente.component';

describe('CrearActividadesDocenteComponent', () => {
  let component: CrearActividadesDocenteComponent;
  let fixture: ComponentFixture<CrearActividadesDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearActividadesDocenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearActividadesDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
