import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUsuariosComponent } from './modal-usuarios.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ModalUsuariosComponent', () => {
  let component: ModalUsuariosComponent;
  let fixture: ComponentFixture<ModalUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ModalUsuariosComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
