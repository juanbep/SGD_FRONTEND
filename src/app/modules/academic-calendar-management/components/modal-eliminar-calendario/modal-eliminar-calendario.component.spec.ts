import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEliminarCalendarioComponent } from './modal-eliminar-calendario.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ModalEliminarCalendarioComponent', () => {
  let component: ModalEliminarCalendarioComponent;
  let fixture: ComponentFixture<ModalEliminarCalendarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ModalEliminarCalendarioComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEliminarCalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
