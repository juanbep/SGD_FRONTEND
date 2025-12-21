import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarMateriaModalComponent } from './crear-editar-materia-modal.component';

describe('CrearMateriaModalComponent', () => {
  let component: CrearEditarMateriaModalComponent;
  let fixture: ComponentFixture<CrearEditarMateriaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearEditarMateriaModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearEditarMateriaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
