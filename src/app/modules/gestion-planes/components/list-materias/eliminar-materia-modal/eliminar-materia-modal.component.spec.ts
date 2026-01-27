import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarMateriaModalComponent } from './eliminar-materia-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('EliminarMateriaModalComponent', () => {
  let component: EliminarMateriaModalComponent;
  let fixture: ComponentFixture<EliminarMateriaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        EliminarMateriaModalComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EliminarMateriaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
