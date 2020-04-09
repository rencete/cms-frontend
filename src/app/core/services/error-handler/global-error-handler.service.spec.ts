import { TestBed } from '@angular/core/testing';

import { GlobalErrorHandlerService } from './global-error-handler.service';
import { ErrorDisplayService } from "@core/services/error-display/error-display.service";

describe('GlobalErrorHandlerService', () => {
  let service: GlobalErrorHandlerService;
  let testError: Error;
  let mockErrorDisplayService: ErrorDisplayService;

  beforeEach(() => {
    const displayService = jasmine.createSpyObj("ErrorDisplayService", ["addErrorToDisplay"]);

    TestBed.configureTestingModule({
      providers: [
        {provide: ErrorDisplayService, useValue: displayService}
      ]
    });
    service = TestBed.inject(GlobalErrorHandlerService);

    testError = new Error("test");
  });

  beforeEach(() => {
    spyOn(console, "error");
    mockErrorDisplayService = TestBed.inject<ErrorDisplayService>(ErrorDisplayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log the error to console', () => {
    service.handleError(testError);

    expect(console.error).toHaveBeenCalled();
  });

  it('should send the error to service for displaying', () => {
    service.handleError(testError);

    expect(mockErrorDisplayService.addErrorToDisplay).toHaveBeenCalled();
  });
});
