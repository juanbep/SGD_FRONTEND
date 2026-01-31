import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalActividadComponent } from './modal-actividad.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { SubtipoActividadConfig } from '../../../config/actividades-metadata.config';

describe('ModalActividadComponent', () => {
  let component: ModalActividadComponent;
  let fixture: ComponentFixture<ModalActividadComponent>;

  // Mock de metadata
  const mockMetadata: SubtipoActividadConfig = {
    oidTipoActividad: 1,
    nombreTipo: 'Actividad de Prueba',
    atributos: [
      {
        nombre: 'atributo1',
        tipoValor: 'string',
        label: 'Atributo 1',
        tipoCampo: 'text',
        requerido: false,
        mostrarEnTabla: true,
        orden: 1,
        esRepetible: false,
      },
    ],
    gruposRepetibles: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ModalActividadComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalActividadComponent);
    component = fixture.componentInstance;

    component.metadata = mockMetadata;
    component.oidCalendario = 1;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
