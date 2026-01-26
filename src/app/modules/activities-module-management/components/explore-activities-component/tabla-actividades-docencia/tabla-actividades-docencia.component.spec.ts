import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaActividadesDocenciaComponent } from './tabla-actividades-docencia.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('TablaActividadesDocenciaComponent', () => {
  let component: TablaActividadesDocenciaComponent;
  let fixture: ComponentFixture<TablaActividadesDocenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
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
