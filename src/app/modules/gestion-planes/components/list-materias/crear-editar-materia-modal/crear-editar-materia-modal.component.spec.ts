import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarMateriaModalComponent } from './crear-editar-materia-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('CrearMateriaModalComponent', () => {
  let component: CrearEditarMateriaModalComponent;
  let fixture: ComponentFixture<CrearEditarMateriaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
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
