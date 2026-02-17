import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDescargaNecesidadesComponent } from './modal-descarga-necesidades.component';

describe('ModalDescargaNecesidadesComponent', () => {
  let component: ModalDescargaNecesidadesComponent;
  let fixture: ComponentFixture<ModalDescargaNecesidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDescargaNecesidadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDescargaNecesidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
