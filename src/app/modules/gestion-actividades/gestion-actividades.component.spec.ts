import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionActividadesComponent } from './gestion-actividades.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('GestionActividadesComponent', () => {
  let component: GestionActividadesComponent;
  let fixture: ComponentFixture<GestionActividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        GestionActividadesComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
