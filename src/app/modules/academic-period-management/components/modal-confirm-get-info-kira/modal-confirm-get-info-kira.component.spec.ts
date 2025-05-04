import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmGetInfoKiraComponent } from './modal-confirm-get-info-kira.component';

describe('ModalConfirmGetInfoKiraComponent', () => {
  let component: ModalConfirmGetInfoKiraComponent;
  let fixture: ComponentFixture<ModalConfirmGetInfoKiraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalConfirmGetInfoKiraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalConfirmGetInfoKiraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
