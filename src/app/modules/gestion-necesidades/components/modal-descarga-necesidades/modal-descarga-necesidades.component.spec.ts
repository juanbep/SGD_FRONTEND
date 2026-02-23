import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDescargaNecesidadesComponent } from './modal-descarga-necesidades.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('ModalDescargaNecesidadesComponent', () => {
  let component: ModalDescargaNecesidadesComponent;
  let fixture: ComponentFixture<ModalDescargaNecesidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ModalDescargaNecesidadesComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalDescargaNecesidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
