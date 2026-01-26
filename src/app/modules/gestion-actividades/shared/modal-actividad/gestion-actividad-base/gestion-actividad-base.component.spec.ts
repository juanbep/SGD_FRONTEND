import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionActividadBaseComponent } from './gestion-actividad-base.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('GestionActividadBaseComponent', () => {
  let component: GestionActividadBaseComponent;
  let fixture: ComponentFixture<GestionActividadBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        GestionActividadBaseComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionActividadBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
