import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescargaNecesidadesComponent } from './descarga-necesidades.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DescargaNecesidadesComponent', () => {
  let component: DescargaNecesidadesComponent;
  let fixture: ComponentFixture<DescargaNecesidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DescargaNecesidadesComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DescargaNecesidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
