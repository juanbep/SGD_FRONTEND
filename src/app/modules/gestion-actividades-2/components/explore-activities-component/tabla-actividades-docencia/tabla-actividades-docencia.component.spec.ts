import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaActividadesDocenciaComponent } from './tabla-actividades-docencia.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('TablaActividadesDocenciaComponent', () => {
  let component: TablaActividadesDocenciaComponent;
  let fixture: ComponentFixture<TablaActividadesDocenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        TablaActividadesDocenciaComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TablaActividadesDocenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
