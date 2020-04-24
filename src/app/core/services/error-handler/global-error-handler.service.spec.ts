import { TestBed } from '@angular/core/testing';

import { GlobalErrorHandlerService } from './global-error-handler.service';
import { ErrorStoreService } from "@app/error/services/error-store.service";
import { RemoteLoggingService } from "@core/services/remote-logging/remote-logging.service";
import { Observable, of, throwError, TimeoutError } from 'rxjs';

xdescribe('GlobalErrorHandlerService', () => {
  let service: GlobalErrorHandlerService;
  let testError: Error;
  let mockErrorDisplayService: ErrorStoreService;
  let mockRemoteLoggingService: RemoteLoggingService;

  describe("Success tests", () => {
    beforeEach(() => {
      testError = new Error("test");
      const displayService = createMockDisplayService();
      const loggingService = createMockRemoteLoggingService(of(testError));
      prepareTestBed(displayService, loggingService);
    });
  
    beforeEach(() => {
      spyOn(console, "error");
      mockErrorDisplayService = TestBed.inject<ErrorStoreService>(ErrorStoreService);
      mockRemoteLoggingService = TestBed.inject<RemoteLoggingService>(RemoteLoggingService);
    });
  
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  
    it('should log the error to console', () => {
      service.handleError(testError);
  
      expect(console.error).toHaveBeenCalledTimes(1);
    });
  
    it('should send the error to service for displaying', () => {
      service.handleError(testError);
  
      expect(mockErrorDisplayService.addError).toHaveBeenCalledTimes(1);
    });
  
    it('should send the error to remote logging', () => {
      service.handleError(testError);
  
      expect(mockRemoteLoggingService.remoteLog).toHaveBeenCalledTimes(1);
    });

  });

  function createMockDisplayService(): { addErrorToDisplay: jasmine.Spy } {
    let mockDisplayService = jasmine.createSpyObj("ErrorDisplayService", ["addErrorToDisplay"]);
    return mockDisplayService;
  }

  function createMockRemoteLoggingService(returnObs: Observable<Error>): { remoteLog: jasmine.Spy } {
    let mockLoggingService = jasmine.createSpyObj("RemoteLoggingService", ["remoteLog"]);
    mockLoggingService.remoteLog.and.callFake(() => { return returnObs });
    return mockLoggingService;
  }

  function prepareTestBed(
    mockDisplayService: { addErrorToDisplay: jasmine.Spy<InferableFunction>; },
    mockLoggingService: { remoteLog: jasmine.Spy<InferableFunction>; }
  ) {
    TestBed.configureTestingModule({
      providers: [
        { provide: ErrorStoreService, useValue: mockDisplayService },
        { provide: RemoteLoggingService, useValue: mockLoggingService }
      ]
    });
    service = TestBed.inject(GlobalErrorHandlerService);
  }

  describe("Error tests", () => {
    let loggingError: Error;

    beforeEach(() => {
      testError = new Error("test");
      loggingError = new TimeoutError();
      const displayService = createMockDisplayService();
      const loggingService = createMockRemoteLoggingService(throwError(loggingError));
      prepareTestBed(displayService, loggingService);
    });
  
    beforeEach(() => {
      spyOn(console, "error");
      mockErrorDisplayService = TestBed.inject<ErrorStoreService>(ErrorStoreService);
      mockRemoteLoggingService = TestBed.inject<RemoteLoggingService>(RemoteLoggingService);
    });

    it("should log the remote logging error to console", () => {
      service.handleError(testError);  

      expect(console.error).toHaveBeenCalledTimes(2);
      expect(console.error).toHaveBeenCalledWith(testError);
      expect(console.error).toHaveBeenCalledWith(loggingError);
    });
  
    it('should send the remote logging error to display service', () => {
      service.handleError(testError);
  
      expect(mockErrorDisplayService.addError).toHaveBeenCalledTimes(2);
      expect(mockErrorDisplayService.addError).toHaveBeenCalledWith(testError);
      expect(mockErrorDisplayService.addError).toHaveBeenCalledWith(loggingError);
    });
  });
});
