import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearIndividualComponent } from './crear-individual.component';

describe('CrearIndividualComponent', () => {
  let component: CrearIndividualComponent;
  let fixture: ComponentFixture<CrearIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearIndividualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
