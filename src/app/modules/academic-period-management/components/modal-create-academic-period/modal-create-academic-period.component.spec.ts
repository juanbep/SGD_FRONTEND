import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalCreateAcademicPeriodComponent } from './modal-create-academic-period.component';
import { AcademicPeriodManagementService } from '../../services/academic-period-management-service.service';
import { MessagesInfoService } from '../../../../shared/services/messages-info.service';
import { ValidatorsService } from '../../../../shared/services/validators.service';
import { of } from 'rxjs';

describe('ModalCreateAcademicPeriodComponent', () => {
  let component: ModalCreateAcademicPeriodComponent;
  let fixture: ComponentFixture<ModalCreateAcademicPeriodComponent>;
  let mockAcademicPeriodManagementService: jasmine.SpyObj<AcademicPeriodManagementService>;
  let mockMessagesInfoService: jasmine.SpyObj<MessagesInfoService>;
  let mockValidatorsService: jasmine.SpyObj<ValidatorsService>;

  beforeEach(async () => {
    mockAcademicPeriodManagementService = jasmine.createSpyObj('AcademicPeriodManagementService', [
      'saveNewAcademicPeriod',
      'getAcademicPeriodsByKira',
      'getAllAcademicPeriods',
      'setAcademicPeriods',
    ]);
    mockMessagesInfoService = jasmine.createSpyObj('MessagesInfoService', [
      'showSuccessMessage',
      'showErrorMessage',
    ]);
    mockValidatorsService = jasmine.createSpyObj('ValidatorsService', ['validateDateRange']);
    mockValidatorsService.validateDateRange.and.returnValue(() => null);

    mockAcademicPeriodManagementService.getAcademicPeriodsByKira.and.returnValue(
      of({
        codigo: 200,
        mensaje: 'Kira periods response',
        data: []
      })
    );
    mockAcademicPeriodManagementService.getAllAcademicPeriods.and.returnValue(of());

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ModalCreateAcademicPeriodComponent],
      providers: [
        { provide: AcademicPeriodManagementService, useValue: mockAcademicPeriodManagementService },
        { provide: MessagesInfoService, useValue: mockMessagesInfoService },
        { provide: ValidatorsService, useValue: mockValidatorsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCreateAcademicPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and initialize the form correctly', () => {
    expect(component).toBeTruthy();
    expect(component.newAcademicPeriodForm.value).toEqual({
      idAcademicPeriod: null,
      startDate: null,
      endDate: null,
      status: 'activo',
    });
  });
});

