import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSelectorCalendarioComponent } from './modal-selector-calendario.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ModalSelectorCalendarioComponent', () => {
  let component: ModalSelectorCalendarioComponent;
  let fixture: ComponentFixture<ModalSelectorCalendarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ModalSelectorCalendarioComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalSelectorCalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
