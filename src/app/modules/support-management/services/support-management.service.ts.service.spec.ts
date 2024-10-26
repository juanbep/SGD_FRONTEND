import { TestBed } from '@angular/core/testing';

import { SupportManagementServiceTsService } from './support-management.service';

describe('SupportManagementServiceTsService', () => {
  let service: SupportManagementServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupportManagementServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
