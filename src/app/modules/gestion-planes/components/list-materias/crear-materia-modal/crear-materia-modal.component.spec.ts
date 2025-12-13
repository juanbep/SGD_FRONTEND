import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearMateriaModalComponent } from './crear-materia-modal.component';

describe('CrearMateriaModalComponent', () => {
  let component: CrearMateriaModalComponent;
  let fixture: ComponentFixture<CrearMateriaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearMateriaModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearMateriaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
