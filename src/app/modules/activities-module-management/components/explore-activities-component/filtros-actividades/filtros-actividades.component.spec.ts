import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosActividadesComponent } from './filtros-actividades.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('FiltrosActividadesComponent', () => {
  let component: FiltrosActividadesComponent;
  let fixture: ComponentFixture<FiltrosActividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        FiltrosActividadesComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltrosActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
