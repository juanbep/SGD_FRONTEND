import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPlanesComponent } from './listar-planes.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ListarPlanesComponent', () => {
  let component: ListarPlanesComponent;
  let fixture: ComponentFixture<ListarPlanesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ListarPlanesComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarPlanesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
