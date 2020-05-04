import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { ErrorFacade } from './error-facade.service';
import { ErrorStoreService } from './error-store.service';
import { ErrorData } from '@app/error/models/error-data.model';
import { RemoteLoggingService } from '@app/core/services/remote-logging/remote-logging.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('ErrorFacade', () => {
  let service: ErrorFacade;
  let mockStore: {
    unreadErrors$: Observable<ErrorData[]>;
    addError: jasmine.Spy;
    markAsRead: jasmine.Spy;
  };
  let mockRemoteLog: {
    remoteLog: jasmine.Spy;
  };
  const testErrorData: ErrorData[] = [
    { id: "1", name: "Error 1", message: "This is sample error 1" },
    { id: "2", name: "Error 2", message: "This is sample error 2" },
    { id: "3", name: "Error 3", message: "This is sample error 3" },
  ];

  beforeEach(() => {
    let errorStoreMock = jasmine.createSpyObj("ErrorStoreService", ["addError", "markAsRead"]);
    errorStoreMock.unreadErrors$ = new Observable((subcriber) => {
      subcriber.next(testErrorData);
    })
    let remoteLogMock = jasmine.createSpyObj("RemoteLoggingService", ["remoteLog"]);
    remoteLogMock.remoteLog.and.callFake(() => {
      return new Observable<any>((s) => {
        s.complete();
      })
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: ErrorStoreService, useValue: errorStoreMock },
        { provide: RemoteLoggingService, useValue: remoteLogMock }
      ]
    });
    service = TestBed.inject(ErrorFacade);
    mockStore = TestBed.get(ErrorStoreService);
    mockRemoteLog = TestBed.get(RemoteLoggingService);
  });

  it('should get list of unread errors as observable', (done) => {
    let obs = service.getUnreadErrors();
    obs.subscribe(
      (values) => {
        expect(values).toEqual(testErrorData);
        done();
      }
    );
  });

  it('should pass Error ID to ErrorStore to mark as read', () => {
    const testId = "test-id";
    service.markErrorAsRead(testId);
    expect(mockStore.markAsRead).toHaveBeenCalledWith(testId);
  });

  it('should pass Error to Store to add errors', () => {
    const testError = new Error("This is a test error");
    service.handleError(testError);
    expect(mockStore.addError).toHaveBeenCalledWith(testError);
  });

  it('should send the error to remote logging', () => {
    const testError = new Error("This is a test error");
    service.handleError(testError);

    expect(mockRemoteLog.remoteLog).toHaveBeenCalledTimes(1);
  });

  it('should send error response from remote logging to error store', () => {
    const errorResponse = new HttpErrorResponse({ status: 404, statusText: "Test Error" })
    mockRemoteLog.remoteLog.and.callFake(() => {
      return new Observable<any>((s) => {
        s.error(errorResponse);
      });
    });
    const testError = new Error("This is a test error");
    service.handleError(testError);

    expect(mockStore.addError).toHaveBeenCalledTimes(2);
    expect(mockStore.addError).toHaveBeenCalledWith(errorResponse);
  });
});
