import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaActividadesAcademicasComponent } from './tabla-actividades-academicas.component';

describe('TablaActividadesAcademicasComponent', () => {
  let component: TablaActividadesAcademicasComponent;
  let fixture: ComponentFixture<TablaActividadesAcademicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaActividadesAcademicasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaActividadesAcademicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
