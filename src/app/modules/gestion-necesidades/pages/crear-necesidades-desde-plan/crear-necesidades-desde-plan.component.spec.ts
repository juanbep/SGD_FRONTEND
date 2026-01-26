import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearNecesidadesDesdePlanComponent } from './crear-necesidades-desde-plan.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('CrearNecesidadesDesdePlanComponent', () => {
  let component: CrearNecesidadesDesdePlanComponent;
  let fixture: ComponentFixture<CrearNecesidadesDesdePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        CrearNecesidadesDesdePlanComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearNecesidadesDesdePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
