import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JefeNecesidadesComponent } from './jefe-necesidades.component';

describe('JefeNecesidadesComponent', () => {
  let component: JefeNecesidadesComponent;
  let fixture: ComponentFixture<JefeNecesidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JefeNecesidadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JefeNecesidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
