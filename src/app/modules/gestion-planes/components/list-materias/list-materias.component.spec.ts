import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMateriasComponent } from './list-materias.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ListMateriasComponent', () => {
  let component: ListMateriasComponent;
  let fixture: ComponentFixture<ListMateriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
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
