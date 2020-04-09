import { TestBed } from '@angular/core/testing';

import { GlobalErrorHandlerService } from './global-error-handler.service';

describe('GlobalErrorHandlerService', () => {
  let service: GlobalErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalErrorHandlerService);
  });

  beforeEach(() => {
    spyOn(console, "log");
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log the error to console', () => {
    const testError = new Error("test");
    service.handleError(testError);

    expect(console.log).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(testError);
  });
});
