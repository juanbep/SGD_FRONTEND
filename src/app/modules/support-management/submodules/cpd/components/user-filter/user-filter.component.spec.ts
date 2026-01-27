import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserFilterComponent } from './user-filter.component';
import { ToastrModule } from 'ngx-toastr';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';
import { CpdServicesService } from '../../services/cpd-services.service';

// Mocks de los servicios
const mockCatalogDataService = {
  catalogDataSignal: null,
};

const mockCpdServicesService = {
  getFilterTeacherParams: () => ({
    evaluatedName: null,
    evaluatedId: null,
    category: null,
    department: null,
  }),
  setFilterTeacherParams: () => {},
};

describe('UserFilterComponent', () => {
  let component: UserFilterComponent;
  let fixture: ComponentFixture<UserFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot(), UserFilterComponent],
      providers: [
        { provide: CatalogDataService, useValue: mockCatalogDataService },
        { provide: CpdServicesService, useValue: mockCpdServicesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
