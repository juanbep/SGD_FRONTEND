import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionActividadBaseComponent } from './gestion-actividad-base.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { SubtipoActividadConfig } from '../../../config/actividades-metadata.config';

describe('GestionActividadBaseComponent', () => {
  let component: GestionActividadBaseComponent;
  let fixture: ComponentFixture<GestionActividadBaseComponent>;

  // Mock de metadata SubtipoActividadConfig
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
        GestionActividadBaseComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionActividadBaseComponent);
    component = fixture.componentInstance;

    component.metadata = mockMetadata;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
