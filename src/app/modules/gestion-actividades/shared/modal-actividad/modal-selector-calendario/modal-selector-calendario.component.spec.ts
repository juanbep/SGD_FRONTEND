import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSelectorCalendarioComponent } from './modal-selector-calendario.component';

describe('ModalSelectorCalendarioComponent', () => {
  let component: ModalSelectorCalendarioComponent;
  let fixture: ComponentFixture<ModalSelectorCalendarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSelectorCalendarioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalSelectorCalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
