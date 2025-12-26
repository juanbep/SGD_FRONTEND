import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNecesidadesComponent } from './list-necesidades.component';

describe('ListNecesidadesComponent', () => {
  let component: ListNecesidadesComponent;
  let fixture: ComponentFixture<ListNecesidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListNecesidadesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListNecesidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
