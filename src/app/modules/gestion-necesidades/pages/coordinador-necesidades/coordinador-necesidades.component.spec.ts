import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinadorNecesidadesComponent } from './coordinador-necesidades.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('CoordinadorNecesidadesComponent', () => {
  let component: CoordinadorNecesidadesComponent;
  let fixture: ComponentFixture<CoordinadorNecesidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        CoordinadorNecesidadesComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CoordinadorNecesidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
