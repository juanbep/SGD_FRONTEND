import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JefeNecesidadesComponent } from './jefe-necesidades.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('JefeNecesidadesComponent', () => {
  let component: JefeNecesidadesComponent;
  let fixture: ComponentFixture<JefeNecesidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        JefeNecesidadesComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JefeNecesidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
