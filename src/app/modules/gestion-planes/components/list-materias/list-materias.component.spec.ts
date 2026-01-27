import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMateriasComponent } from './list-materias.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('ListMateriasComponent', () => {
  let component: ListMateriasComponent;
  let fixture: ComponentFixture<ListMateriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ListMateriasComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListMateriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
