import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPlanesComponent } from './listar-planes.component';

describe('ListarPlanesComponent', () => {
  let component: ListarPlanesComponent;
  let fixture: ComponentFixture<ListarPlanesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarPlanesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarPlanesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
