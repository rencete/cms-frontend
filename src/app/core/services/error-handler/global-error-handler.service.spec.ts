import { TestBed } from '@angular/core/testing';

import { GlobalErrorHandlerService } from './global-error-handler.service';
import { ErrorDisplayService } from "@core/services/error-display/error-display.service";
import { RemoteLoggingService } from "@core/services/remote-logging/remote-logging.service";
import { Observable, of } from 'rxjs';

describe('GlobalErrorHandlerService', () => {
  let service: GlobalErrorHandlerService;
  let testError: Error;
  let mockErrorDisplayService: ErrorDisplayService;
  let mockRemoteLoggingService: RemoteLoggingService;

  beforeEach(() => {
    testError = new Error("test");
    const displayService = createMockDisplayService();
    const loggingService = createMockRemoteLoggingService(of(testError));
    prepareTestBed(displayService, loggingService);
  });

  function createMockDisplayService(): { addErrorToDisplay: jasmine.Spy } {
    let mockDisplayService = jasmine.createSpyObj("ErrorDisplayService", ["addErrorToDisplay"]);
    mockDisplayService.addErrorToDisplay.and.callFake((err) => {
      expect(err).toEqual(testError);
    });
    return mockDisplayService;
  }

  function createMockRemoteLoggingService(returnObs: Observable<Error>): { remoteLog: jasmine.Spy } {
    let mockLoggingService = jasmine.createSpyObj("RemoteLoggingService", ["remoteLog"]);
    mockLoggingService.remoteLog.and.callFake((err) => {
      expect(err).toEqual(testError);
      return returnObs;
    });
    return mockLoggingService;
  }

  function prepareTestBed(
    mockDisplayService: { addErrorToDisplay: jasmine.Spy<InferableFunction>; },
    mockLoggingService: { remoteLog: jasmine.Spy<InferableFunction>; }
  ) {
    TestBed.configureTestingModule({
      providers: [
        { provide: ErrorDisplayService, useValue: mockDisplayService },
        { provide: RemoteLoggingService, useValue: mockLoggingService }
      ]
    });
    service = TestBed.inject(GlobalErrorHandlerService);
  }

  beforeEach(() => {
    spyOn(console, "error");
    mockErrorDisplayService = TestBed.inject<ErrorDisplayService>(ErrorDisplayService);
    mockRemoteLoggingService = TestBed.inject<RemoteLoggingService>(RemoteLoggingService);
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

  it('should send the error to remote logging', () => {
    service.handleError(testError);

    expect(mockRemoteLoggingService.remoteLog).toHaveBeenCalled();
  });
});
