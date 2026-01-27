import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarMateriaModalComponent } from './crear-editar-materia-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('CrearMateriaModalComponent', () => {
  let component: CrearEditarMateriaModalComponent;
  let fixture: ComponentFixture<CrearEditarMateriaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        CrearEditarMateriaModalComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearEditarMateriaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
