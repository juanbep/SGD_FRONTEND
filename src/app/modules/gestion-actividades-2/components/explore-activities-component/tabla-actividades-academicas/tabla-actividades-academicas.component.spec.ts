import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaActividadesAcademicasComponent } from './tabla-actividades-academicas.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('TablaActividadesAcademicasComponent', () => {
  let component: TablaActividadesAcademicasComponent;
  let fixture: ComponentFixture<TablaActividadesAcademicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
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
