import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaActividadesAcademicasComponent } from './tabla-actividades-academicas.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('TablaActividadesAcademicasComponent', () => {
  let component: TablaActividadesAcademicasComponent;
  let fixture: ComponentFixture<TablaActividadesAcademicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        TablaActividadesAcademicasComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TablaActividadesAcademicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
