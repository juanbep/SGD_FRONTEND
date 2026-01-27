import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearNecesidadesDesdePlanComponent } from './crear-necesidades-desde-plan.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';

describe('CrearNecesidadesDesdePlanComponent', () => {
  let component: CrearNecesidadesDesdePlanComponent;
  let fixture: ComponentFixture<CrearNecesidadesDesdePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        RouterTestingModule,
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
